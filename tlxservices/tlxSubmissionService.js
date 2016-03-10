var _ = require('underscore');

var knexConnection = require('../core/knexConnection');
var TlxSubmissionModel = require('../models/tlxModels/TlxSubmissionModel');

var tlxSubmissionService = {};

tlxSubmissionService.fetchSubmissionFromJerahmeel = function (lastId, limit, callback) {
  knexConnection.jerahmeel
    .select("id", "jid", "problemJid", "userCreate AS userJid", "gradingLanguage AS language", "timeCreate")
    .from("jerahmeel_programming_submission")
    .where('id', '>', lastId)
    .limit(limit)
    .then(function (submissionRecords) {
      var tlxSubmissionModels = _.map(submissionRecords, function (submissionRecord) {
        var tlxSubmissionModel = new TlxSubmissionModel();
        tlxSubmissionModel.setId(submissionRecord.id)
                          .setJid(submissionRecord.jid)
                          .setUserJid(submissionRecord.userJid)
                          .setProblemJid(submissionRecord.problemJid)
                          .setLanguage(submissionRecord.language)
                          .setTimeCreate(submissionRecord.timeCreate);
        return tlxSubmissionModel;
      });

      callback(null, tlxSubmissionModels);
    }, function (err) {
      callback(err);
    });
};

module.exports = tlxSubmissionService;