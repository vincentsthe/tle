var sequelize = require('sequelize');

var sequelizeConnection = require('./sequelizeConnection');

var GradingModel = sequelizeConnection.define('grading', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true
  },
  submissionId: {
    type: sequelize.INTEGER,
    field: 'submission_id'
  },
  userId: {
    type: sequelize.INTEGER,
    field: 'user_id'
  },
  problemId: {
    type: sequelize.INTEGER,
    field: 'problem_id'
  },
  score: {
    type: sequelize.INTEGER
  },
  verdictCode: {
    type: sequelize.STRING,
    field: 'verdict_code'
  },
  verdictName: {
    type: sequelize.STRING,
    field: 'verdict_name'
  },
  evaluated: {
    type: sequelize.BOOLEAN
  }
});

module.exports = GradingModel;