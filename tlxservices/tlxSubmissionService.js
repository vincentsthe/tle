var knexConnection = require('../core/knexConnection');
var Submission = require('../models/Submission');

var tlxSubmissionService = {};

tlxSubmissionService.fetchSubmissionFromJerahmeel = function (lastId, limit, callback) {
  knexConnection.jerahmeel
    .select("id", "jid", "problemJid", "userCreate AS userJid", "gradingLanguage AS language", "timeCreate")
    .from("jerahmeel_programming_submission")
    .where('id', '>', lastId)
    .limit(limit)
    .then(function (submissionRecords) {
      var submissions = [];
      submissionRecords.forEach(function (submissionRecord) {
        var submission = new Submission();
        submission.setId(submissionRecord.id)
          .setSubmissionJid(submissionRecord.jid)
          .setProblemJid(submissionRecord.problemJid)
          .setUserJid(submissionRecord.userJid)
          .setLanguage(submissionRecord.language)
          .setSubmitTime(submissionRecord.timeCreate / 1000);

        submissions.push(submission);
      });

      callback(null, submissions);
    }, function (err) {
      callback(err);
    });
};

module.exports = tlxSubmissionService;