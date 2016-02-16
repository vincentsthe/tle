var dbConnection = require('../dbConnection');
var Submission = require('../models/Submission');

var tlxSubmissionService = {};

tlxSubmissionService.fetchSubmissionFromJerahmeel = function (lastId, limit, callback) {
  dbConnection.jerahmeel.getConnection(function (err, connection) {
    if (err) {
      callback("error connecting to jerahmeel: " + err);
    } else {
      var query = "SELECT id, jid, problemJid, userCreate userJid, gradingLanguage language, timeCreate `timestamp`"
                  + " FROM jerahmeel_programming_submission"
                  + " WHERE id > " + lastId
                  + " LIMIT " + limit;

      connection.query(query, function (err, rows) {
        if (err) {
          callback("error querying jerahmeel: " + err);
        } else {
          var submissions = [];
          for (var i = 0; i < rows.length; i++) {
            var submission = new Submission();
            submission.setJerahmeelSubmissionId(rows[i]["id"])
                      .setProblemJid(rows[i]["problemJid"])
                      .setUserJid(rows[i]["userJid"])
                      .setLanguage(rows[i]["language"])
                      .setTime(rows[i]["timestamp"]);

            submissions.push(submission);
          }

          callback(null, submissions);
        }
      });
    }
  });
};

module.exports = tlxSubmissionService;