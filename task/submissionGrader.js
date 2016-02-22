var async = require('async');

var gradingService = require('../services/gradingService');
var submissionService = require('../services/submissionService');

var submissionGrader = {};

submissionGrader.consumeGradingData = function (limit, callback) {
  async.waterfall([
    function (callback) {
      gradingService.getUnevaluatedGradingData(limit, function (err, gradings) {
        if (err) {
          console.log("error fetching grading data from db: " + err);
        } else {
          callback(null, gradings);
        }
      });
    }, function (gradings, callback) {
      async.each(gradings, function (grading, callback) {
        submissionService.updateSubmissionGrading(grading, function (err) {
          if (err) {
            console.log(err);
            callback(null);
          } else {
            gradingService.markGradingAsEvaluated(grading.getId(), function (err) {
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