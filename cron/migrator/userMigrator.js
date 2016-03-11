var _ = require('underscore');
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
      tlxUserService.fetchUserFromJophielFromLastId(lastId, limit, function (err, tlxUserModels) {
        callback(err, tlxUserModels);
      });
    }, function (tlxUserModels, callback) {
      async.each(tlxUserModels, function (tlxUserModel, callback) {
        userService.insertUser(tlxUserModel.getId(), tlxUserModel.getJid(), tlxUserModel.getUsername(), tlxUserModel.getName(), function (err) {
          callback(err);
        });
      }, function (err) {
        callback(err, tlxUserModels);
      });
    }, function (tlxUserModels, callback) {
      async.each(tlxUserModels, function (tlxUserModel, callback) {
        tleUserService.insertUserRecord(tlxUserModel.getId(), 0, function (err) {
          callback(err);
        });
      }, function (err) {
        callback(err, tlxUserModels.length);
      });
    }
  ], function (err, result) {
    callback(err, result);
  });
};

module.exports = userMigrator;
