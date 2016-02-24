var _ = require('underscore');
var async = require('async');

var gradingService = require('../services/gradingService');
var lastIdService = require('../services/lastIdService');
var problemService = require('../services/problemService');
var userService = require('../services/userService');

var acceptedUserProblemEvaluator = {};

var VERDICT_CODE_ACCEPTED = "AC";

var getDistictAcceptedSubmission = function (gradings) {
  var userProblemSet = {};
  var distinctAcceptedSubmission = [];

  gradings.forEach(function (grading) {
    if (grading.getVerdictCode() == VERDICT_CODE_ACCEPTED) {
      var hash = grading.getUserJid() + "-" + grading.getProblemJid();
      if (!userProblemSet.hasOwnProperty(hash)) {
        userProblemSet[hash] = 1;
        distinctAcceptedSubmission.push(grading);
      }
    }
  });

  return distinctAcceptedSubmission;
};

acceptedUserProblemEvaluator.evaluateAcceptedUserProblem = function (limit, callback) {
  var maxId = 0;

  async.waterfall([
    function (callback) {
      lastIdService.getKeyLastId(lastIdService.ACCEPTED_PROBLEM_EVALUATED_LAST_ID, function (err, lastId) {
        callback(err, lastId);
      });
    }, function (lastId, callback) {
      gradingService.getGradingDataByLastId(lastId, limit, function (err, gradings) {
        maxId = _.max(gradings, function (grading) {
          return grading.getId();
        }).getId();

        callback(err, gradings);
      });
    }, function (gradings, callback) {
      var distinctAcceptedSubmission = getDistictAcceptedSubmission(gradings);
      var newDistinctAcceptedSubmission = [];

      async.each(distinctAcceptedSubmission, function (submission, callback) {
        userService.isUserAcceptedInProblem(submission.getUserJid(), submission.getProblemJid(), function (err, exist) {
          if (err) {
            callback(err);
          } else {
            if (!exist) {
              newDistinctAcceptedSubmission.push(submission);
            }
            callback(null);
          }
        });
      }, function (err) {
        callback(err, newDistinctAcceptedSubmission);
      });
    }, function (newDistinctAcceptedSubmission, callback) {
      async.each(newDistinctAcceptedSubmission, function (submission, callback) {
        userService.markUserAcceptedInProblem(submission.getUserJid(), submission.getProblemJid(), function (err) {
          callback(err);
        });
      }, function (err) {
        callback(err, newDistinctAcceptedSubmission);
      });
    }, function (newSubmission, callback) {
      var userJidToCountMap = {};
      newSubmission.forEach(function (submission) {
        if (userJidToCountMap.hasOwnProperty(submission.getUserJid())) {
          userJidToCountMap[submission.getUserJid()] = userJidToCountMap[submission.getUserJid()] + 1;
        } else {
          userJidToCountMap[submission.getUserJid()] = 1;
        }
      });
      var userJids = _.map(userJidToCountMap, function (value, key) {
        return key;
      });

      async.each(userJids, function (userJid, callback) {
        userService.incrementAcceptedProblemCount(userJid, userJidToCountMap[userJid], function (err) {
          callback(err);
        });
      }, function (err) {
        callback(err, newSubmission);
      });
    }, function (newSubmission, callback) {
      var problemJidToCountMap = {};
      newSubmission.forEach(function (submission) {
        if (problemJidToCountMap.hasOwnProperty(submission.getProblemJid())) {
          problemJidToCountMap[submission.getProblemJid()] = problemJidToCountMap[submission.getProblemJid()] + 1;
        } else {
          problemJidToCountMap[submission.getProblemJid()] = 1;
        }
      });
      var problemJids = _.map(problemJidToCountMap, function (value, key) {
        return key;
      });

      async.each(problemJids, function (problemJid, callback) {
        problemService.incrementAcceptedUserCount(problemJid, problemJidToCountMap[problemJid], function (err) {
          callback(err);
        });
      }, function (err) {
        callback(err, newSubmission);
      });
    }, function (newSubmission, callback) {
      lastIdService.updateLastId(lastIdService.ACCEPTED_PROBLEM_EVALUATED_LAST_ID, maxId, function (err) {
        callback(err, newSubmission.length);
      });
    }
  ], function (err, count) {
    callback(err, count);
  });
};

module.exports = acceptedUserProblemEvaluator;