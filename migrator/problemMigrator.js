var async = require('async');

var problemService = require('../services/problemService');
var tlxProblemService = require('../services/tlxProblemService');

var problemMigrator = {};

problemMigrator.migrate = function (callback) {
  async.waterfall([
    function (callback) {
      problemService.getLastProblemId(function (err, lastId) {
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
      tlxProblemService.fetchProblemObjectFromJerahmeel(lastId, 100, function (err, problemObjects) {
        if (err) {
          callback("error fetching problem records from jerahmeel: " + err);
        } else {
          callback(null, problemObjects);
        }
      });
    },function (problemObjects, callback) {
      tlxProblemService.fetchProblemFromJerahmeelRecord(problemObjects, function (err, problemRecords) {
        if (err) {
          callback("error fetching problem record from sandalphon: " + err);
        } else {
          callback(null, problemRecords);
        }
      });
    }, function (problems, callback) {
      problemService.insertProblem(problems, function (err) {
        if (err) {
          callback("error inserting to db: " + err);
        } else {
          callback(null, problems.length);
        }
      });
    }
  ], function (err, problemCount) {
    if (err) {
      console.log("error migrating problem: " + err);
    } else {
      console.log("success migrating " + problemCount + " problems");
    }
  });
};

module.exports = problemMigrator;
