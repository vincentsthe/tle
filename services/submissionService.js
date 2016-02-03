var _ = require('underscore');

var dbConnection = require('../dbConnection');

var submissionService = {};

submissionService.getLastJerahmeelId = function (callback) {
  dbConnection.db.getConnection(function (err, connection) {
    if (err) {
      callback("Error connecting to db: " + err);
    } else {
      var query = "SELECT MAX(jerahmeel_submission_id) max_id"
                  + " FROM submission";

      connection.query(query, function (err, rows) {
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

submissionService.fillProblemSlug = function (records, callback) {
  dbConnection.db.getConnection(function (err, connection) {
    if (err) {
      callback("error connecting to db: " + err);
    } else {
      var problemJids = _.map(records, function (data) {
        return "'" + data.problemJid + "'";
      });
      var query = "SELECT problem_jid, slug"
                  + " FROM problem"
                  + " WHERE problem_jid IN (" + problemJids.join(",") + ")";

      connection.query(query, function (err, rows) {
        if (err) {
          callback("error querying db: " + err);
        } else {
          var problemMap = {};
          for (var i = 0; i < rows.length; i++) {
            problemMap[rows[i]["problem_jid"]] = rows[i]["slug"];
          }

          for (var i = 0; i < records.length; i++) {
            records["problem_slug"] = problemMap[records["problem_slug"]];
          }

          callback(null, records);
        }
      });
    }
  });
};

submissionService.fillUsername = function (records, callback) {
  dbConnection.db.getConnection(function (err, connection) {
    if (err) {
      callback("error connecting to db: " + err);
    } else {
      var userJids = _.map(records, function (data) {
        return "'" + data.userJid + "'";
      });
      var query = "SELECT user_jid, username"
                  + " FROM user"
                  + " WHERE user_jid IN (" + userJids.join(",") + ")";

      connection.query(query, function (err, rows) {
        if (err) {
          callback("error querrying db: " + err);
        } else {
          var userMap = {};
          for (var i = 0; i < rows.length; i++) {
            userMap[rows[i]["user_jid"]] = rows[i]["username"];
          }

          for (var i = 0; i < records.length; i++) {
            records["username"] = userMap["user_jid"];
          }

          callback(null, records);
        }
      });
    }
  });
};

submissionService.insertSubmission = function (records, callback) {
  dbConnection.db.getConnection(function (err, connection) {
    if (err) {
      callback("error connecting to db: " + err);
    } else {
      var values = _.map(records, function (data) {
        return [
          data.id,
          data.jid,
          data.userJid,
          data.username,
          data.timestamp,
          data.language,
          data.problemJid,
          data.problem_slug
        ];
      });

      var query = "INSERT INTO submission"
                  + " (jerahmeel_submission_id, submission_jid, user_jid, username, `timestamp`, language, problem_jid, problem_slug)"
                  + " VALUES ?";

      connection.query(query, [values], function (err) {
        if (err) {
          callback("error inserting user to db: " + err);
        } else {
          callback(null, records.length);
        }
      });
    }
  });
};

module.exports = submissionService;