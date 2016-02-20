var async = require('async');

var lastIdService = require('../services/lastIdService');
var problemService = require('../services/problemService');
var tlxProblemService = require('../tlxservices/tlxProblemService');

var problemMigrator = {};

problemMigrator.migrate = function (limit, callback) {
  async.waterfall([
    function (callback) {
      lastIdService.getKeyLastId(lastIdService.PROBLEMSET_PROBLEM_LAST_ID_KEY, function (err, lastId) {
        if (err) {
          callback("error get last " + lastIdService.PROBLEMSET_PROBLEM_LAST_ID_KEY + " id: " + err);
        } else {
          callback(null, lastId);
        }
      });
    }, function (problemsetLastId, callback) {
      tlxProblemService.fetchProblemFromJerahmeelProblemset(problemsetLastId, limit, function (err, problems, problemsetMaxId) {
        if (err) {
          callback("error fetching problem records from jerahmeel: " + err);
        } else {
          callback(null, problems, problemsetMaxId);
        }
      });
    }, function (problems, problemsetMaxId, callback) {
      lastIdService.getKeyLastId(lastIdService.COURSE_PROBLEM_LAST_ID_KEY, function (err, courseLastId) {
        if (err) {
          callback("error get last " + lastIdService.COURSE_PROBLEM_LAST_ID_KEY + " id: " + err);
        } else {
          callback(null, problems, problemsetMaxId, courseLastId);
        }
      });
    }, function (problems, problemsetMaxId, courseLastId) {
      tlxProblemService.fetchProblemFromJerahmeelCourse(courseLastId, limit - problems.length, function (err, courseProblems, courseMaxId) {
        if (err) {
          console.log("error fetching problem from course");
          callback(null, problems, problemsetMaxId, 0);
        } else {
          callback(null, problems, problemsetMaxId, courseMaxId);
        }
      });
    }, function (problems, problemsetMaxId, courseMaxId, callback) {
      tlxProblemService.fillProblemSlugFromSandalphon(problems, function (err, problemRecords) {
        if (err) {
          callback("error fetching problem record from sandalphon: " + err);
        } else {
          callback(null, problemRecords, problemsetMaxId, courseMaxId);
        }
      });
    }, function (problems, problemsetMaxId, courseMaxId, callback) {
      if (maxId) {
        problemService.insertProblem(problems, function (err) {
          if (err) {
            callback("error inserting to db: " + err);
          } else {
            callback(null, problems.length, problemsetMaxId, courseMaxId);
          }
        });
      } else {
        callback(null, 0, 0);
      }
    }, function (problemCount, problemsetMaxId, courseMaxId, callback) {
      lastIdService.updateLastId(lastIdService.PROBLEMSET_PROBLEM_LAST_ID_KEY, problemsetMaxId, function (err) {
        if (err) {
          callback("error updateing last id for " + lastIdService.PROBLEMSET_PROBLEM_LAST_ID_KEY + ": " + err);
        } else {
          callback(null, problemCount);
        }
      });
    }, function (problemCount, courseMaxId, callback) {
      lastIdService.updateLastId(lastIdService.COURSE_PROBLEM_LAST_ID_KEY, courseMaxId, function (err) {
        if (err) {
          callback("error updateing last id for " + lastIdService.COURSE_PROBLEM_LAST_ID_KEY + ": " + err);
        } else {
          callback(null, problemCount);
        }
      });
    }
  ], function (err, problemCount) {
    callback(err, problemCount);
  });
};

module.exports = problemMigrator;
