var dbConnection = require('../dbConnection');

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
          callback(null, rows);
        }
      });
    }
  });
};

module.exports = tlxSubmissionService;