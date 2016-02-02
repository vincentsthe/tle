var CronJob = require('cron').CronJob;

var problemMigrator = require('./migrator/problemMigrator');
var userMigrator = require('./migrator/userMigrator');

var scheduler = {};

scheduler.importProblem = new CronJob({
  cronTime: '* * * * * *',
  onTick: function () {
    problemMigrator.migrate(function (err, problemCount) {
      if (err) {
        console.log(err);
      } else {
        console.log("success migratng " + problemCount + " problems");
      }
    });
  },
  start: true
});

scheduler.importUser = new CronJob({
  cronTime: '* * * * * *',
  onTick: function () {
    userMigrator.migrate(function (err, userCount) {
      if (err) {
        console.log(err);
      } else {
        console.log("success migrating " + userCount + " users");
      }
    });
  },
  start: true
});

module.exports = scheduler;
