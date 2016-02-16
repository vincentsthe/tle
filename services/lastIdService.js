var dbConnection = require('../dbConnection');

var lastIdService = {};

lastIdService.GRADING_LAST_ID_KEY = "grading";
lastIdService.PROBLEMSET_PROBLEM_LAST_ID_KEY = "problemset_problem";

var insertKeyLastId  = function (key, callback) {
  dbConnection.db.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      callback("error connecting to db: ");
    } else {
      var record = {
        field: key,
        value: 0
      };

      var query = "INSERT INTO last_id SET ?";

      connection.query(query, record, function (err) {
        connection.release();
        if (err) {
          callback("error inserting to last_id: " + err)
        } else {
          callback(null);
        }
      });
    }
  });
};

lastIdService.getKeyLastId = function (key, callback) {
  dbConnection.db.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      callback("error connecting to db: " + err);
    } else {
      var query = "SELECT value"
        + " FROM last_id"
        + " WHERE field ='" + key + "'";

      connection.query(query, function (err, rows) {
        connection.release();
        if (err) {
          callback("error querrying db: " + err);
        } else {
          if (rows.length) {
            callback(null, rows[0]["value"]);
          } else {
            insertKeyLastId(key, function (err) {
              if (err) {
                callback(err);
              } else {
                callback(null, 0);
              }
            });
          }
        }
      });
    }
  });
};

lastIdService.updateLastId = function (key, lastId, callback) {
  dbConnection.db.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      callback("error connecting to db: " + err);
    } else {
      var value = {
        value: lastId
      };
      var query = "UPDATE last_id"
        + " SET value=:value"
        + " WHERE field = '" + key + "'";

      connection.query(query, value, function (err) {
        connection.release();
        if (err) {
          callback("error updating last_id: " + err);
        } else {
          callback(null);
        }
      });
    }
  });
};

module.exports = lastIdService;