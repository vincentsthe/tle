var sequelize = require('sequelize');

var sequelizeConnection = require('../../core/sequelizeConnection');

var UserStatisticModel = sequelizeConnection.define('user_statistic', {
  userId: {
    type: sequelize.INTEGER,
    field: 'user_id',
    primaryKey: true
  },
  acceptedSubmission: {
    type: sequelize.INTEGER,
    field: 'accepted_submission',
    defaultValue: 0
  },
  totalSubmission: {
    type: sequelize.INTEGER,
    field: 'total_submission',
    defaultValue: 0
  },
  acceptedProblem: {
    type: sequelize.INTEGER,
    field: 'accepted_problem',
    defaultValue: 0
  }
});

module.exports = UserStatisticModel;