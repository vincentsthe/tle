var _ = require('underscore');

var Submission = require('../models/Submission');
var SubmissionModel = require('../models/db/SubmissionModel');

var submissionService = {};

submissionService.getLastJerahmeelId = function (callback) {
  SubmissionModel.max('jerahmeelSubmissionId').then(function (lastId) {
    if (lastId) {
      callback(null, lastId);
    } else {
      callback(null, 0);
    }
  }, function (err) {
    callback(err);
  });
};

submissionService.getSubmissionByLastId = function (lastId, limit, callback) {
  SubmissionModel.findAll({
    where: {
      id: {
        $gt: lastId
      }
    },
    limit: limit
  }).then(function (submissionRecords) {
    var submissions = [];
    submissionRecords.forEach(function (submissionRecord) {
      var submission = new Submission();
      submission.setId(submissionRecord.id)
        .setJerahmeelSubmissionId(submissionRecord.jerahmeelSubmissionId)
        .setSubmissionJid(submissionRecord.submissionJid)
        .setVerdictCode(submissionRecord.verdictCode)
        .setVerdictName(submissionRecord.verdictName)
        .setScore(submissionRecord.score)
        .setUserJid(submissionRecord.userJid)
        .setUsername(submissionRecord.username)
        .setLanguage(submissionRecord.language)
        .setSubmitTime(submissionRecord.submitTime)
        .setProblemJid(submissionRecord.problemJid)
        .setProblemSlug(submissionRecord.problemSlug);

      submissions.push(submission);
    });

    callback(null, submissions);
  }, function (err) {
    callback(err);
  });
};

submissionService.insertSubmission = function (submissions, callback) {
  var values = _.map(submissions, function (submission) {
    return {
      jerahmeelSubmissionId: submission.getJerahmeelSubmissionId(),
      submissionJid: submission.getSubmissionJid(),
      userJid: submission.getUserJid(),
      username: submission.getUsername(),
      submitTime: submission.getSubmitTime(),
      language: submission.getLanguage(),
      problemJid: submission.getProblemJid(),
      problemSlug: submission.getProblemSlug()
    };
  });

  SubmissionModel.bulkCreate(values).then(function () {
    callback(null, submissions.length);
  }, function (err) {
    callback(err);
  });
};

submissionService.updateSubmissionGrading = function (grading, callback) {
  SubmissionModel.findOne({
    where: {
      submissionJid: grading.getSubmissionJid()
    }
  }).then(function (submission) {
    if (submission) {
      submission.update({
        score: grading.getScore(),
        verdictCode: grading.getVerdictCode(),
        verdictName: grading.getVerdictName()
      }).then(function () {
        callback(null);
      }, function (err) {
        callback(err);
      });
    } else {
      callback("submission not found");
    }
  }, function (err) {
    callback(err);
  });
};

module.exports = submissionService;