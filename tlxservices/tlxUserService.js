var knexConnection = require('../knexConnection');
var User = require('../models/User');

var tlxUserService = {};

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

module.exports = tlxUserService;