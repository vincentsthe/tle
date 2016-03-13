var sequelize = require('sequelize');

var sequelizeConnection = require('../../core/sequelizeConnection');

var ProblemModel = sequelizeConnection.define('problem', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true
  },
  problemJid: {
    type: sequelize.STRING,
    field: 'problem_jid'
  },
  slug: {
    type: sequelize.STRING
  },
  createTime: {
    type: sequelize.INTEGER,
    field: 'create_time'
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
  },
  url: {
    type: sequelize.STRING
  }
});

module.exports = ProblemModel;