var dbConnection = require('../dbConnection.js');
var User = require('../models/User');

var tlxUserService = {};

tlxUserService.fetchUserFromJophiel = function (lastId, limit, callback) {
  dbConnection.jophiel.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      callback("error connecting to jophiel: " + err);
    } else {
      var query = "SELECT id jophiel_id, jid, username, name"
                  + " FROM jophiel_user"
                  + " WHERE id > " + lastId
                  + " LIMIT " + limit;

      connection.query(query, function (err, rows) {
        connection.release();
        if (err) {
          callback("error querrying jophiel: " + err);
        } else {
          var users = [];
          for (var i = 0; i < rows.length; i++) {
            var user = new User();
            user.setJophielUserId(rows[i]["id"])
                .setUserJid(rows[i]["jid"])
                .setUsername(rows[i]["username"])
                .setName(rows[i]["name"]);
          }

          callback(null, users);
        }
      });
    }
  });
};

module.exports = tlxUserService;