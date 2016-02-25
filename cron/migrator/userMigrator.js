var async = require('async');

var userService = require('../../services/userService');
var tleUserService = require('../../tleModuleServices/userRankService');
var tlxUserService = require('../../tlxservices/tlxUserService');

var userMigrator = {};

userMigrator.migrate = function (limit, callback) {
  async.waterfall([
    function (callback) {
      userService.getLastJophielUserId(function (err, lastId) {
        callback(err, lastId);
      });
    }, function (lastId, callback) {
      tlxUserService.fetchUserFromJophielFromLastId(lastId, limit, function (err, users) {
        callback(err, users);
      });
    }, function (userRecords, callback) {
      userService.insertUser(userRecords, function (err) {
        callback(err, userRecords);
      });
    }, function (userRecords, callback) {
      async.each(userRecords, function (userRecord, callback) {
        tleUserService.insertUserRecord(userRecord.getUserJid(), 0, function (err) {
          callback(err);
        });
      }, function (err) {
        callback(err, userRecords.length);
      });
    }
  ], function (err, result) {
    callback(err, result);
  });
};

module.exports = userMigrator;
