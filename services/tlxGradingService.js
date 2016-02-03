var dbConnection = require('../dbConnection');

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
          callback(null, rows);
        }
      });
    }
  });
};

module.exports = tlxGradingService;