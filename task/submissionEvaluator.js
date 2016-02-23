var _ = require('underscore');
var async = require('async');

var lastIdService = require('../services/lastIdService');
var problemService = require('../services/problemService');
var submissionService = require('../services/submissionService');
var userService = require('../services/userService');

var submissionEvaluator = {};

var getMaxId = function (submissions) {
  var maxId = 0;
  submissions.forEach(function (submission) {
    maxId = Math.max(submission.getId());
  });

  return maxId;
};

var getUserSubmissionCountMap = function (submissions) {
  var submissionCountMap = {};
  submissions.forEach(function (submission) {
    if (submissionCountMap.hasOwnProperty(submission.getUserJid())) {
      submissionCountMap[submission.getUserJid()] = submissionCountMap[submission.getUserJid()] + 1;
    } else {
      submissionCountMap[submission.getUserJid()] = 1;
    }
  });

  return submissionCountMap;
};

var getProblemSubmissionCountMap = function (submissions) {
  var problemCountMap = {};
  submissions.forEach(function (submission) {
    if (problemCountMap.hasOwnProperty(submission.getProblemJid())) {
      problemCountMap[submission.getProblemJid()] = problemCountMap[submission.getProblemJid()] + 1;
    } else {
      problemCountMap[submission.getProblemJid()] = 1;
    }
  });

  return problemCountMap;
};

// TODO: it should use transaction
// TODO: does not handle the case if problem_jid and submission_jid is missing
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
      var userJids = _.map(userSubmissionCountMap, function (value, key) {
        return key;
      });

      async.each(userJids, function (userJid, callback) {
        userService.incrementSubmissionCount(userJid, userSubmissionCountMap[userJid], function (err) {
          callback(err);
        });
      }, function (err) {
        callback(err, submissions);
      });
    }, function (submissions, callback) {
      var problemSubmissionCountMap = getProblemSubmissionCountMap(submissions);
      var problemJids = _.map(problemSubmissionCountMap, function (value, key) {
        return key;
      });

      async.each(problemJids, function (problemJid, callback) {
        problemService.incrementSubmissionCount(problemJid, problemSubmissionCountMap[problemJid], function (err) {
          callback(err);
        });
      }, function (err) {
        callback(err, submissions);
      });
    }, function (submissions, callback) {
      var maxId = getMaxId(submissions);
      lastIdService.updateLastId(lastIdService.SUBMISSION_EVALUATED_LAST_ID, maxId, function (err) {
        callback(err, submissions.length);
      });
    }
  ], function (err, submissionEvaluated) {
    callback(err, submissionEvaluated);
  });
};

module.exports = submissionEvaluator;