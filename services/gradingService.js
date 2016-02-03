var _ = require('underscore');

var dbConnection = require('../dbConnection');

var gradingService = {};

var GRADING_LAST_ID_KEY = "grading";

var insertGradingLastId = function (callback) {
  dbConnection.db.getConnection(function (err, connection) {
    if (err) {
      callback("error connecting to db: ");
    } else {
      var record = {
        field: GRADING_LAST_ID_KEY,
        value: 0
      };

      var query = "INSERT INTO last_id SET ?";

      connection.query(query, record, function (err) {
        if (err) {
          callback("error inserting to last_id: " + err)
        } else {
          callback(null);
        }
      });
    }
  });
};

gradingService.getLastGradingId = function (callback) {
  dbConnection.db.getConnection(function (err, connection) {
    if (err) {
      callback("error connecting to db: " + err);
    } else {
      var query = "SELECT value"
                  + " FROM last_id"
                  + " WHERE field ='" + GRADING_LAST_ID_KEY + "'";

      connection.query(query, function (err, rows) {
        if (err) {
          callback("error querrying db: " + err);
        } else {
          if (rows.length) {
            callback(null, rows[0]["value"]);
          } else {
            insertGradingLastId(function (err) {
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

gradingService.updateLastId = function (lastId, callback) {
  dbConnection.db.getConnection(function (err, connection) {
    if (err) {
      callback("error connecting to db: " + err);
    } else {
      var value = {
        value: lastId
      };
      var query = "UPDATE last_id"
                  + " SET value=:value"
                  + " WHERE field = '" + GRADING_LAST_ID_KEY + "'";

      connection.query(query, value, function (err) {
        if (err) {
          callback("error updating last_id: " + err);
        } else {
          callback(null);
        }
      });
    }
  });
};

gradingService.insertGradingData = function (records, callback) {
  dbConnection.db.getConnection(function (err, connection) {
    if (err) {
      callback("error connecting to db: " + err);
    } else {
      var values = _.map(records, function (data) {
        return [
          data.submissionJid,
          data.score,
          data.verdict_code,
          data.verdict_name
        ]
      });
      var query = "INSERT INTO grading"
                  + " (submission_jid, score, verdict_code, verdict_name)"
                  + " VALUES ?";

      connection.query(query, values, function (err) {
        if (err) {
          callback("error inserting to grading: " + err);
        } else {
          callback(null, records.length);
        }
      });
    }
  });
};

module.exports = gradingService;