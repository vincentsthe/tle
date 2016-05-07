var _ = require('underscore');
var async = require('async');

var knexConnection = require('../core/knexConnection');
var cache = require('../core/cache');
var Problem = require('../models/Problem');
var ProblemModel = require('../models/db/index').ProblemModel;

var REDIS_PROBLEM_ID_PREFIX = "problem:id:";
var REDIS_PROBLEM_EXPIRATION_TIME = 7200;

var problemService = {};

var constructProblemFromModel = function (problemModel) {
  var problem = new Problem();
  problem.setId(problemModel.id)
        .setProblemJid(problemModel.problemJid)
        .setSlug(problemModel.slug)
        .setCreateTime(problemModel.createTime)
        .setAcceptedUser(problemModel.acceptedUser)
        .setTotalSubmission(problemModel.totalSubmission)
        .setAcceptedSubmission(problemModel.acceptedSubmission)
        .setUrl(problemModel.url);

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
    }
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
    limit: limit
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
    limit: limit
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
    url: url,
    acceptedUser: 0,
    totalSubmission: 0,
    acceptedSubmission: 0
  }).then(function () {
    callback();
  }, function (err) {
    callback(err);
  });
};

problemService.incrementSubmissionCount = function (problemId, count, callback) {
  ProblemModel.findOne({
    where: {
      id: problemId
    }
  }).then(function (problem) {
    if (problem) {
      problem.update({
        totalSubmission: problem.totalSubmission + count
      }).then(function () {
        callback(null);
      }, function (err) {
        callback(err);
      });
    } else {
      callback(null);
    }
  }, function (err) {
    callback(err);
  });
};

problemService.incrementAcceptedSubmissionCount = function (problemId, count, callback) {
  ProblemModel.findOne({
    where: {
      id: problemId
    }
  }).then(function (problem) {
    if (problem) {
      problem.update({
        acceptedSubmission: problem.acceptedSubmission + count
      }).then(function () {
        callback(null);
      }, function (err) {
        callback(err);
      });
    } else {
      callback(null);
    }
  }, function (err) {
    callback(err);
  });
};

problemService.incrementAcceptedUserCount = function (problemId, count, callback) {
  ProblemModel.findOne({
    where: {
      id: problemId
    }
  }).then(function (problem) {
    if (problem) {
      problem.update({
        acceptedUser: problem.acceptedUser + count
      }).then(function () {
        callback(null);
      }, function (err) {
        callback(err);
      });
    } else {
      callback(null);
    }
  }, function (err) {
    callback(err);
  });
};

module.exports = problemService;
