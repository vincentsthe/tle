var _ = require('underscore');

var dbConnection = require('../dbConnection');

var userService = {};

userService.getLastJophielUserId = function (callback) {
  dbConnection.db.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      callback("error connecting to db: " + err);
    } else {
      var query = "SELECT MAX(jophiel_user_id) max_id"
                  + " FROM user";

      connection.query(query, function (err, rows) {
        connection.release();
        if (err) {
          callback("error querying db: " + err);
        } else {
          callback(null, rows[0]["max_id"]);
        }
      });
    }
  });
};

userService.insertUser = function (userRecords, callback) {
  if (userRecords.length) {
    var values = _.map(userRecords, function (record) {
      return [
        record.jophiel_id,
        record.jid,
        record.username,
        record.name
      ];
    });

    dbConnection.db.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        callback("error connecting to db: " + err)
      } else {
        var query = "INSERT INTO user"
                    + " (jophiel_user_id, user_jid, username, name)"
                    + " VALUES ?";

        connection.query(query, [values], function (err) {
          connection.release();
          if (err) {
            callback("error inserting user: " + err);
          } else {
            callback(null, values.length);
          }
        });
      }
    });
  } else {
    callback(null);
  }
};

module.exports = userService;