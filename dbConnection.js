var mysql = require('mysql');
var dbConfig = require('./dbConfig.json');

var dbConn = {};

dbConn.jophiel = mysql.createPool({
  connectionLimit: 100,
  host: dbConfig.jophiel.host,
  user: dbConfig.jophiel.user,
  password: dbConfig.jophiel.password,
  database: dbConfig.jophiel.database
});

dbConn.sandalphon = mysql.createPool({
  connectionLimit: 100,
  host: dbConfig.sandalphon.host,
  user: dbConfig.sandalphon.user,
  password: dbConfig.sandalphon.password,
  database: dbConfig.sandalphon.database
});

dbConn.jerahmeel = mysql.createPool({
  connectionLimit: 100,
  host: dbConfig.jerahmeel.host,
  user: dbConfig.jerahmeel.user,
  password: dbConfig.jerahmeel.password,
  database: dbConfig.jerahmeel.database
});

dbConn.db = mysql.createPool({
  connectionLimit: 100,
  host: dbConfig.db.host,
  user: dbConfig.db.user,
  password: dbConfig.db.password,
  database: dbConfig.db.database
});

module.exports = dbConn;