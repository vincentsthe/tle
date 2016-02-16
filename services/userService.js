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
          var lastId;
          if (rows.length) {
            lastId = rows[0]["max_id"];
          } else {
            lastId = 0;
          }
          callback(null, lastId);
        }
      });
    }
  });
};

userService.insertUser = function (users, callback) {
  if (userRecords.length) {
    var values = _.map(users, function (user) {
      return [
        user.getJophielUserId(),
        user.getUserJid(),
        user.getUsername(),
        user.getName(),
        user.getAcceptedSubmission(),
        user.getTotalSubmission(),
        user.getAcceptedProblem()
      ];
    });

    dbConnection.db.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        callback("error connecting to db: " + err)
      } else {
        var query = "INSERT INTO user"
                    + " (jophiel_user_id, user_jid, username, name, accepted_submission, total_submission, accepted_problem)"
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