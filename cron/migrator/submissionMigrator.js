var _ = require('underscore');
var async = require('async');

var submissionService = require('../../services/submissionService')
var tlxProblemService = require('../../tlxservices/tlxProblemService');
var tlxSubmissionService = require('../../tlxservices/tlxSubmissionService');
var tlxUserService = require('../../tlxservices/tlxUserService');

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
      var problemJids = _.map(records, function (record) {
        return record.getProblemJid();
      });

      tlxProblemService.getProblemSlugsByJids(problemJids, function (err, problemSlugsMap) {
        if (err) {
          callback(err);
        } else {
          records.forEach(function (record) {
            record.setProblemSlug(problemSlugsMap[record.getProblemJid()]);
          });

          callback(null, records);
        }
      });
    }, function (records, callback) {
      var userJids = _.map(records, function (record) {
        return record.getUserJid();
      });

      tlxUserService.getUserUsernameByJids(userJids, function (err, usernameMap) {
        if (err) {
          callback(err);
        } else {
          records.forEach(function (record) {
            record.setUsername(usernameMap[record.getUserJid()]);
          });
          
          callback(null, records);
        }
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