var async = require('async');

var gradingService = require('../../services/gradingService');
var redisClient = require('../../core/redisClient');
var submissionService = require('../../services/submissionService');

var submissionGrader = {};

submissionGrader.consumeGradingData = function (limit, callback) {
  async.waterfall([
    function (callback) {
      gradingService.getUnevaluatedGradingData(limit, function (err, gradings) {
        callback(err, gradings);
      });
    }, function (gradings, callback) {
      async.each(gradings, function (grading, callback) {
        submissionService.updateSubmissionGrading(grading.getSubmissionId(), grading.getScore(), grading.getVerdictCode(), grading.getVerdictName(),function (err) {
          if (err) {
            console.error(err);
            callback(null);
          } else {
            redisClient.del(submissionService.REDIS_SUBMISSION_ID_PREFIX + grading.getSubmissionId());
            gradingService.markGradingAsEvaluated(grading.getId(), function (err) {
              if (err) {
                console.error(err);
              }
              callback(null);
            });
          }
        });
      }, function (err) {
        callback(err, gradings.length);
      });
    }
  ], function (err, gradingConsumed) {
    if (err) {
      callback("error consume grading: " + err);
    } else {
      callback(null, gradingConsumed);
    }
  });
};

module.exports = submissionGrader;