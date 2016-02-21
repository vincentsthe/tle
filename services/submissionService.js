var _ = require('underscore');

var ProblemModel = require('../models/db/ProblemModel');
var SubmissionModel = require('../models/db/SubmissionModel');
var UserModel = require('../models/db/UserModel');

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

submissionService.fillProblemSlug = function (submissions, callback) {
  if (submissions.length) {
    var problemJids = _.map(submissions, function (submission) {
      return submission.getProblemJid();
    });

    ProblemModel.findAll({
      where: {
        problemJid: {
          $in: problemJids
        }
      }
    }).then(function (problems) {
      var problemMap = {};
      problems.forEach(function (problem) {
        problemMap[problem.problemJid] = problem.slug;
      });

      submissions.forEach(function (submission) {
        submission.setProblemSlug(problemMap[submission.getProblemJid()]);
      });

      callback(null, submissions);
    }, function (err) {
      callback(err);
    });
  } else {
    callback(null, submissions);
  }
};

submissionService.fillUsername = function (submissions, callback) {
  if (submissions.length) {
    var userJids = _.map(submissions, function (submission) {
      return submission.getUserJid();
    });

    UserModel.findAll({
      where: {
        userJid: {
          $in: userJids
        }
      }
    }).then(function (users) {
      var userMap = {};
      users.forEach(function (user) {
        userMap[user.userJid] = user.username;
      });

      submissions.forEach(function (submission) {
        submission.setUsername(userMap[submission.getUserJid()]);
      });

      callback(null, submissions);
    }, function (err) {
      callback(err);
    });
  } else {
    callback(null, submissions);
  }
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