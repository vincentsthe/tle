var dbConnection = require('../dbConnection');

var problemService = {};

problemService.insertProblem = function (problems, callback) {
  if (problems.length) {
    var values = _.map(problems, function (problem) {
      return [
        problem.getProblemJid(),
        problem.getSlug(),
        problem.getAcceptedUser(),
        problem.getTotalSubmission(),
        problem.getAcceptedSubmission(),
        problem.getUrl()
      ];
    });

    dbConnection.db.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        callback("error connecting to db");
      } else {
        var query = "INSERT INTO problem"
          + " (problem_jid, slug, accepted_user, total_submission, accepted_submission, url)"
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
