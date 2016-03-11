var _ = require('underscore');

var User = require('../models/User');
var UserModel = require('../models/db/index').UserModel;
var UserAcceptedSubmissionModel = require('../models/db/index').UserAcceptedSubmissionModel;

var userService = {};

var constructUserFromModel = function (userModel) {
  var user = new User();
  user.setId(userModel.id)
      .setUserJid(userModel.userJid)
      .setUsername(userModel.username)
      .setName(userModel.name)
      .setAcceptedSubmission(userModel.acceptedSubmission)
      .setTotalSubmission(userModel.totalSubmission)
      .setAcceptedProblem(userModel.acceptedProblem);

  return user;
};

userService.getUserJidToUserMap = function (userJids, callback) {
  userService.getUserByJids(userJids, function (err, users) {
    if (err) {
      callback(err);
    } else {
      var map = {};
      users.forEach(function (user) {
        map[user.getUserJid()] = user;
      });

      callback(null, map);
    }
  });
};

userService.getUserByJids = function (userJids, callback) {
  UserModel.findAll({
    where: {
      userJid: {
        $in: userJids
      }
    }
  }).then(function (userModels) {
    var users = _.map(userModels, function (userModel) {
      return constructUserFromModel(userModel);
    });

    callback(null, users);
  }, function (err) {
    callback(err);
  });
};

userService.getUserByLastId = function (lastId, limit, callback) {
  UserModel.findAll({
    where: {
      id: {
        $gt: lastId
      }
    },
    limit: limit
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

userService.insertUser = function (id, userJid, username, name, callback) {
  UserModel.create({
    id: id,
    userJid: userJid,
    username: username,
    name: name,
    acceptedSubmission: 0,
    totalSubmission: 0,
    acceptedProblem: 0
  }).then(function () {
    callback(null);
  }, function (err) {
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
  UserModel.findOne({
    where: {
      id: userId
    }
  }).then(function (user) {
    if (user) {
      user.update({
        totalSubmission: user.totalSubmission + count
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

userService.incrementAcceptedSubmissionCount = function (userId, count, callback) {
  UserModel.findOne({
    where: {
      id: userId
    }
  }).then(function (user) {
    if (user) {
      user.update({
        acceptedSubmission: user.acceptedSubmission + count
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

userService.incrementAcceptedProblemCount = function (userId, count, callback) {
  UserModel.findOne({
    where: {
      id: userId
    }
  }).then(function (user) {
    if (user) {
      user.update({
        acceptedProblem: user.acceptedProblem + count
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

userService.markUserAcceptedInProblem = function (userId, problemId, callback) {
  UserAcceptedSubmissionModel.create({
    userId: userId,
    problemId: problemId
  }).then(function (record) {
    callback(null);
  }, function (err) {
    callback(err);
  });
};

module.exports = userService;