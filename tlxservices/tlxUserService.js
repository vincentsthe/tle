var knexConnection = require('../core/knexConnection');
var User = require('../models/User');

var tlxUserService = {};

tlxUserService.fetchUser = function (offset, limit, callback) {
  knexConnection.jophiel
    .select('id AS jophiel_id', 'jid', 'username', 'name')
    .from('jophiel_user')
    .offset(offset)
    .limit(limit)
    .orderBy('id', 'ASC')
    .then(function (userRecords) {
      var users = [];
      userRecords.forEach(function (userRecord) {
        var user = new User();
        user.setJophielUserId(userRecord.jophiel_id)
          .setUserJid(userRecord.jid)
          .setUsername(userRecord.username)
          .setName(userRecord.name);

        users.push(user);
      });

      callback(null, users);
    }, function (err) {
      callback(err);
    });
};

tlxUserService.fetchUserFromJophielFromLastId = function (lastId, limit, callback) {
  knexConnection.jophiel
    .select('id AS jophiel_id', 'jid', 'username', 'name')
    .from('jophiel_user')
    .where('id', '>', lastId)
    .limit(limit)
    .then(function (userRecords) {
      var users = [];
      userRecords.forEach(function (userRecord) {
        var user = new User();
        user.setJophielUserId(userRecord.jophiel_id)
          .setUserJid(userRecord.jid)
          .setUsername(userRecord.username)
          .setName(userRecord.name);

        users.push(user);
      });

      callback(null, users);
    }, function (err) {
      callback(err);
    });
};

tlxUserService.getUserUsernameByJids = function (userJids, callback) {
  knexConnection.jophiel
    .select("id", "jid", "username")
    .from("jophiel_user")
    .whereIn("jid", userJids)
    .then(function (users) {
      var usernameMap = {};
      users.forEach(function (user) {
        usernameMap[user.jid] = user.username;
      });

      callback(null, usernameMap);
    }, function (err) {
      callback(err);
    });
};

module.exports = tlxUserService;