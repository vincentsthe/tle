var dbConnection = require('../dbConnection');
var Grading = require('../models/Grading');

var tlxGradingService = {};

tlxGradingService.fetchGradingFromJerahmeel = function (lastId, limit, callback) {
  dbConnection.jerahmeel.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      callback("error connecting to jerahmeel: " + err);
    } else {
      var query = "SELECT id, submissionJid, score, verdictCode, verdictName"
                  + " FROM jerahmeel_programming_grading"
                  + " WHERE id > " + lastId
                  + " LIMIT " + limit;

      connection.query(query, function (err, rows) {
        connection.release();
        if (err) {
          callback("eror querying jerahmeel: " + err);
        } else {
          var gradings = [];
          var maxId = 0;

          for (var i = 0; i < rows.length; i++) {
            maxId = Math.max(maxId, rows[i]["id"]);

            var grading = new Grading();
            grading.setSubmissionJid(rows[i]["submissionJid"])
                  .setScore(rows[i]["score"])
                  .setVerdictCode(rows[i]["verdict_code"])
                  .setVerdictName(rows[i]["verdict_name"]);

            gradings.push(grading);
          }

          callback(null, gradings, maxId);
        }
      });
    }
  });
};

module.exports = tlxGradingService;