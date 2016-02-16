var _ = require('underscore');

var dbConnection = require('../dbConnection');

var gradingService = {};

gradingService.insertGradingData = function (gradings, callback) {
  dbConnection.db.getConnection(function (err, connection) {
    if (err) {
      callback("error connecting to db: " + err);
    } else {
      var values = _.map(gradings, function (grading) {
        return [
          grading.getSubmissionJid(),
          grading.getScore(),
          grading.getVerdictCode(),
          grading.getVerdictName()
        ]
      });
      var query = "INSERT INTO grading"
                  + " (submission_jid, score, verdict_code, verdict_name)"
                  + " VALUES ?";

      connection.query(query, values, function (err) {
        if (err) {
          callback("error inserting to grading: " + err);
        } else {
          callback(null, gradings.length);
        }
      });
    }
  });
};

module.exports = gradingService;