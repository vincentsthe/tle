var _ = require('underscore');

var UserModel = require('../models/db/UserModel');
var UserAcceptedSubmissionModel = require('../models/db/UserAcceptedSubmissionModel');

var userService = {};

userService.getLastJophielUserId = function (callback) {
  UserModel.max('jophielUserId').then(function (lastId) {
    if (lastId) {
      callback(null, lastId);
    } else {
      callback(null, 0);
    }
  }, function (err) {
    callback(err);
  });
};

userService.insertUser = function (users, callback) {
  if (users.length) {
    var values = _.map(users, function (user) {
      return {
        jophielUserId: user.getJophielUserId(),
        userJid: user.getUserJid(),
        username: user.getUsername(),
        name: user.getName(),
        acceptedSubmission: user.getAcceptedSubmission(),
        totalSubmission: user.getTotalSubmission(),
        acceptedProblem: user.getAcceptedProblem()
      };
    });

    UserModel.bulkCreate(values).then(function () {
      callback(null, users.length);
    }, function (err) {
      callback(err);
    });
  } else {
    callback(null);
  }
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

userService.incrementSubmissionCount = function (userJid, count, callback) {
  UserModel.findOne({
    where: {
      userJid: userJid
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

userService.incrementAcceptedSubmissionCount = function (userJid, count, callback) {
  UserModel.findOne({
    where: {
      userJid: userJid
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

userService.incrementAcceptedProblemCount = function (userJid, count, callback) {
  UserModel.findOne({
    where: {
      userJid: userJid
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

userService.isUserAcceptedInProblem = function (userJid, problemJid, callback) {
  UserAcceptedSubmissionModel.findOne({
    where: {
      userJid: userJid,
      problemJid: problemJid
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

userService.markUserAcceptedInProblem = function (userJid, problemJid, callback) {
  UserAcceptedSubmissionModel.create({
    userJid: userJid,
    problemJid: problemJid
  }).then(function (record) {
    callback(null);
  }, function (err) {
    callback(err);
  });
};

module.exports = userService;