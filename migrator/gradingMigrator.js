var async = require('async');

var gradingService = require('../services/gradingService');
var tlxGradingService = require('../tlxservices/tlxGradingService');

var gradingMigrator = {};

gradingMigrator.migrate = function (limit, callback) {
  async.parallel([
    function (callback) {
      gradingService.getLastGradingId(function (err, lastId) {
        callback(err, lastId);
      });
    }, function (lastId, callback) {
      tlxGradingService.fetchGradingFromJerahmeel(lastId, limit, function (err, records) {
        callback(err, records);
      });
    }, function (records, callback) {
      var maxId = 0;
      for (var i = 0; i < records.length; i++) {
        maxId = Math.max(maxId, records[i]["id"]);
      }

      gradingService.updateLastId(maxId, function (err) {
        callback(err, records);
      });
    }, function (records, callback) {
      gradingService.insertGradingData(records, function (err, count) {
        callback(err, count);
      });
    }
  ], function (err, gradingCount) {
    callback(err, gradingCount);
  });
};

module.exports = gradingMigrator;