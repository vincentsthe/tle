var async = require('async');

var submissionService = require('../services/submissionService');
var tlxSubmissionService = require('../tlxservices/tlxSubmissionService');

var submissionMigrator = {};

submissionMigrator.migrate = function (limit, callback) {
  async.waterfall([
    function (callback) {
      submissionService.getLastJerahmeelId(function (err, lastId) {
        callback(err, lastId);
      });
    }, function (lastId, callback) {
      tlxSubmissionService.fetchSubmissionFromJerahmeel(lastId, limit, function (err, records) {
        callback(err, records);
      });
    }, function (records, callback) {
      submissionService.fillProblemSlug(records, function (err, records) {
        callback(err, records);
      });
    }, function (records, callback) {
      submissionService.fillUsername(records, function (err, records) {
        callback(err, records);
      });
    }, function (records, callback) {
      submissionService.insertSubmission(records, function (err, submissionCount) {
        callback(err, submissionCount);
      });
    }
  ], function (err, submissionCount) {
    callback(err, submissionCount);
  });
};

module.exports = submissionMigrator;