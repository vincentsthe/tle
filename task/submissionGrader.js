var async = require('async');

var gradingService = require('../services/gradingServices');
var submissionService = require('../services/submissionService');

var submissionGrader = {};

submissionGrader.consumeGradingData = function (limit, callback) {
  async.waterfall([
    function (callback) {
      gradingService.getGradingData(limit, function (err, gradings) {
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
            callback(null);
          } else {
            gradingService.deleteGrading(grading.getId(), function (err) {
              callback(null);
            });
          }
        });
      }, function (err) {
        callback(err);
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