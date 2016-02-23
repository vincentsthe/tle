var async = require('async');

var lastIdService = require('../services/lastIdService');
var problemService = require('../services/problemService');
var tlxProblemService = require('../tlxservices/tlxProblemService');

var problemMigrator = {};

problemMigrator.migrate = function (limit, callback) {
  async.waterfall([
    function (callback) {
      lastIdService.getKeyLastId(lastIdService.PROBLEMSET_PROBLEM_LAST_ID_KEY, function (err, lastId) {
        callback(err, lastId);
      });
    }, function (problemsetLastId, callback) {
      tlxProblemService.fetchProblemFromJerahmeelProblemset(problemsetLastId, limit, function (err, problems, problemsetMaxId) {
        callback(err, problems, problemsetMaxId);
      });
    }, function (problems, problemsetMaxId, callback) {
      lastIdService.getKeyLastId(lastIdService.COURSE_PROBLEM_LAST_ID_KEY, function (err, courseLastId) {
        callback(err, problems, problemsetMaxId, courseLastId);
      });
    }, function (problems, problemsetMaxId, courseLastId, callback) {
      tlxProblemService.fetchProblemFromJerahmeelCourse(courseLastId, limit - problems.length, function (err, courseProblems, courseMaxId) {
        if (err) {
          console.log("error fetching problem from course: " + err);
          callback(null, problems, problemsetMaxId, courseMaxId);
        } else {
          problems = problems.concat(courseProblems);
          callback(null, problems, problemsetMaxId, courseMaxId);
        }
      });
    }, function (problems, problemsetMaxId, courseMaxId, callback) {
      tlxProblemService.fillProblemSlugFromSandalphon(problems, function (err, problemRecords) {
        callback(err, problemRecords, problemsetMaxId, courseMaxId);
      });
    }, function (problems, problemsetMaxId, courseMaxId, callback) {
      if (problems.length) {
        problemService.insertProblem(problems, function (err) {
          callback(err, problems.length, problemsetMaxId, courseMaxId);
        });
      } else {
        callback(null, 0, 0, 0);
      }
    }, function (problemCount, problemsetMaxId, courseMaxId, callback) {
      lastIdService.updateLastId(lastIdService.PROBLEMSET_PROBLEM_LAST_ID_KEY, problemsetMaxId, function (err) {
        callback(err, problemCount, courseMaxId);
      });
    }, function (problemCount, courseMaxId, callback) {
      lastIdService.updateLastId(lastIdService.COURSE_PROBLEM_LAST_ID_KEY, courseMaxId, function (err) {
        callback(err, problemCount);
      });
    }
  ], function (err, problemCount) {
    callback(err, problemCount);
  });
};

module.exports = problemMigrator;
