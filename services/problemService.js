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

module.exports = problemService;
