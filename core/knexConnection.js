var knex = require('knex');
var dbConfig = require('../config.json').database;

var knexConnection = {};

knexConnection.jophiel = knex({
  client: 'mysql',
  connection: {
    host: dbConfig.jophiel.host,
    user: dbConfig.jophiel.user,
    password: dbConfig.jophiel.password,
    database: dbConfig.jophiel.database
  }
});

knexConnection.jerahmeel = knex({
  client: 'mysql',
  connection: {
    host: dbConfig.jerahmeel.host,
    user: dbConfig.jerahmeel.user,
    password: dbConfig.jerahmeel.password,
    database: dbConfig.jerahmeel.database
  }
});

knexConnection.sandalphon = knex({
  client: 'mysql',
  connection: {
    host: dbConfig.sandalphon.host,
    user: dbConfig.sandalphon.user,
    password: dbConfig.sandalphon.password,
    database: dbConfig.sandalphon.database
  }
});

knexConnection.db = knex({
  client: 'mysql',
  connection: {
    host: dbConfig.db.host,
    user: dbConfig.db.user,
    password: dbConfig.db.password,
    database: dbConfig.db.database
  }
});

module.exports = knexConnection;