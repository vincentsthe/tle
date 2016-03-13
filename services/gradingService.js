var _ = require('underscore');

var Grading = require('../models/Grading');
var GradingModel = require('../models/db/index').GradingModel;

var gradingService = {};

var constructGradingFromModel = function (gradingModel) {
  var grading = new Grading();
  grading.setId(gradingModel.id)
        .setSubmissionId(gradingModel.submissionId)
        .setScore(gradingModel.score)
        .setVerdictCode(gradingModel.verdictCode)
        .setVerdictName(gradingModel.verdictName)
        .setEvaluated(gradingModel.evaluated)
        .setUserId(gradingModel.userId)
        .setProblemId(gradingModel.problemId)
        .setSubmissionTime(gradingModel.submissionTime);

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

gradingService.insertGrading = function (id, submissionId, score, verdictCode, verdictName, userId, problemId, submissionTime, callback) {
  GradingModel.create({
    id: id,
    submissionId: submissionId,
    score: score,
    verdictCode: verdictCode,
    verdictName: verdictName,
    userId: userId,
    problemId: problemId,
    evaluated: false,
    submissionTime: submissionTime
  }).then(function () {
    callback();
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