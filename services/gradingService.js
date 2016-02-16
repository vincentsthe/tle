var _ = require('underscore');

var dbConnection = require('../dbConnection');
var Grading = require('../models/Grading');

var gradingService = {};

gradingService.insertGradingData = function (gradings, callback) {
  dbConnection.db.getConnection(function (err, connection) {
    if (err) {
      connection.release();
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
        connection.release();
        if (err) {
          callback("error inserting to grading: " + err);
        } else {
          callback(null, gradings.length);
        }
      });
    }
  });
};

gradingService.getGradingData = function (limit, callback) {
  dbConnection.db.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      callback("error connecting to db: " + err);
    } else {
      var query = "SELECT id, submission_jid, score, verdict_code, verdict_name"
                  + " FROM grading"
                  + " ORDER BY id ASC"
                  + " LIMIT " + limit;

      connection.query(query, function (err, rows) {
        connection.release();
        if (err) {
          console.log("error querying db: " + err);
        } else {
          var gradings = [];
          for (var i = 0; i < rows.length; i++) {
            var grading = new Grading();
            grading.setId(rows[0]["id"])
                  .setSubmissionJid(rows[0]["submission_jid"])
                  .setScore(rows[0]["score"])
                  .setVerdictCode(rows[0]["verdict_code"])
                  .setVerdictName(rows[0]["verdict_name"]);
          }

          callback(null, gradings);
        }
      });
    }
  });
};

gradingService.deleteGrading = function (id, callback) {
  dbConnection.db.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      console.log("error connecting to db: " + err);
    } else {
      var query = "DELETE FROM grading"
                  + " WHERE id=" + id;

      connection.query(query, function (err) {
        connection.release();
        callback(err);
      });
    }
  });
};

module.exports = gradingService;