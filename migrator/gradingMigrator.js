var async = require('async');

var gradingService = require('../services/gradingService');
var lastIdService = require('../services/lastIdService');
var tlxGradingService = require('../tlxservices/tlxGradingService');

var gradingMigrator = {};

gradingMigrator.migrate = function (limit, callback) {
  async.waterfall([
    function (callback) {
      lastIdService.getKeyLastId(lastIdService.GRADING_LAST_ID_KEY, function (err, lastId) {
        callback(err, lastId);
      });
    }, function (lastId, callback) {
      tlxGradingService.fetchGradingFromJerahmeel(lastId, limit, function (err, records, maxId) {
        callback(err, records, maxId);
      });
    }, function (records, maxId, callback) {
      gradingService.insertGradingData(records, function (err, count) {
        callback(err, count, maxId);
      });
    }, function (gradingCount, maxId, callback) {
      lastIdService.updateLastId(lastIdService.GRADING_LAST_ID_KEY, maxId, function (err) {
        callback(err, gradingCount);
      });
    }
  ], function (err, gradingCount) {
    callback(err, gradingCount);
  });
};

module.exports = gradingMigrator;