var _ = require("underscore");

var dbConnection = require('../dbConnection');

var tlxProblemService = {};

tlxProblemService.fetchProblemObjectFromJerahmeel = function (lastId, limit, callback) {
  dbConnection.jerahmeel.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      callback("error connecting to jerahmeel: " + err);
    } else {
      var query = "SELECT jerahmeel_problem_set_problem.id id, jerahmeel_problem_set_problem.problemJid problemJid, jerahmeel_problem_set.id problemset_id"
                  + " FROM jerahmeel_problem_set_problem"
                  + " JOIN jerahmeel_problem_set ON jerahmeel_problem_set_problem.problemSetJid = jerahmeel_problem_set.jid"
                  + " LIMIT " + limit;

      connection.query(query, function (err, rows) {
        connection.release();
        if (err) {
          callback("error querying jerahmeel " + err);
        } else {
          var problemsObject = {};

          for (var i = 0; i < rows.length; i++) {
            problemsObject[rows[i]["problemJid"]] = {
              "jerahmeel_id": rows[i]["id"],
              "problem_set_id": rows[i]["problemset_id"]
            };
          }
          callback(null, problemsObject);
        }
      });
    }
  });
};

tlxProblemService.fetchProblemFromJerahmeelRecord = function (jerahmeelProblemsObject, callback) {
  dbConnection.sandalphon.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      callback("Error connecting to Sandalphon");
    } else {
      var problemJids = _.map(jerahmeelProblemsObject, function (value, key) {
        return "'" + key + "'";
      });

      var query = "SELECT id, jid, slug FROM sandalphon_problem"
                  + " WHERE jid IN (" + problemJids.join(",") + ")";

      connection.query(query, function (err, rows) {
        connection.release();
        if (err) {
          callback("error query sandalphon: " + query)
        } else {
          for (var i = 0; i < rows.length; i++) {
            rows[i]["jerahmeel_id"] = jerahmeelProblemsObject[rows[i]["jid"]]["id"];
            rows[i]["problemset_id"] = jerahmeelProblemsObject[rows[i]["jid"]]["problemset_id"];
          }

          callback(null, rows);
        }
      });
    }
  });
};

module.exports = tlxProblemService;