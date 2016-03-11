var sequelize = require('sequelize');

var sequelizeConnection = require('../../core/sequelizeConnection');

var SubmissionModel = sequelizeConnection.define('submission', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true
  },
  submissionJid: {
    type: sequelize.STRING,
    field: 'submission_jid'
  },
  verdictCode: {
    type: sequelize.STRING,
    field: 'verdict_code'
  },
  verdictName: {
    type: sequelize.STRING,
    field: 'verdict_name'
  },
  score: {
    type: sequelize.INTEGER
  },
  userId: {
    type: sequelize.INTEGER,
    field: 'user_id'
  },
  submitTime: {
    type: sequelize.INTEGER,
    field: 'submit_time'
  },
  language: {
    type: sequelize.STRING
  },
  problemId: {
    type: sequelize.INTEGER,
    field: 'problem_id'
  }
});

module.exports = SubmissionModel;