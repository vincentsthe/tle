var knexConnection = require('../knexConnection');
var Grading = require('../models/Grading');

var tlxGradingService = {};

tlxGradingService.fetchGradingFromJerahmeel = function (lastId, limit, callback) {
  knexConnection.jerahmeel
    .select("id", "submissionJid", "score", "verdictCode", "verdictName")
    .from("jerahmeel_programming_grading")
    .where('id', '>', lastId)
    .limit(limit)
    .then(function (gradingRecords) {
      var gradings = [];
      var maxId = 0;
      gradingRecords.forEach(function (gradingRecord) {
        maxId = Math.max(maxId, gradingRecord.id);

        var grading = new Grading();
        grading.setSubmissionJid(gradingRecord.submissionJid)
          .setScore(gradingRecord.score)
          .setVerdictCode(gradingRecord.verdictCode)
          .setVerdictName(gradingRecord.verdictName);

        gradings.push(grading);
      });

      callback(null, gradings, maxId);
    }, function (err) {
      callback(err);
    });
};

module.exports = tlxGradingService;