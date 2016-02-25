var _ = require('underscore');
var async = require('async');

var gradingService = require('../../services/gradingService');
var lastIdService = require('../../services/lastIdService');
var problemService = require('../../services/problemService');
var userService = require('../../services/userService');

var acceptedSubmissionEvaluator = {};

var codeAccepted = "AC";

var getUserJidToAcceptedSubmissionCountMap = function (gradings) {
  var map = {};
  gradings.forEach(function (grading) {
    if (grading.getVerdictCode() == codeAccepted) {
      var userJid = grading.getUserJid();
      if (map.hasOwnProperty(userJid)) {
        map[userJid] = map[userJid] + 1;
      } else {
        map[userJid] = 1;
      }
    }
  });

  return map;
};

var getProblemJidToAcceptedSubmissionCountMap = function (gradings) {
  var map = {};
  gradings.forEach(function (grading) {
    if (grading.getVerdictCode() == codeAccepted) {
      var problemJid = grading.getProblemJid();
      if (map.hasOwnProperty(problemJid)) {
        map[problemJid] = map[problemJid] + 1;
      } else {
        map[problemJid] = 1;
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
      var userAcceptedSubmissionMap = getUserJidToAcceptedSubmissionCountMap(gradings);
      var userJids = _.map(userAcceptedSubmissionMap, function (value, key) {
        return key;
      });

      async.each(userJids, function (userJid, callback) {
        userService.incrementAcceptedSubmissionCount(userJid, userAcceptedSubmissionMap[userJid], function (err) {
          callback(err);
        });
      }, function (err) {
        callback(err, gradings);
      });
    }, function (gradings, callback) {
      var problemAcceptedSubmissionMap = getProblemJidToAcceptedSubmissionCountMap(gradings);
      var problemJids = _.map(problemAcceptedSubmissionMap, function (value, key) {
        return key;
      });

      async.each(problemJids, function (problemJid, callback) {
        problemService.incrementAcceptedSubmissionCount(problemJid, problemAcceptedSubmissionMap[problemJid], function (err) {
          callback(err);
        });
      }, function (err) {
        callback(err, gradings);
      });
    }, function (gradings, callback) {
      var maxId = _.max(gradings, function (grading) {
        return grading.getId();
      }).getId();

      lastIdService.updateLastId(lastIdService.ACCEPTED_SUBMISSION_EVALUATED_LAST_ID, maxId, function (err) {
        callback(err, gradings.length);
      });
    }
  ], function (err, gradingCount) {
    callback(err, gradingCount);
  });
};

module.exports = acceptedSubmissionEvaluator;