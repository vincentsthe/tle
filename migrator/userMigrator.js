var async = require('async');

var userService = require('../services/userService');
var tlxUserService = require('../tlxservices/tlxUserService');

var userMigrator = {};

userMigrator.migrate = function (limit, callback) {
  async.waterfall([
    function (callback) {
      userService.getLastJophielUserId(function (err, lastId) {
        if (err) {
          callback("error getting last id from db: " + err);
        } else {
          callback(null, lastId);
        }
      });
    }, function (lastId, callback) {
      tlxUserService.fetchUserFromJophiel(lastId, limit, function (err, users) {
        if (err) {
          callback("error retrieving user from jophiel: " + err);
        } else {
          callback(null, users);
        }
      });
    }, function (userRecords, callback) {
      userService.insertUser(userRecords, function (err, result) {
        if (err) {
          callback("error inserting user: " + err);
        } else {
          callback(null, result);
        }
      });
    }
  ], function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
};

module.exports = userMigrator;
