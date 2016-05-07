var _ = require('underscore');

var cache = require('../core/cache');
var problemService = require('../services/problemService');
var userService = require('../services/userService');

var RECENT_STATISTIC_EXPIRE_TIME = 60 * 60 * 12;
var RECENT_STATISTIC_ITEM_COUNT = 10;
var RECENT_STATISTIC_TIME_FRAME = 60 * 60 * 24 * 7;

var REDIS_NEW_PROBLEM_KEY = "problem:new:key";
var REDIS_RECENT_ACTIVE_PROBLEM_KEY = "problem:active:recent:key";
var REDIS_RECENT_ACTIVE_USER_KEY = "user:active:recent:key";

var recentStatisticService = {};

recentStatisticService.getNewProblem = function (callback) {
  cache.getCacheValue(REDIS_NEW_PROBLEM_KEY, RECENT_STATISTIC_EXPIRE_TIME, function (callback) {
    problemService.getProblem('create_time', 'DESC', 0, RECENT_STATISTIC_ITEM_COUNT, function (err, newProblem) {
      callback(err, newProblem);
    });
  }, function (err, newProblem) {
    callback(err, newProblem);
  });
};

recentStatisticService.getRecentActiveProblem = function (callback) {
  cache.getCacheValue(REDIS_RECENT_ACTIVE_PROBLEM_KEY, RECENT_STATISTIC_EXPIRE_TIME, function (callback) {
    problemService.getProblemWithMostSubmission(RECENT_STATISTIC_TIME_FRAME, RECENT_STATISTIC_ITEM_COUNT, function (err, problems) {
      callback(err, problems);
    });
  }, function (err, recentActiveProblem) {
    callback(err, recentActiveProblem);
  });
};

recentStatisticService.getRecentMostActiveUser = function (callback) {
  cache.getCacheValue(REDIS_RECENT_ACTIVE_USER_KEY, RECENT_STATISTIC_EXPIRE_TIME, function (callback) {
    userService.getMostActiveUser(RECENT_STATISTIC_TIME_FRAME,RECENT_STATISTIC_ITEM_COUNT, function (err, users) {
      callback(err, users);
    });
  }, function (err, recentActiveUser) {
    callback(err, recentActiveUser);
  });
};

module.exports = recentStatisticService;
