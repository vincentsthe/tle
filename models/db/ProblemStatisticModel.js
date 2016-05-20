var sequelize = require('sequelize');

var sequelizeConnection = require('../../core/sequelizeConnection');

var ProblemStatisticModel = sequelizeConnection.define('problem_statistic', {
  problemId: {
    type: sequelize.INTEGER,
    field: 'problem_id',
    primaryKey: true
  },
  acceptedUser: {
    type: sequelize.INTEGER,
    field: 'accepted_user'
  },
  totalSubmission: {
    type: sequelize.INTEGER,
    field: 'total_submission'
  },
  acceptedSubmission: {
    type: sequelize.INTEGER,
    field: 'accepted_submission'
  }
});

module.exports = ProblemStatisticModel;