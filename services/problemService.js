var dbConnection = require('../dbConnection');

var problemService = {};

problemService.getLastProblemId = function (callback) {
  dbConnection.db.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      callback("error connecting to db");
    } else {
      var query = "SELECT MAX(jerahmeel_problem_id) max_id"
                  + " FROM problem";

      connection.query(query, function (err, rows) {
        connection.release();
        if (err) {
          callback("error query ing db: " + query);
        } else {
          callback(null, rows[0]["max_id"]);
        }
      });
    }
  });
};

problemService.insertProblem = function (problemObjects, callback) {
  if (problems.length) {
    var values = _.map(problemObjects, function (record, problemJid) {
      return [
        record["jerahmeel_id"],
        problemJid,
        record["slug"],
        0,
        0,
        0,
        record["problemset_id"]
      ];
    });

    dbConnection.db.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        callback("error connecting to db");
      } else {
        var query = "INSERT INTO problem"
          + " (problem_id, problem_jid, slug, accepted_user, total_submission, accepted_submission, problemset_id)"
          + " VALUES ?";

        connection.query(query, [values], function (err) {
          connection.release();
          if (err) {
            console.log(values);
            console.log(query);
            callback("error inserting to problem: " + err);
          } else {
            callback(null);
          }
        });
      }
    });
  } else {
    callback(null);
  }
};

module.exports = problemService;
