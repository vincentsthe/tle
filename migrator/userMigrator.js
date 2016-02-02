var async = require('async');

var userService = require('../services/userService');
var tlxUserService = require('../services/tlxUserService');

var userMigrator = {};

userMigrator.migrate = function (callback) {
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
      tlxUserService.fetchUserFromJophiel(lastId, 100, function (err, users) {
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
          callback(nul, result);
        }
      });
    }
  ], function (err, result) {
    if (err) {
      callback("eror migrating result: " + err);
    } else {
      callback(null, result);
    }
  });
};

module.exports = userMigrator;
