var _ = require('underscore');
var async = require('async');

var lastIdService = require('../../services/lastIdService');
var problemService = require('../../services/problemService');
var submissionService = require('../../services/submissionService');
var userService = require('../../services/userService');

var submissionEvaluator = {};

var getUserSubmissionCountMap = function (submissions) {
  var submissionCountMap = {};
  submissions.forEach(function (submission) {
    if (submissionCountMap.hasOwnProperty(submission.getUserId())) {
      submissionCountMap[submission.getUserId()] = submissionCountMap[submission.getUserId()] + 1;
    } else {
      submissionCountMap[submission.getUserId()] = 1;
    }
  });

  return submissionCountMap;
};

var getProblemSubmissionCountMap = function (submissions) {
  var problemCountMap = {};
  submissions.forEach(function (submission) {
    if (problemCountMap.hasOwnProperty(submission.getProblemId())) {
      problemCountMap[submission.getProblemId()] = problemCountMap[submission.getProblemId()] + 1;
    } else {
      problemCountMap[submission.getProblemId()] = 1;
    }
  });

  return problemCountMap;
};

submissionEvaluator.evaluateSubmission = function (limit, callback) {
  async.waterfall([
    function (callback) {
      lastIdService.getKeyLastId(lastIdService.SUBMISSION_EVALUATED_LAST_ID, function (err, lastId) {
        callback(err, lastId);
      });
    }, function (lastId, callback) {
      submissionService.getSubmissionByLastId(lastId, limit, function (err, submissions) {
        callback(err, submissions);
      });
    }, function (submissions, callback) {
      var userSubmissionCountMap = getUserSubmissionCountMap(submissions);
      var userIds = _.map(userSubmissionCountMap, function (value, key) {
        return key;
      });

      async.each(userIds, function (userId, callback) {
        userService.incrementSubmissionCount(userId, userSubmissionCountMap[userId], function (err) {
          callback(err);
        });
      }, function (err) {
        callback(err, submissions);
      });
    }, function (submissions, callback) {
      var problemSubmissionCountMap = getProblemSubmissionCountMap(submissions);
      var problemIds = _.map(problemSubmissionCountMap, function (value, key) {
        return key;
      });

      async.each(problemIds, function (problemId, callback) {
        problemService.incrementSubmissionCount(problemId, problemSubmissionCountMap[problemId], function (err) {
          callback(err);
        });
      }, function (err) {
        callback(err, submissions);
      });
    }, function (submissions, callback) {
      var maxId = 0;
      if (submissions.length) {
        maxId = _.max(submissions, function (submission) {
          return submission.getId();
        }).getId();
      }

      lastIdService.updateLastId(lastIdService.SUBMISSION_EVALUATED_LAST_ID, maxId, function (err) {
        callback(err, submissions.length);
      });
    }
  ], function (err, submissionEvaluated) {
    callback(err, submissionEvaluated);
  });
};

module.exports = submissionEvaluator;