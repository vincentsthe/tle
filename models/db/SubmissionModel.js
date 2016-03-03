var sequelize = require('sequelize');

var sequelizeConnection = require('./sequelizeConnection');

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
  userJid: {
    type: sequelize.STRING,
    field: 'user_jid'
  },
  username: {
    type: sequelize.STRING
  },
  submitTime: {
    type: sequelize.INTEGER,
    field: 'submit_time'
  },
  language: {
    type: sequelize.STRING
  },
  problemJid: {
    type: sequelize.STRING,
    field: 'problem_jid'
  },
  problemSlug: {
    type: sequelize.STRING,
    field: 'problem_slug'
  }
});

module.exports = SubmissionModel;