var knexConnection = require('../core/knexConnection');
var Grading = require('../models/Grading');

var tlxGradingService = {};

tlxGradingService.fetchGradingFromJerahmeel = function (lastId, limit, callback) {
  knexConnection.jerahmeel
    .select("grading.id AS id", "grading.submissionJid AS submissionJid", "grading.score AS score", "grading.verdictCode AS verdictCode", "grading.verdictName AS verdictName", "submission.userCreate AS userJid", "submission.problemJid AS problemJid")
    .from("jerahmeel_programming_grading AS grading")
    .join("jerahmeel_programming_submission AS submission", "submission.jid", "=", "grading.submissionJid")
    .where('grading.id', '>', lastId)
    .limit(limit)
    .then(function (gradingRecords) {
      var gradings = [];
      var maxId = 0;
      gradingRecords.forEach(function (gradingRecord) {
        maxId = Math.max(maxId, gradingRecord.id);

        var grading = new Grading();
        grading.setId(gradingRecord.id)
          .setSubmissionJid(gradingRecord.submissionJid)
          .setScore(gradingRecord.score)
          .setVerdictCode(gradingRecord.verdictCode)
          .setVerdictName(gradingRecord.verdictName)
          .setEvaluated(false)
          .setUserJid(gradingRecord.userJid)
          .setProblemJid(gradingRecord.problemJid);

        gradings.push(grading);
      });

      callback(null, gradings, maxId);
    }, function (err) {
      callback(err);
    });
};

module.exports = tlxGradingService;