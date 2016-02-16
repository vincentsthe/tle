var dbConnection = require('../dbConnection.js');

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
          callback(null, rows);
        }
      });
    }
  });
};

module.exports = tlxUserService;