var CronJob = require('cron').CronJob;

var problemMigrator = require('./migrator/problemMigrator');

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

module.exports = scheduler;
