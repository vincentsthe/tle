var CronJob = require('cron').CronJob;

var problemMigrator = require('./migrator/problemMigrator');
var userMigrator = require('./migrator/userMigrator');
var submissionMigrator = require('./migrator/submissionMigrator');
var gradingMigrator = require('./migrator/gradingMigrator');

var scheduler = {};

scheduler.importProblem = new CronJob({
  cronTime: '* * * * * *',
  onTick: function () {
    problemMigrator.migrate(100, function (err, problemCount) {
      if (err) {
        console.log("error migrating problem: " + err);
      } else {
        console.log("success migratng " + problemCount + " problems");
      }
    });
  },
  start: false
});

scheduler.importUser = new CronJob({
  cronTime: '* * * * * *',
  onTick: function () {
    userMigrator.migrate(100, function (err, userCount) {
      if (err) {
        console.log("error migrating user: " + err);
      } else if (userCount) {
        console.log("success migrating " + userCount + " users");
      }
    });
  },
  start: false
});

scheduler.importSubmission = new CronJob({
  cronTime: '* * * * * *',
  onTick: function () {
    submissionMigrator.migrate(100, function (err, submissionCount) {
      if (err) {
        console.log("error migrating submission: " + err);
      } else {
        console.log("success migrating " + submissionCount + " submissions");
      }
    });
  },
  start: false
});

scheduler.importGrading = new CronJob({
  cronTime: '* * * * * *',
  onTick: function () {
    gradingMigrator.migrate(100, function (err, gradingCount) {
      if (err) {
        console.log("error migrating grading: " + err);
      } else {
        console.log("success migrating " + gradingCount + " grading");
      }
    });
  },
  start: true
});

module.exports = scheduler;
