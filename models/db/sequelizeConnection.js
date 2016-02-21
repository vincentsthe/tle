var sequelize = require('sequelize');

var dbConfig = require('../../dbConfig.json');

var sequelizeConnection = new sequelize(dbConfig.db.database, dbConfig.db.user, dbConfig.db.password, {
  host: dbConfig.db.host,
  dialect: 'mysql',
  define: {
    timestamps: false,
    freezeTableName: true
  }
});

module.exports = sequelizeConnection;