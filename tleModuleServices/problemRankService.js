var _ = require('underscore');
var async = require('async');

var redisClient = require('../core/redisClient');
var problemService = require('../services/problemService');

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
              problemRankService.insertProblemRecord(problem.getProblemJid(), problem.getAcceptedUser(), function (err) {
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

problemRankService.getProblemsByRankRange = function (initialRank, limit, callback) {
  var args = [PROBLEM_RANK_REDIS_SET, initialRank - 1, initialRank + limit - 1];
  redisClient.zrange(args, function (err, problemJids) {
    problemService.getProblemJidToProblemMap(problemJids, function (err, map) {
      if (err) {
        callback(err);
      } else {
        var problems = _.map(problemJids, function (problemJid) {
          return map[problemJid];
        });

        callback(null, problems);
      }
    });
  });
};

problemRankService.incrementAcceptedUser = function (problemJid, count, callback) {
  var args = [PROBLEM_RANK_REDIS_SET, -count, problemJid];
  redisClient.zincrby(args, function (err) {
    callback(err);
  });
};

problemRankService.insertProblemRecord = function (problemJid, count, callback) {
  var args = [PROBLEM_RANK_REDIS_SET, -count, problemJid];
  redisClient.zadd(args, function (err) {
    callback(err);
  });
};

module.exports = problemRankService;