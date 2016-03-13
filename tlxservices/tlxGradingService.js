var _ = require('underscore');

var knexConnection = require('../core/knexConnection');
var TlxGradingModel = require('../models/tlxModels/TlxGradingModel');

var tlxGradingService = {};

tlxGradingService.fetchGradingFromJerahmeel = function (lastId, limit, callback) {
  knexConnection.jerahmeel
    .select("grading.id AS id", "submission.id AS submissionId", "grading.score AS score", "grading.verdictCode AS verdictCode",
      "grading.verdictName AS verdictName", "submission.userCreate AS userJid", "submission.problemJid AS problemJid",
      "submission.timeCreate AS submissionTime")
    .from("jerahmeel_programming_grading AS grading")
    .join("jerahmeel_programming_submission AS submission", "submission.jid", "=", "grading.submissionJid")
    .where('grading.id', '>', lastId)
    .limit(limit)
    .then(function (gradingRecords) {
      var tlxGradingModels = _.map(gradingRecords, function (gradingRecord) {
        var tlxGradingModel = new TlxGradingModel();
        tlxGradingModel.setId(gradingRecord.id)
                      .setSubmissionId(gradingRecord.submissionId)
                      .setScore(gradingRecord.score)
                      .setVerdictCode(gradingRecord.verdictCode)
                      .setVerdictName(gradingRecord.verdictName)
                      .setUserJid(gradingRecord.userJid)
                      .setProblemJid(gradingRecord.problemJid)
                      .setSubmissionTime(gradingRecord.submissionTime);

        return tlxGradingModel;
      });

      callback(null, tlxGradingModels);
    }, function (err) {
      callback(err);
    });
};

module.exports = tlxGradingService;