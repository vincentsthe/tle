var _ = require('underscore');
var async = require('async');

var gradingService = require('../../services/gradingService');
var lastIdService = require('../../services/lastIdService');
var problemRankService = require('../../tleModuleServices/problemRankService');
var problemService = require('../../services/problemService');
var userRankService = require('../../tleModuleServices/userRankService');
var userService = require('../../services/userService');

var acceptedUserProblemEvaluator = {};

var VERDICT_CODE_ACCEPTED = "AC";

var getDistinctAcceptedSubmission = function (gradings) {
  var userProblemSet = {};
  var distinctAcceptedSubmission = [];

  gradings.forEach(function (grading) {
    if (grading.getVerdictCode() == VERDICT_CODE_ACCEPTED) {
      var hash = grading.getUserId() + "-" + grading.getProblemId();
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
        if (gradings.length) {
          maxId = _.max(gradings, function (grading) {
            return grading.getId();
          }).getId();
        }

        callback(err, gradings);
      });
    }, function (gradings, callback) {
      var distinctAcceptedSubmission = getDistinctAcceptedSubmission(gradings);
      var newDistinctAcceptedSubmission = [];

      async.each(distinctAcceptedSubmission, function (submission, callback) {
        userService.isUserAcceptedInProblem(submission.getUserId(), submission.getProblemId(), function (err, exist) {
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
        userService.markUserAcceptedInProblem(submission.getUserId(), submission.getProblemId(), function (err) {
          callback(err);
        });
      }, function (err) {
        callback(err, newDistinctAcceptedSubmission);
      });
    }, function (newSubmission, callback) {
      var userIdToCountMap = {};
      newSubmission.forEach(function (submission) {
        if (userIdToCountMap.hasOwnProperty(submission.getUserId())) {
          userIdToCountMap[submission.getUserId()] = userIdToCountMap[submission.getUserId()] + 1;
        } else {
          userIdToCountMap[submission.getUserId()] = 1;
        }
      });
      var userIds = _.map(userIdToCountMap, function (value, key) {
        return key;
      });

      async.each(userIds, function (userId, callback) {
        userService.incrementAcceptedProblemCount(userId, userIdToCountMap[userId], function (err) {
          if (err) {
            callback(err);
          } else {
            //userRankService.incrementAcceptedProblem(userId, userIdToCountMap[userId], function (err) {
              callback(err);
            //});
          }
        });
      }, function (err) {
        callback(err, newSubmission);
      });
    }, function (newSubmission, callback) {
      var problemIdToCountMap = {};
      newSubmission.forEach(function (submission) {
        if (problemIdToCountMap.hasOwnProperty(submission.getProblemId())) {
          problemIdToCountMap[submission.getProblemId()] = problemIdToCountMap[submission.getProblemId()] + 1;
        } else {
          problemIdToCountMap[submission.getProblemId()] = 1;
        }
      });
      var problemIds = _.map(problemIdToCountMap, function (value, key) {
        return key;
      });

      async.each(problemIds, function (problemId, callback) {
        problemService.incrementAcceptedUserCount(problemId, problemIdToCountMap[problemId], function (err) {
          if (err) {
            callback(err);
          } else {
            //problemRankService.incrementAcceptedUser(problemId, problemIdToCountMap[problemId], function (err) {
              callback(err);
            //});
          }
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