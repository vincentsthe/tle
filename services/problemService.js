var _ = require('underscore');

var Problem = require('../models/Problem');
var ProblemModel = require('../models/db/ProblemModel');

var problemService = {};

var constructProblemFromModel = function (problemModel) {
  var problem = new Problem();
  problem.setId(problemModel.id)
        .setProblemJid(problemModel.problemJid)
        .setSlug(problemModel.slug)
        .setAcceptedUser(problemModel.acceptedUser)
        .setTotalSubmission(problemModel.totalSubmission)
        .setAcceptedSubmission(problemModel.acceptedSubmission)
        .setUrl(problemModel.url);

  return problem;
};

problemService.getProblemJidToProblemMap = function (problemJids, callback) {
  problemService.getProblemByJids(problemJids, function (err, problems) {
    if (err) {
      callback(err);
    } else {
      var map = {};
      problems.forEach(function (problem) {
        map[problem.getProblemJid()] = problem;
      });

      callback(null, map);
    }
  });
};

problemService.getProblemByLastId = function (lastId, limit, callback) {
  ProblemModel.findAll({
    where: {
      id: {
        $gt: lastId
      }
    },
    limit: limit
  }).then(function (problemRecords) {
    var problems = _.map(problemRecords, function (problemRecord) {
      return constructProblemFromModel(problemRecord);
    });

    callback(null, problems);
  }, function (err) {
    callback(err);
  });
};

problemService.getProblemByJids = function (problemJids, callback) {
  ProblemModel.findAll({
    where: {
      problemJid: {
        $in: problemJids
      }
    }
  }).then(function (problemRecords) {
    var problems = _.map(problemRecords, function (problemRecord) {
      return constructProblemFromModel(problemRecord);
    });

    callback(null, problems);
  }, function (err) {
    callback(err);
  });
};

problemService.insertProblem = function (problems, callback) {
  if (problems.length) {
    var values = _.map(problems, function (problem) {
      return {
        id: problem.getId(),
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
