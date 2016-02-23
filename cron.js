var CronJob = require('cron').CronJob;

var problemMigrator = require('./migrator/problemMigrator');
var userMigrator = require('./migrator/userMigrator');
var submissionMigrator = require('./migrator/submissionMigrator');
var gradingMigrator = require('./migrator/gradingMigrator');

var submissionEvaluator = require('./task/submissionEvaluator');
var submissionGrader = require('./task/submissionGrader');
var userNameUpdater = require('./task/userNameUpdater');

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
  start: true
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
  start: false
});

scheduler.updateUserName = new CronJob({
  cronTime: '0 0 0 * * *',
  onTick: function () {
    userNameUpdater.updateUserName(function (err) {
      if (err) {
        console.log("error updating user name: " + err);
      } else {
        console.log("done updating user name");
      }
    });
  },
  start: false
});

scheduler.gradeSubmission = new CronJob({
  cronTime: '* * * * * *',
  onTick: function () {
    submissionGrader.consumeGradingData(100, function (err, gradingConsumed) {
      if (err) {
        console.log("error consuming grading data");
      } else {
        console.log("done consuming " + gradingConsumed + " grading data");
      }
    });
  },
  start: false
});

scheduler.evaluateSubmissionCount = new CronJob({
  cronTime: '* * * * * *',
  onTick: function () {
    submissionEvaluator.evaluateSubmission(100, function (err, submissionEvaluated) {
      if (err) {
        console.log("error evaluating submission");
      } else {
        console.log("done evaluating " + submissionEvaluated + " submission for submission count");
      }
    });
  },
  start: false
});

module.exports = scheduler;
