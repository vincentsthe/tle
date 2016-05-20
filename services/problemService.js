var _ = require('underscore');
var async = require('async');
var ReadWriteLock = require('rwlock');

var knexConnection = require('../core/knexConnection');
var cache = require('../core/cache');
var Problem = require('../models/Problem');
var ProblemModel = require('../models/db/index').ProblemModel;
var ProblemStatisticModel = require('../models/db/index').ProblemStatisticModel;

var LOCK_PROBLEM_STATISTIC_KEY = "problem:statistic:lock:id:";
var REDIS_PROBLEM_ID_PREFIX = "problem:id:";
var REDIS_PROBLEM_EXPIRATION_TIME = 7200;

var lock = new ReadWriteLock();

var problemService = {};

var constructProblemFromModel = function (problemModel) {
  var problem = new Problem();
  problem.setId(problemModel.id)
        .setProblemJid(problemModel.problemJid)
        .setSlug(problemModel.slug)
        .setCreateTime(problemModel.createTime)
        .setUrl(problemModel.url);

  if (problemModel.statistic) {
    problem.setAcceptedUser(problemModel.statistic.acceptedUser)
      .setTotalSubmission(problemModel.statistic.totalSubmission)
      .setAcceptedSubmission(problemModel.statistic.acceptedSubmission);
  } else {
    problem.setAcceptedUser(0)
      .setTotalSubmission(0)
      .setAcceptedSubmission(0);
  }

  return problem;
};

var constructProblemFromPlainObject = function (object) {
  var problem = new Problem();
  problem.setId(object.id)
    .setProblemJid(object.problemJid)
    .setSlug(object.slug)
    .setAcceptedUser(object.acceptedUser)
    .setTotalSubmission(object.totalSubmission)
    .setAcceptedSubmission(object.acceptedSubmission)
    .setUrl(object.url);

  return problem;
};

var getProblemByIdFromDb = function (id, callback) {
  ProblemModel.findOne({
    where: {
      id: id
    },
    include: [
      {model: ProblemStatisticModel, as: 'statistic'}
    ]
  }).then(function (problemRecord) {
    var problem = constructProblemFromModel(problemRecord);
    callback(null, problem);
  }, function (err) {
    callback(err);
  });
};

problemService.getProblemById = function (id, callback) {
  var redisKey = REDIS_PROBLEM_ID_PREFIX + id;

  cache.getUpdateCacheValue(redisKey, REDIS_PROBLEM_EXPIRATION_TIME, function (callback) {
    getProblemByIdFromDb(id, function (err, problem) {
      callback(err, problem);
    });
  }, function (err, problem) {
    callback(err, constructProblemFromPlainObject(problem));
  });
};

problemService.getProblemIdToProblemMap = function (problemIds, callback) {
  problemService.getProblemByIds(problemIds, function (err, problems) {
    if (err) {
      callback(err);
    } else {
      var map = {};
      problems.forEach(function (problem) {
        map[problem.getId()] = problem;
      });

      callback(null, map);
    }
  });
};

problemService.getProblemByLastId = function (lastId, limit, callback) {
  ProblemModel.findAll({
    where: {
      id: {
        $gt: lastId
      }
    },
    limit: limit,
    include: [
      {model: ProblemStatisticModel, as: 'statistic'}
    ]
  }).then(function (problemRecords) {
    var problems = _.map(problemRecords, function (problemRecord) {
      return constructProblemFromModel(problemRecord);
    });

    callback(null, problems);
  }, function (err) {
    callback(err);
  });
};

problemService.getProblem = function (sortBy, order, offset, limit, callback) {
  ProblemModel.findAll({
    order: sortBy + " " + order,
    offset: offset,
    limit: limit,
    include: [
      {model: ProblemStatisticModel, as: 'statistic'}
    ]
  }).then(function (problemModels) {
    var problems = _.map(problemModels, function (problemModel) {
      return constructProblemFromModel(problemModel);
    });

    callback(null, problems);
  }, function (err) {
    callback(err);
  });
};

problemService.getProblemByIds = function (problemIds, callback) {
  var problems = [];
  async.each(problemIds, function (problemId, callback) {
    problemService.getProblemById(problemId, function (err, problem) {
      problems.push(problem);
      callback(err);
    });
  }, function (err) {
    callback(err, problems);
  });
};

problemService.getProblemWithMostSubmission = function (timeFrame, limit, callback) {
  var time = Math.floor(Date.now() / 1000) - timeFrame;

  var submissionQuery = knexConnection.db
                          .select("problem.id AS problem_id", knexConnection.db.raw("COUNT(submission.id) AS submission_count"))
                          .from("problem")
                          .join("submission", "problem.id", "=", "submission.problem_id")
                          .where("submission.submit_time", ">", time)
                          .groupBy("problem.id");

  var acceptedSubmissionQuery = knexConnection.db
                                  .select("problem.id AS problem_id", knexConnection.db.raw("COUNT(submission.id) AS submission_count"))
                                  .from("problem")
                                  .join("submission", "problem.id", "=", "submission.problem_id")
                                  .where("submission.submit_time", ">", time)
                                  .andWhere("submission.verdict_code", "=", 'AC')
                                  .groupBy("problem.id");

  knexConnection.db
    .select("problem.id AS problem_id", "problem.slug AS problem_slug", "problem.url AS problem_url"
      , "submission.submission_count AS submission_count" , "accepted_submission.submission_count AS accepted_submission_count")
    .from("problem")
    .joinRaw("JOIN (" + submissionQuery.toString() + ") AS submission ON problem.id = submission.problem_id")
    .joinRaw("JOIN (" + acceptedSubmissionQuery.toString() + ") AS accepted_submission ON problem.id = accepted_submission.problem_id")
    .limit(limit)
    .orderBy("submission_count", "DESC")
    .then(function (problems) {
      callback(null, problems);
    }, function (err) {
      callback(err);
    });
};

problemService.insertProblem = function (id, problemJid, slug, createTime, url, callback) {
  ProblemModel.create({
    id: id,
    problemJid: problemJid,
    slug: slug,
    createTime: createTime,
    url: url
  }).then(function () {
    callback();
  }, function (err) {
    callback(err);
  });
};

problemService.incrementSubmissionCount = function (problemId, count, callback) {
  var key = LOCK_PROBLEM_STATISTIC_KEY + problemId;

  lock.writeLock(key, function (release) {
    ProblemStatisticModel.findOne({
      where: {
        problemId: problemId
      }
    }).then(function (statistic) {
      if (statistic) {
        return statistic.update({
          totalSubmission: statistic.totalSubmission + count
        });
      } else {
        return ProblemStatisticModel.create({
          problemId: problemId,
          acceptedUser: 0,
          totalSubmission: count,
          acceptedSubmission: 0
        });
      }
    }).then(function () {
      release();
      callback(null);
    }, function (err) {
      release();
      callback(err);
    });
  });
};

problemService.incrementAcceptedSubmissionCount = function (problemId, count, callback) {
  var key = LOCK_PROBLEM_STATISTIC_KEY + problemId;

  lock.writeLock(key, function (release) {
    ProblemStatisticModel.findOne({
      where: {
        problemId: problemId
      }
    }).then(function (statistic) {
      if (statistic) {
        return statistic.update({
          acceptedSubmission: statistic.acceptedSubmission + count
        });
      } else {
        return ProblemStatisticModel.create({
          problemId: problemId,
          acceptedUser: 0,
          totalSubmission: 0,
          acceptedSubmission: count
        });
      }
    }).then(function () {
      release();
      callback(null);
    }, function (err) {
      release();
      callback(err);
    });
  });
};

problemService.incrementAcceptedUserCount = function (problemId, count, callback) {
  var key = LOCK_PROBLEM_STATISTIC_KEY + problemId;

  lock.writeLock(key, function (release) {
    ProblemStatisticModel.findOne({
      where: {
        problemId: problemId
      }
    }).then(function (statistic) {
      if (statistic) {
        return statistic.update({
          acceptedUser: statistic.acceptedUser + count
        });
      } else {
        return ProblemStatisticModel.create({
          problemId: problemId,
          acceptedUser: count,
          totalSubmission: 0,
          acceptedSubmission: 0
        });
      }
    }).then(function () {
      release();
      callback(null);
    }, function (err) {
      release();
      callback(err);
    });
  });
};

module.exports = problemService;
