var _ = require('underscore');

var Grading = require('../models/Grading');
var GradingModel = require('../models/db/GradingModel');

var gradingService = {};

var constructGradingFromModel = function (gradingModel) {
  var grading = new Grading();
  grading.setId(gradingModel.id)
        .setSubmissionJid(gradingModel.submissionJid)
        .setScore(gradingModel.score)
        .setVerdictCode(gradingModel.verdictCode)
        .setVerdictName(gradingModel.verdictName)
        .setEvaluated(gradingModel.evaluated)
        .setUserJid(gradingModel.userJid)
        .setProblemJid(gradingModel.problemJid);

  return grading;
};

gradingService.getGradingDataByLastId = function (lastId, limit, callback) {
  GradingModel.findAll({
    where: {
      id: {
        $gt: lastId
      }
    },
    limit: limit,
    order: 'id ASC'
  }).then(function (gradingRecords) {
    var gradings = _.map(gradingRecords, function (gradingRecord) {
      return constructGradingFromModel(gradingRecord)
    });

    callback(null, gradings);
  }, function (err) {
    callback(err);
  });
};

gradingService.insertGradingData = function (gradings, callback) {
  var values = _.map(gradings, function (grading) {
    return {
      submissionJid: grading.getSubmissionJid(),
      score: grading.getScore(),
      verdictCode: grading.getVerdictCode(),
      verdictName: grading.getVerdictName(),
      evaluated: grading.isEvaluated(),
      userJid: grading.getUserJid(),
      problemJid: grading.getProblemJid()
    };
  });

  GradingModel.bulkCreate(values).then(function () {
    callback(null, gradings.length);
  }, function (err) {
    callback(err);
  });
};

gradingService.getUnevaluatedGradingData = function (limit, callback) {
  GradingModel.findAll({
    where: {
      evaluated: false
    },
    limit: limit,
    order: 'id ASC'
  }).then(function (gradings) {
    var result = _.map(gradings, function (grading) {
      return constructGradingFromModel(grading);
    });

    callback(null, result);
  }, function (err) {
    callback(err);
  });
};

gradingService.markGradingAsEvaluated = function (id, callback) {
  GradingModel.findOne({
    where: {
      id: id
    }
  }).then(function (grading) {
    grading.update({
      evaluated: true
    }).then(function () {
      callback(null);
    }, function (err) {
      callback(err);
    });
  }, function (err) {
    callback(err);
  });
};

module.exports = gradingService;