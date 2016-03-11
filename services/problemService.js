var _ = require('underscore');
var async = require('async');

var Problem = require('../models/Problem');
var ProblemModel = require('../models/db/index').ProblemModel;
var redisClient = require('../core/redisClient');

var REDIS_PROBLEM_ID_PREFIX = "problem:id:";
var REDIS_PROBLEM_EXPIRATION_TIME = 7200;

var problemService = {};

var constructProblemFromModel = function (problemModel) {
  var problem = new Problem();
  problem.setId(problemModel.id)
        .setProblemJid(problemModel.problemJid)
        .setSlug(problemModel.slug)
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

  redisClient.get(redisKey, function (err, problem) {
    if (err) {
      callback(err);
    } else if (problem) {
      problem = JSON.parse(problem);
      redisClient.expire(redisKey, REDIS_PROBLEM_EXPIRATION_TIME);
      callback(null, constructProblemFromPlainObject(problem));
    } else {
      getProblemByIdFromDb(id, function (err, problem) {
        if (err) {
          callback(err);
        } else {
          var problemString = JSON.stringify(problem);
          redisClient.set(redisKey, problemString);
          redisClient.expire(redisKey, REDIS_PROBLEM_EXPIRATION_TIME);

          callback(null, problem);
        }
      });
    }
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

problemService.insertProblem = function (id, problemJid, slug, url, callback) {
  ProblemModel.create({
    id: id,
    problemJid: problemJid,
    slug: slug,
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
