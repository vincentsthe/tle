var sequelize = require('sequelize');

var sequelizeConnection = require('./sequelizeConnection');

var LastIdModel = sequelizeConnection.define('last_id', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true
  },
  field: {
    type: sequelize.STRING
  },
  value: {
    type: sequelize.INTEGER
  }
});

module.exports = LastIdModel;