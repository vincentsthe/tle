var _ = require('underscore');

var Grading = require('../models/Grading');
var GradingModel = require('../models/db/GradingModel');

var gradingService = {};

gradingService.insertGradingData = function (gradings, callback) {
  var values = _.map(gradings, function (grading) {
    return {
      submissionJid: grading.getSubmissionJid(),
      score: grading.getScore(),
      verdictCode: grading.getVerdictCode(),
      verdictName: grading.getVerdictName()
    };
  });

  GradingModel.bulkCreate(values).then(function () {
    callback(null, gradings.length);
  }, function (err) {
    callback(err);
  });
};

gradingService.getGradingData = function (limit, callback) {
  GradingModel.findAll({
    limit: limit,
    order: ['id', 'ASC']
  }).then(function (gradings) {
    var result = [];
    gradings.forEach(function (grading) {
      var record = new Grading();
      record.setId(grading.id)
            .setSubmissionJid(grading.submissionJid)
            .setScore(grading.score)
            .setVerdictCode(grading.verdictCode)
            .setVerdictName(grading.verdictName);

      result.push(record);
    });

    callback(null, result);
  }, function (err) {
    callback(err);
  });
};

gradingService.deleteGrading = function (id, callback) {
  GradingModel.destroy({
    where: {
      id: id
    }
  }).then(function () {
    callback(null);
  }, function (err) {
    callback(err);
  });
};

module.exports = gradingService;