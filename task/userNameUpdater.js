var async = require("async");

var dbConnection = require('../dbConnection');
var tlxUserService = require('../tlxservices/tlxUserService');

var QUERY_PER_BATCH = 100;

var userNameUpdater = {};

userNameUpdater.updateUserName = function (callback) {
  var lastUpdateCount = QUERY_PER_BATCH;
  var offset = 0;

  async.whilst(
    function () {
      return lastUpdateCount == QUERY_PER_BATCH;
    }, function (callback) {
      tlxUserService.fetchUserFromJophielFromLastId(offset, QUERY_PER_BATCH, function (err, users) {

      });
    }
  );
};

module.exports = userNameUpdater;