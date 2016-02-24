var sequelize = require('sequelize');

var sequelizeConnection = require('./sequelizeConnection');

var UserAcceptedSubmissionModel = sequelizeConnection.define('user_accepted_submission', {
  problemJid: {
    type: sequelize.STRING,
    field: 'problem_jid',
    primaryKey: true
  },
  userJid: {
    type: sequelize.STRING,
    field: 'user_jid',
    primaryKey: true
  }
});

module.exports = UserAcceptedSubmissionModel;