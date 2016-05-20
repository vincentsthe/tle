var sequelize = require('sequelize');

var sequelizeConnection = require('../../core/sequelizeConnection');

var UserModel = sequelizeConnection.define('user', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true
  },
  userJid: {
    type: sequelize.STRING,
    field: 'user_jid'
  },
  username: {
    type: sequelize.STRING
  },
  name: {
    type: sequelize.STRING
  }
});

module.exports = UserModel;