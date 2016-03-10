var _ = require('underscore');

var knexConnection = require('../core/knexConnection');
var TlxUserModel = require('../models/tlxModels/TlxUserModel');

var tlxUserService = {};

tlxUserService.fetchUser = function (offset, limit, callback) {
  knexConnection.jophiel
    .select('id AS jophiel_id', 'jid', 'username', 'name')
    .from('jophiel_user')
    .offset(offset)
    .limit(limit)
    .orderBy('id', 'ASC')
    .then(function (userRecords) {
      var tlxUserModels = _.map(userRecords, function (userRecord) {
        var tlxUserModel = new TlxUserModel();
        tlxUserModel.setId(userRecord.id)
          .setJid(userRecord.jid)
          .setUsername(userRecord.username)
          .setName(userRecord.name);

        return tlxUserModel;
      });

      callback(null, tlxUserModels);
    }, function (err) {
      callback(err);
    });
};

tlxUserService.fetchUserFromJophielFromLastId = function (lastId, limit, callback) {
  knexConnection.jophiel
    .select('id', 'jid', 'username', 'name')
    .from('jophiel_user')
    .where('id', '>', lastId)
    .limit(limit)
    .then(function (userRecords) {
      var tlxUserModels = _.map(userRecords, function (userRecord) {
        var tlxUserModel = new TlxUserModel();
        tlxUserModel.setId(userRecord.id)
                    .setJid(userRecord.jid)
                    .setUsername(userRecord.username)
                    .setName(userRecord.name);

        return tlxUserModel;
      });

      callback(null, tlxUserModels);
    }, function (err) {
      callback(err);
    });
};

tlxUserService.getUserJidToUserMap = function (userJids, callback) {
  tlxUserService.getUserByJids(userJids, function (err, userModels) {
    if (err) {
      callback(err);
    } else {
      var userMap = {};
      userModels.forEach(function (user) {
        userMap[user.getJid()] = user;
      });

      callback(null, userMap);
    }
  });
};

tlxUserService.getUserByJids = function (userJids, callback) {
  knexConnection.jophiel
    .select('id', 'jid', 'username', 'name')
    .from('jophiel_user')
    .whereIn('jid', userJids)
    .then(function (userRecords) {
      var tlxUserModels = _.map(userRecords, function (userRecord) {
        var tlxUserModel = new TlxUserModel();
        tlxUserModel.setId(userRecord.id)
          .setJid(userRecord.jid)
          .setUsername(userRecord.username)
          .setName(userRecord.name);

        return tlxUserModel;
      });

      callback(null, tlxUserModels);
    }, function (err) {
      callback(err);
    });
};

module.exports = tlxUserService;