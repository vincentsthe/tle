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
      var submissionJids = _.map(submissions, function (submission) {
        return submission.getSubmissionJid();
      });
      recentSubmissionService.insertNewSubmissionNewestFirstIndex(submissionJids, function (err) {
        callback(err);
      })
    }
  })
};

recentSubmissionService.getLatestSubmission = function (limit, callback) {
  var args = [RECENT_SUBMISSION_REDIS_LIST, 0, limit - 1];
  redisClient.lrange(args, function (err, submissionJids) {
    if (err) {
      callback(err);
    } else {
      submissionService.getSubmissionJidToSubmissionMap(submissionJids, function (err, map) {
        if (err) {
          callback(err);
        } else {
          var submissions = _.map(submissionJids, function (submissionJid) {
            return map[submissionJid];
          });

          callback(null, submissions);
        }
      });
    }
  });
};

recentSubmissionService.insertNewSubmissionNewestFirstIndex = function (submissionJids, callback) {
  recentSubmissionService.insertNewSubmissionOldestFirstIndex(submissionJids.reverse(), callback);
};

recentSubmissionService.insertNewSubmissionOldestFirstIndex = function (submissionJids, callback) {
  var args = [RECENT_SUBMISSION_REDIS_LIST];
  submissionJids.forEach(function (submissionJid) {
    args.push(submissionJid);
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