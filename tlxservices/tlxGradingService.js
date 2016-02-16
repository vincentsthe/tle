var dbConnection = require('../dbConnection');
var Grading = require('../models/Grading');

var tlxGradingService = {};

tlxGradingService.fetchGradingFromJerahmeel = function (lastId, limit, callback) {
  dbConnection.jerahmeel.getConnection(function (err, connection) {
    if (err) {
      callback("error connecting to jerahmeel: " + err);
    } else {
      var query = "SELECT id, submissionJid, score, verdict_code, verdict_name"
                  + " FROM jerahmeel_programming_grading"
                  + " WHERE id > " + lastId
                  + " LIMIT " + limit;

      connection.query(query, function (err, rows) {
        if (err) {
          callback("eror queryin jerahmeel: " + err);
        } else {
          var gradings = [];
          for (var i = 0; i < rows.length; i++) {
            var grading = new Grading();
            grading.setSubmissionJid(rows[i]["submissionJid"])
                  .setScore(rows[i]["score"])
                  .setVerdictCode(rows[i]["verdict_code"])
                  .setVerdictName(rows[i]["verdict_name"]);

            gradings.push(grading);
          }

          callback(null, gradings);
        }
      });
    }
  });
};

module.exports = tlxGradingService;