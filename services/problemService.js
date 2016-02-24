var _ = require('underscore');

var ProblemModel = require('../models/db/ProblemModel');

var problemService = {};

problemService.insertProblem = function (problems, callback) {
  if (problems.length) {
    var values = _.map(problems, function (problem) {
      return {
        problemJid: problem.getProblemJid(),
        slug: problem.getSlug(),
        acceptedUser: problem.getAcceptedUser(),
        totalSubmission: problem.getTotalSubmission(),
        acceptedSubmission: problem.getAcceptedSubmission(),
        url: problem.getUrl()
      };
    });

    ProblemModel.bulkCreate(values).then(function () {
      callback(null, problems.length)
    }, function (err) {
      callback(err);
    });
  } else {
    callback(null);
  }
};

problemService.existByJid = function (problemJid, callback) {
  ProblemModel.findOne({
    where: {
      problemJid: problemJid
    }
  }).then(function (problem) {
    if (problem) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }, function (err) {
    callback(err);
  });
};

problemService.incrementSubmissionCount = function (problemJid, count, callback) {
  ProblemModel.findOne({
    where: {
      problemJid: problemJid
    }
  }).then(function (problem) {
    if (problem) {
      problem.update({
        totalSubmission: problem.totalSubmission + count
      }).then(function () {
        callback(null);
      }, function (err) {
        callback(err);
      });
    } else {
      callback(null);
    }
  }, function (err) {
    callback(err);
  });
};

problemService.incrementAcceptedSubmissionCount = function (problemJid, count, callback) {
  ProblemModel.findOne({
    where: {
      problemJid: problemJid
    }
  }).then(function (problem) {
    if (problem) {
      problem.update({
        acceptedSubmission: problem.acceptedSubmission + count
      }).then(function () {
        callback(null);
      }, function (err) {
        callback(err);
      });
    } else {
      callback(null);
    }
  }, function (err) {
    callback(err);
  });
};

problemService.incrementAcceptedUserCount = function (problemJid, count, callback) {
  ProblemModel.findOne({
    where: {
      problemJid: problemJid
    }
  }).then(function (problem) {
    if (problem) {
      problem.update({
        acceptedUser: problem.acceptedUser + count
      }).then(function () {
        callback(null);
      }, function (err) {
        callback(err);
      });
    } else {
      callback(null);
    }
  }, function (err) {
    callback(err);
  });
};

module.exports = problemService;
