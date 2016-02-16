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
          callback("error get last problem id: " + err);
        } else {
          if (!lastId) {
            lastId = 0;
          }
          callback(null, lastId);
        }
      });
    }, function (lastId, callback) {
      tlxProblemService.fetchProblemFromJerahmeelProblemset(lastId, limit, function (err, problems, maxId) {
        if (err) {
          callback("error fetching problem records from jerahmeel: " + err);
        } else {
          callback(null, problems, maxId);
        }
      });
    },function (problems, maxId, callback) {
      tlxProblemService.fillProblemSlugFromSandalphon(problems, function (err, problemRecords) {
        if (err) {
          callback("error fetching problem record from sandalphon: " + err);
        } else {
          callback(null, problemRecords, maxId);
        }
      });
    }, function (problems, maxId, callback) {
      if (maxId) {
        problemService.insertProblem(problems, function (err) {
          if (err) {
            callback("error inserting to db: " + err);
          } else {
            callback(null, problems.length, maxId);
          }
        });
      } else {
        callback(null, 0, 0);
      }
    }, function (problemCount, maxId, callback) {
      lastIdService.updateLastId(lastIdService.PROBLEMSET_PROBLEM_LAST_ID_KEY, maxId, function (err, lastId) {
        if (err) {
          callback("error updateing last id for " + lastIdService.PROBLEMSET_PROBLEM_LAST_ID_KEY + ": " + err);
        } else {
          callback(null, problemCount);
        }
      })
    }
  ], function (err, problemCount) {
    callback(err, problemCount);
  });
};

module.exports = problemMigrator;
