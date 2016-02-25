var async = require("async");

var tlxUserService = require('../../tlxservices/tlxUserService');
var userService = require('../../services/userService');

var QUERY_PER_BATCH = 100;

var userNameUpdater = {};

userNameUpdater.updateUserName = function (callback) {
  var lastUpdateCount = QUERY_PER_BATCH;
  var offset = 0;

  async.whilst(
    function () {
      return lastUpdateCount == QUERY_PER_BATCH;
    }, function (callback) {
      tlxUserService.fetchUser(offset, QUERY_PER_BATCH, function (err, users) {
        async.each(users, function (user, callback) {
          userService.changeName(user.getUserJid(), user.getName(), function (err) {
            callback(err);
          });
        }, function (err) {
          lastUpdateCount = users.length;
          offset += users.length;
          callback(err);
        });
      });
    }, function (err) {
      callback(err);
    }
  );
};

module.exports = userNameUpdater;