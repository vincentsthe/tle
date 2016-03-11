var _ = require('underscore');

var redisClient = require('../core/redisClient');
var submissionService = require('../services/submissionService');

var recentSubmissionService = {};

var MAX_SUBMISSION_STORED = 100;
var RECENT_SUBMISSION_REDIS_LIST = "recent_submission";

recentSubmissionService.init = function (callback) {
  submissionService.getLatestSubmission(MAX_SUBMISSION_STORED, function (err, submissions) {
    if (err) {
      callback(err);
    } else {
      var submissionIds = _.map(submissions, function (submission) {
        return submission.getId();
      });
      recentSubmissionService.insertNewSubmissionNewestFirstIndex(submissionIds, function (err) {
        callback(err);
      })
    }
  })
};

recentSubmissionService.getLatestSubmission = function (limit, callback) {
  var args = [RECENT_SUBMISSION_REDIS_LIST, 0, limit - 1];
  redisClient.lrange(args, function (err, submissionIds) {
    if (err) {
      callback(err);
    } else {
      submissionService.getSubmissionIdToSubmissionMap(submissionIds, function (err, map) {
        if (err) {
          callback(err);
        } else {
          var submissions = _.map(submissionIds, function (submissionId) {
            return map[submissionId];
          });

          callback(null, submissions);
        }
      });
    }
  });
};

recentSubmissionService.insertNewSubmissionNewestFirstIndex = function (submissionIds, callback) {
  recentSubmissionService.insertNewSubmissionOldestFirstIndex(submissionIds.reverse(), callback);
};

recentSubmissionService.insertNewSubmissionOldestFirstIndex = function (submissionIds, callback) {
  var args = [RECENT_SUBMISSION_REDIS_LIST];
  submissionIds.forEach(function (submissionId) {
    args.push(submissionId);
  });

  redisClient.lpush(args, function (err, reply) {
    if (err) {
      callback(err);
    } else {
      if (reply > MAX_SUBMISSION_STORED) {
        for (var i = 0; i < reply - MAX_SUBMISSION_STORED; i++) {
          redisClient.rpop(RECENT_SUBMISSION_REDIS_LIST);
        }
      }

      callback(null);
    }
  });
};

module.exports = recentSubmissionService;