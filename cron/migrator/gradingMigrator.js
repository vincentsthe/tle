var _ = require('underscore');
var async = require('async');

var gradingService = require('../../services/gradingService');
var lastIdService = require('../../services/lastIdService');
var tlxGradingService = require('../../tlxservices/tlxGradingService');
var tlxProblemService = require('../../tlxservices/tlxProblemService');
var tlxUserService = require('../../tlxservices/tlxUserService');

var gradingMigrator = {};

gradingMigrator.migrate = function (limit, callback) {
  async.waterfall([
    function (callback) {
      lastIdService.getKeyLastId(lastIdService.GRADING_LAST_ID_KEY, function (err, lastId) {
        callback(err, lastId);
      });
    }, function (lastId, callback) {
      tlxGradingService.fetchGradingFromJerahmeel(lastId, limit, function (err, tlxGradingModels) {
        callback(err, tlxGradingModels);
      });
    }, function (tlxGradingModels, callback) {
      var userJids = _.map(tlxGradingModels, function (tlxGradingModel) {
        return tlxGradingModel.getUserJid();
      });

      tlxUserService.getUserJidToUserMap(userJids, function (err, userMap) {
        callback(err, tlxGradingModels, userMap);
      });
    }, function (tlxGradingModels, userMap, callback) {
      var problemJids = _.map(tlxGradingModels, function (tlxGradingModel) {
        return tlxGradingModel.getProblemJid();
      });

      tlxProblemService.getProblemJidToProblemMap(problemJids, function (err, problemMap) {
        callback(err, tlxGradingModels, userMap, problemMap);
      });
    }, function (tlxGradingModels, userMap, problemMap, callback) {
      async.each(tlxGradingModels, function (tlxGradingModel, callback) {
        // we use try block here in case of problemJid or userJid is not found in problemMap or userMap
        try {
          gradingService.insertGrading(tlxGradingModel.getId(), tlxGradingModel.getSubmissionId(), tlxGradingModel.getScore(), tlxGradingModel.getVerdictCode(),
            tlxGradingModel.getVerdictName(), userMap[tlxGradingModel.getUserJid()].getId(), problemMap[tlxGradingModel.getProblemJid()].getId(),
            Math.round(tlxGradingModel.getSubmissionTime() / 1000), function (err) {
              callback(err);
            });
        } catch (ex) {
          console.log("catch");
          callback(null);
        }
      }, function (err) {
        callback(err, tlxGradingModels);
      });
    }, function (tlxGradingModels, callback) {
      if (tlxGradingModels.length) {
        var maxId = _.max(tlxGradingModels, function (tlxGradingModel) {
          return tlxGradingModel.getId();
        }).getId();

        lastIdService.updateLastId(lastIdService.GRADING_LAST_ID_KEY, maxId, function (err) {
          callback(err, tlxGradingModels.length);
        })
      } else {
        callback(null, 0);
      }
    }
  ], function (err, gradingCount) {
    callback(err, gradingCount);
  });
};

module.exports = gradingMigrator;