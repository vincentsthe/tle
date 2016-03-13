var sequelize = require('sequelize');

var sequelizeConnection = require('../../core/sequelizeConnection');

var UserAcceptedSubmissionModel = sequelizeConnection.define('user_accepted_submission', {
  problemId: {
    type: sequelize.INTEGER,
    field: 'problem_id',
    primaryKey: true
  },
  userId: {
    type: sequelize.INTEGER,
    field: 'user_id',
    primaryKey: true
  },
  time: {
    type: sequelize.INTEGER
  }
});

module.exports = UserAcceptedSubmissionModel;