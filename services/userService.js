var _ = require('underscore');
var async = require('async');
var ReadWriteLock = require('rwlock');

var cache = require('../core/cache');
var knexConnection = require('../core/knexConnection');
var User = require('../models/User');
var UserAcceptedSubmissionModel = require('../models/db/index').UserAcceptedSubmissionModel;
var UserModel = require('../models/db/index').UserModel;
var UserStatisticModel = require('../models/db/index').UserStatisticModel;

var LOCK_USER_STATISTIC_KEY = "user:statistic:lock:id:";
var REDIS_USER_ID_PREFIX = "user:id:";
var REDIS_USER_SOLVED_PROBLEM_PREFIX = "user:problem:solved:id:";
var REDIS_USER_EXPIRATION_TIME = 1800;
var REDIS_USER_SOLVED_PROBLEM_EXPIRATION_TIME = 7200;

var lock = new ReadWriteLock();

var userService = {};

var constructUserFromModel = function (userModel) {
  var user = new User();
  user.setId(userModel.id)
      .setUserJid(userModel.userJid)
      .setUsername(userModel.username)
      .setName(userModel.name);

  if (userModel.statistic) {
    user.setAcceptedSubmission(userModel.statistic.acceptedSubmission)
      .setTotalSubmission(userModel.statistic.totalSubmission)
      .setAcceptedProblem(userModel.statistic.acceptedProblem);
  } else {
    user.setAcceptedSubmission(0)
      .setTotalSubmission(0)
      .setAcceptedProblem(0);
  }

  return user;
};

var constructUserFromPlainObject = function (object) {
  var user = new User();
  user.setId(object.id)
    .setUserJid(object.userJid)
    .setUsername(object.username)
    .setName(object.name)
    .setAcceptedSubmission(object.acceptedSubmission)
    .setTotalSubmission(object.totalSubmission)
    .setAcceptedProblem(object.acceptedProblem);

  return user;
};

var getUserByIdFromDb = function (id, callback) {
  UserModel.findOne({
    where: {
      id: id
    },
    include: [
      {model: UserStatisticModel, as: 'statistic'}
    ]
  }).then(function (user) {
    callback(null, constructUserFromModel(user));
  }, function (err) {
    callback(err);
  });
};

var getUserSolvedProblemIdsFromDb = function (userId, callback) {
  UserAcceptedSubmissionModel.findAll({
    where: {
      userId: userId
    },
    include: [
      {model: UserStatisticModel, as: 'statistic'}
    ]
  }).then(function (records) {
    var problemIds = _.map(records, function (record) {
      return record.problemId;
    });

    callback(null, problemIds);
  }, function (err) {
    callback(err);
  });
};

userService.getUserById = function (id, callback) {
  var redisKey = REDIS_USER_ID_PREFIX + id;

  cache.getUpdateCacheValue(redisKey, REDIS_USER_EXPIRATION_TIME, function (callback) {
    getUserByIdFromDb(id, function (err, user) {
      callback(err, user);
    });
  }, function (err, user) {
    callback(err, constructUserFromPlainObject(user));
  });
};

userService.getUserByUsername = function (username, callback) {
  UserModel.findOne({
    where: {
      username: username
    },
    include: [
      {model: UserStatisticModel, as: 'statistic'}
    ]
  }).then(function (userModel) {
    callback(null, userModel);
  }, function (err) {
    callback(err);
  });
};

userService.getUserIdToUserMap = function (userIds, callback) {
  userService.getUserByIds(userIds, function (err, users) {
    if (err) {
      callback(err);
    } else {
      var map = {};
      users.forEach(function (user) {
        map[user.getId()] = user;
      });

      callback(null, map);
    }
  });
};

userService.getUserByIds = function (userIds, callback) {
  var users = [];
  async.each(userIds, function (userId, callback) {
    userService.getUserById(userId, function (err, user) {
      users.push(user);
      callback(err);
    });
  }, function (err) {
    callback(err, users);
  });
};

userService.getUserSolvedProblemIds = function (userId, callback) {
  var redisKey = REDIS_USER_SOLVED_PROBLEM_PREFIX + userId;

  cache.getCacheValue(redisKey, REDIS_USER_SOLVED_PROBLEM_EXPIRATION_TIME, function (callback) {
    getUserSolvedProblemIdsFromDb(userId, function (err, problemIds) {
      callback(err, problemIds);
    });
  }, function (err, problemIds) {
    callback(err, problemIds);
  });
};

userService.getUserByLastId = function (lastId, limit, callback) {
  UserModel.findAll({
    where: {
      id: {
        $gt: lastId
      }
    },
    limit: limit,
    include: [
      {model: UserStatisticModel, as: 'statistic'}
    ]
  }).then(function (userModels) {
    var users = _.map(userModels, function (userModel) {
      return constructUserFromModel(userModel);
    });

    callback(null, users);
  }, function (err) {
    callback(err);
  });
};

userService.getLastJophielUserId = function (callback) {
  UserModel.max('id').then(function (lastId) {
    if (lastId) {
      callback(null, lastId);
    } else {
      callback(null, 0);
    }
  }, function (err) {
    callback(err);
  });
};

userService.getMostActiveUser = function (timeFrame, limit, callback) {
  var time = Math.floor(Date.now() / 1000) - timeFrame;

  var allSubmission = knexConnection.db
                        .select("user.id AS user_id", knexConnection.db.raw("COUNT(submission.id) AS submission_count"))
                        .from("user")
                        .join("submission", "user.id", "=", "submission.user_id")
                        .where("submission.submit_time", ">", time)
                        .groupBy("user.id");

  var acceptedSubmission = knexConnection.db
                            .select("user.id AS user_id", knexConnection.db.raw("COUNT(submission.id) AS submission_count"))
                            .from("user")
                            .join("submission", "user.id", "=", "submission.user_id")
                            .where("submission.submit_time", ">", time)
                            .andWhere("submission.verdict_code", "=", "AC")
                            .groupBy("user.id");

  var newAcceptedSubmission = knexConnection.db
                                .select("user.id AS user_id", knexConnection.db.raw("COUNT (user_accepted_submission.problem_id) AS problem_count"))
                                .from("user")
                                .join("user_accepted_submission", "user.id", "=", "user_accepted_submission.user_id")
                                .where("time", ">", time)
                                .groupBy("user.id");

  knexConnection.db
    .select("user.id AS user_id", "user.username AS username", "submission.submission_count AS submission_count"
      , "accepted_submission.submission_count AS accepted_submission_count", "new_accepted_problem.problem_count AS new_accepted_problem_count")
    .from("user")
    .joinRaw("JOIN (" + allSubmission.toString() + ") AS submission ON user.id = submission.user_id")
    .joinRaw("JOIN (" + acceptedSubmission.toString() + ") AS accepted_submission ON user.id = accepted_submission.user_id")
    .joinRaw("JOIN (" + newAcceptedSubmission.toString() + ") AS new_accepted_problem ON user.id = new_accepted_problem.user_id")
    .orderBy("new_accepted_problem_count", "DESC")
    .orderBy("submission_count", "DESC")
    .limit(limit)
    .then(function (users) {
      callback(null, users);
    }, function (err) {
      callback(err);
    });
};

userService.insertUser = function (id, userJid, username, name, callback) {
  UserModel.create({
    id: id,
    userJid: userJid,
    username: username,
    name: name
  }).then(function () {
    callback(null);
  }, function (err) {
    console.dir(err);
    callback(err);
  });
};

userService.changeName = function (userJid, name, callback) {
  UserModel.findOne({
    where: {
      userJid: userJid
    }
  }).then(function (user) {
    if (user.name != name) {
      user.update({
        name: name
      }).then(function () {
        callback(null);
      }, function (err) {
        callback(err);
      });
    } else {
      callback(null);
    }
  }, function (err) {
    callback(err);
  });
};

userService.incrementSubmissionCount = function (userId, count, callback) {
  var key = LOCK_USER_STATISTIC_KEY + userId;

  lock.writeLock(key, function (release) {
    UserStatisticModel.findOne({
      where: {
        userId: userId
      }
    }).then(function (statistic) {
      if (statistic) {
        return statistic.update({
          totalSubmission: statistic.totalSubmission + count
        });
      } else {
        return UserStatisticModel.create({
          userId: userId,
          totalSubmission: count,
          acceptedSubmission: 0,
          acceptedProblem: 0
        });
      }
    }).then(function () {
      release();
      callback(null);
    }, function (err) {
      release();
      callback(err);
    });
  });
};

userService.incrementAcceptedSubmissionCount = function (userId, count, callback) {
  var key = LOCK_USER_STATISTIC_KEY + userId;

  lock.writeLock(key, function (release) {
    UserStatisticModel.findOne({
      where: {
        userId: userId
      }
    }).then(function (statistic) {
      if (statistic) {
        return statistic.update({
          acceptedSubmission: statistic.acceptedSubmission + count
        });
      } else {
        return UserStatisticModel.create({
          userId: userId,
          totalSubmission: 0,
          acceptedSubmission: count,
          acceptedProblem: 0
        });
      }
    }).then(function () {
      release();
      callback(null);
    }, function (err) {
      release();
      callback(err);
    });
  });
};

userService.incrementAcceptedProblemCount = function (userId, count, callback) {
  var key = LOCK_USER_STATISTIC_KEY + userId;

  lock.writeLock(key, function (release) {
    UserStatisticModel.findOne({
      where: {
        userId: userId
      }
    }).then(function (statistic) {
      if (statistic) {
        return statistic.update({
          acceptedProblem: statistic.acceptedProblem + count
        });
      } else {
        return UserStatisticModel.create({
          userId: userId,
          totalSubmission: 0,
          acceptedSubmission: 0,
          acceptedProblem: count
        });
      }
    }).then(function () {
      release();
      callback(null);
    }, function (err) {
      release();
      callback(err);
    });
  });
};

userService.isUserAcceptedInProblem = function (userId, problemId, callback) {
  UserAcceptedSubmissionModel.findOne({
    where: {
      userId: userId,
      problemId: problemId
    }
  }).then(function (record) {
    if (record) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }, function (err) {
    callback(err);
  });
};

userService.markUserAcceptedInProblem = function (userId, problemId, time, callback) {
  UserAcceptedSubmissionModel.create({
    userId: userId,
    problemId: problemId,
    time: time
  }).then(function (record) {
    callback(null);
  }, function (err) {
    callback(err);
  });
};

module.exports = userService;
module.exports.REDIS_USER_SOLVED_PROBLEM_PREFIX = REDIS_USER_SOLVED_PROBLEM_PREFIX;