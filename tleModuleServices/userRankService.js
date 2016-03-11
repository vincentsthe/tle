var _ = require('underscore');
var async = require('async');

var redisClient = require('../core/redisClient');
var userService = require('../services/userService');

var USER_RANK_REDIS_SET = 'user_rank';
var QUERY_PER_BATCH = 300;

var userRankService = {};

userRankService.init = function (callback) {
  var lastId = 0;

  var lastRecordCount = QUERY_PER_BATCH;

  redisClient.del(USER_RANK_REDIS_SET, function (err) {
    if (err) {
      callback(err);
    } else {
      async.whilst(function () {
        return lastRecordCount == QUERY_PER_BATCH;
      }, function (callback) {
        userService.getUserByLastId(lastId, QUERY_PER_BATCH, function (err, users) {
          if (users.length) {
            lastId = _.max(users, function (user) {
              return user.getId();
            }).getId();
          } else {
            lastId++;
          }
          lastRecordCount = users.length;

          if (err) {
            callback(err);
          } else {
            async.each(users, function (user, callback) {
              userRankService.insertUserRecord(user.getId(), user.getAcceptedProblem(), function (err) {
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

userRankService.getRank = function (userId, callback) {
  var args = [USER_RANK_REDIS_SET, userId];
  redisClient.zrank(args, function (err, rank) {
    if (rank) {
      callback(err, rank + 1);
    } else {
      callback(err, 0);
    }
  });
};

userRankService.getUsersByRankRange = function (initialRank, limit, callback) {
  var args = [USER_RANK_REDIS_SET, initialRank - 1, initialRank + limit - 1];
  redisClient.zrange(args, function (err, userIds) {
    userService.getUserIdToUserMap(userIds, function (err, map) {
      if (err) {
        callback(err);
      } else {
        var users = _.map(userIds, function (userId) {
          return map[userId];
        });

        callback(null, users);
      }
    });
  });
};

userRankService.incrementAcceptedProblem = function (userId, count, callback) {
  var args = [USER_RANK_REDIS_SET, -count, userId];
  redisClient.zincrby(args, function (err) {
    callback(err);
  });
};

userRankService.insertUserRecord = function (userId, count, callback) {
  var args = [USER_RANK_REDIS_SET, -count, userId];
  redisClient.zadd(args, function (err) {
    callback(err);
  });
};

module.exports = userRankService;