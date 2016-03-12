var _ = require('underscore');
var async = require('async');

var redisClient = require('../core/redisClient');
var problemService = require('../services/problemService');
var userService = require('../services/userService');

var PROBLEM_RANK_REDIS_SET = 'problem_rank';
var QUERY_PER_BATCH = 300;

var problemRankService = {};

problemRankService.init = function (callback) {
  var lastId = 0;

  var lastRecordCount = QUERY_PER_BATCH;

  redisClient.del(PROBLEM_RANK_REDIS_SET, function (err) {
    if (err) {
      callback(err);
    } else {
      async.whilst(function () {
        return lastRecordCount == QUERY_PER_BATCH;
      }, function (callback) {
        problemService.getProblemByLastId(lastId, QUERY_PER_BATCH, function (err, problems) {
          if (problems.length) {
            lastId = _.max(problems, function (problem) {
              return problem.getId();
            }).getId();
          } else {
            lastId++;
          }
          lastRecordCount = problems.length;

          if (err) {
            callback(err);
          } else {
            async.each(problems, function (problem, callback) {
              problemRankService.insertProblemRecord(problem.getId(), problem.getAcceptedUser(), function (err) {
                callback(err);
              });
            }, function (err) {
              callback(err);
            });
          }
        });
      }, function (err) {
        callback(err);
      });
    }
  });
};

var getProblemIdsByRankRange = function (initialRank, limit, callback) {
  var args = [PROBLEM_RANK_REDIS_SET, initialRank - 1, initialRank + limit - 2];
  redisClient.zrange(args, function (err, problemIds) {
    problemIds = _.map(problemIds, function (problemId) {
      return parseInt(problemId);
    });
    callback(err, problemIds);
  });
};

problemRankService.getProblemsByRankRange = function (initialRank, limit, callback) {
  getProblemIdsByRankRange(initialRank, limit, function (err, problemIds) {
    problemService.getProblemIdToProblemMap(problemIds, function (err, map) {
      if (err) {
        callback(err);
      } else {
        var problems = _.map(problemIds, function (problemId) {
          return map[problemId];
        });

        callback(null, problems);
      }
    });
  });
};

// TODO: cache this
problemRankService.getProblemRecommendation = function (userId, limit, callback) {
  if (!userId) {
    problemRankService.getProblemsByRankRange(1, limit, function (err, problems) {
      callback(err, problems);
    });
  } else {
    var QUERY_PER_BATCH = 50;

    userService.getUserSolvedProblemIds(userId, function (err, solvedProblemIds) {
      async.waterfall([
        function (callback) {
          var result = [];
          var offset = 1;
          var lastLength = QUERY_PER_BATCH;
          async.whilst(function () {
            return ((lastLength == QUERY_PER_BATCH) && (result.length < limit));
          }, function (callback) {
            getProblemIdsByRankRange(offset, QUERY_PER_BATCH, function (err, problemIds) {
              if (err) {
                callback(err);
              } else {
                lastLength = problemIds.length;
                var newResult = _.difference(problemIds, solvedProblemIds);
                for (var i = 0; i < newResult.length; i++) {
                  if (result.length < limit) {
                    result.push(newResult[i]);
                  }
                }
                offset += QUERY_PER_BATCH;
                callback(null);
              }
            });
          }, function (err) {
            callback(err, result)
          });
        }, function (problemIds, callback) {
          problemService.getProblemIdToProblemMap(problemIds, function (err, map) {
            if (err) {
              callback(err);
            } else {
              var problems = _.map(problemIds, function (problemId) {
                return map[problemId];
              });

              callback(null, problems);
            }
          });
        }
      ], function (err, problems) {
        callback(err, problems);
      });
    });
  }
};

problemRankService.incrementAcceptedUser = function (problemId, count, callback) {
  var args = [PROBLEM_RANK_REDIS_SET, -count, problemId];
  redisClient.zincrby(args, function (err) {
    callback(err);
  });
};

problemRankService.insertProblemRecord = function (problemId, count, callback) {
  var args = [PROBLEM_RANK_REDIS_SET, -count, problemId];
  redisClient.zadd(args, function (err) {
    callback(err);
  });
};

module.exports = problemRankService;