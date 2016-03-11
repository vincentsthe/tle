var _ = require('underscore');
var async = require('async');

var gradingService = require('../../services/gradingService');
var lastIdService = require('../../services/lastIdService');
var problemService = require('../../services/problemService');
var userService = require('../../services/userService');

var acceptedSubmissionEvaluator = {};

var codeAccepted = "AC";

var getUserIdToAcceptedSubmissionCountMap = function (gradings) {
  var map = {};
  gradings.forEach(function (grading) {
    if (grading.getVerdictCode() == codeAccepted) {
      var userId = grading.getUserId();
      if (map.hasOwnProperty(userId)) {
        map[userId] = map[userId] + 1;
      } else {
        map[userId] = 1;
      }
    }
  });

  return map;
};

var getProblemIdToAcceptedSubmissionCountMap = function (gradings) {
  var map = {};
  gradings.forEach(function (grading) {
    if (grading.getVerdictCode() == codeAccepted) {
      var problemId = grading.getProblemId();
      if (map.hasOwnProperty(problemId)) {
        map[problemId] = map[problemId] + 1;
      } else {
        map[problemId] = 1;
      }
    }
  });

  return map;
};

acceptedSubmissionEvaluator.evaluateAcceptedSubmission = function (limit, callback) {
  async.waterfall([
    function (callback) {
      lastIdService.getKeyLastId(lastIdService.ACCEPTED_SUBMISSION_EVALUATED_LAST_ID, function (err, lastId) {
        callback(err, lastId);
      });
    }, function (lastId, callback) {
      gradingService.getGradingDataByLastId(lastId, limit, function (err, gradings) {
        callback(err, gradings);
      });
    }, function (gradings, callback) {
      var userAcceptedSubmissionMap = getUserIdToAcceptedSubmissionCountMap(gradings);
      var userIds = _.map(userAcceptedSubmissionMap, function (value, key) {
        return key;
      });

      async.each(userIds, function (userId, callback) {
        userService.incrementAcceptedSubmissionCount(userId, userAcceptedSubmissionMap[userId], function (err) {
          callback(err);
        });
      }, function (err) {
        callback(err, gradings);
      });
    }, function (gradings, callback) {
      var problemAcceptedSubmissionMap = getProblemIdToAcceptedSubmissionCountMap(gradings);
      var problemIds = _.map(problemAcceptedSubmissionMap, function (value, key) {
        return key;
      });

      async.each(problemIds, function (problemId, callback) {
        problemService.incrementAcceptedSubmissionCount(problemId, problemAcceptedSubmissionMap[problemId], function (err) {
          callback(err);
        });
      }, function (err) {
        callback(err, gradings);
      });
    }, function (gradings, callback) {
      var maxId = 0;
      if (gradings.length) {
        maxId = _.max(gradings, function (grading) {
          return grading.getId();
        }).getId();
      }

      lastIdService.updateLastId(lastIdService.ACCEPTED_SUBMISSION_EVALUATED_LAST_ID, maxId, function (err) {
        callback(err, gradings.length);
      });
    }
  ], function (err, gradingCount) {
    callback(err, gradingCount);
  });
};

module.exports = acceptedSubmissionEvaluator;