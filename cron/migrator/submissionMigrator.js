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
      tlxSubmissionService.fetchSubmissionFromJerahmeel(lastId, limit, function (err, tlxSubmissionModels) {
        callback(err, tlxSubmissionModels);
      });
    }, function (tlxSubmissionModels, callback) {
      var problemJids = _.map(tlxSubmissionModels, function (tlxSubmissionModel) {
        return tlxSubmissionModel.getProblemJid();
      });

      tlxProblemService.getProblemJidToProblemMap(problemJids, function (err, problemMap) {
        callback(err, tlxSubmissionModels, problemMap);
      });
    }, function (tlxSubmissionModels, problemMap, callback) {
      var userJids = _.map(tlxSubmissionModels, function (tlxSubmissionModel) {
        return tlxSubmissionModel.getUserJid();
      });

      tlxUserService.getUserJidToUserMap(userJids, function (err, userMap) {
        callback(err, tlxSubmissionModels, problemMap, userMap);
      });
    }, function (tlxSubmissionModels, problemMap, userMap, callback) {
      async.each(tlxSubmissionModels, function (tlxSubmissionModel, callback) {
        // we use try block here in case of problemJid or userJid is not found in problemMap or userMap
        try {
          submissionService.insertSubmission(tlxSubmissionModel.getId(), tlxSubmissionModel.getJid(), userMap[tlxSubmissionModel.getUserJid()].getId(),
            problemMap[tlxSubmissionModel.getProblemJid()].getId(), tlxSubmissionModel.getLanguage(), Math.round(tlxSubmissionModel.getTimeCreate() / 1000), function (err) {
              callback(err);
            });
        } catch (ex) {
          callback(null);
        }
      }, function (err) {
        callback(err, tlxSubmissionModels.length);
      });
    }
  ], function (err, submissionCount) {
    callback(err, submissionCount);
  });
};

module.exports = submissionMigrator;