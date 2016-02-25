var _ = require('underscore');
var async = require('async');

var lastIdService = require('../../services/lastIdService');
var problemService = require('../../services/problemService');
var tlxProblemService = require('../../tlxservices/tlxProblemService');

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
      var problemJids = _.map(problems, function (problem) {
        return problem.getProblemJid();
      });

      tlxProblemService.getProblemSlugsByJids(problemJids, function (err, problemSlugsMap) {
        if (err) {
          callback(err);
        } else {
          problems.forEach(function (problem) {
            problem.setSlug(problemSlugsMap[problem.getProblemJid()]);
          });

          callback(null, problems, problemsetMaxId, courseMaxId);
        }
      });
    }, function (problems, problemsetMaxId, courseMaxId, callback) {
      var nonExistProblems = [];
      async.each(problems, function (problem, callback) {
        problemService.existByJid(problem.getProblemJid(), function (err, exist) {
          if (err) {
            callback(err);
          } else {
            if (!exist) {
              for (var i = 0; i < nonExistProblems.length; i++) {
                if (nonExistProblems[i].getProblemJid() == problem.getProblemJid()) {
                  exist = true;
                }
              }

              if (!exist) {
                nonExistProblems.push(problem);
              }
            }

            callback(null);
          }
        });
      }, function (err) {
        callback(err, nonExistProblems, problemsetMaxId, courseMaxId);
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
