var CronTask = require('./core/CronTask');

var problemMigrator = require('./cron/migrator/problemMigrator');
var userMigrator = require('./cron/migrator/userMigrator');
var submissionMigrator = require('./cron/migrator/submissionMigrator');
var gradingMigrator = require('./cron/migrator/gradingMigrator');

var acceptedSubmissionEvaluator = require('./cron/task/acceptedSubmissionEvaluator');
var acceptedUserProblemEvaluator = require('./cron/task/acceptedUserProblemEvaluator');
var submissionEvaluator = require('./cron/task/submissionEvaluator');
var submissionGrader = require('./cron/task/submissionGrader');
var userNameUpdater = require('./cron/task/userNameUpdater');

var scheduler = {};

scheduler.importProblem = new CronTask({
  cronTime: '* * * * * *',
  task: function (callback) {
    problemMigrator.migrate(100, function (err, problemCount) {
      if (err) {
        console.log("error migrating problem: " + err);
      } else {
        console.log("success migratng " + problemCount + " problems");
      }

      callback();
    });
  },
  start: false
});

scheduler.importUser = new CronTask({
  cronTime: '* * * * * *',
  task: function (callback) {
    userMigrator.migrate(100, function (err, userCount) {
      if (err) {
        console.log("error migrating user: " + err);
      } else if (userCount) {
        console.log("success migrating " + userCount + " users");
      }

      callback();
    });
  },
  start: false
});

scheduler.importSubmission = new CronTask({
  cronTime: '* * * * * *',
  task: function (callback) {
    submissionMigrator.migrate(100, function (err, submissionCount) {
      if (err) {
        console.log("error migrating submission: " + err);
      } else {
        console.log("success migrating " + submissionCount + " submissions");
      }

      callback();
    });
  },
  start: false
});

scheduler.importGrading = new CronTask({
  cronTime: '* * * * * *',
  task: function (callback) {
    gradingMigrator.migrate(100, function (err, gradingCount) {
      if (err) {
        console.log("error migrating grading: " + err);
      } else {
        console.log("success migrating " + gradingCount + " grading");
      }

      callback();
    });
  },
  start: false
});

scheduler.updateUserName = new CronTask({
  cronTime: '0 0 0 * * *',
  task: function (callback) {
    userNameUpdater.updateUserName(function (err) {
      if (err) {
        console.log("error updating user name: " + err);
      } else {
        console.log("done updating user name");
      }

      callback();
    });
  },
  start: false
});

scheduler.gradeSubmission = new CronTask({
  cronTime: '* * * * * *',
  task: function (callback) {
    submissionGrader.consumeGradingData(100, function (err, gradingConsumed) {
      if (err) {
        console.log("error consuming grading data");
      } else {
        console.log("done consuming " + gradingConsumed + " grading data");
      }

      callback();
    });
  },
  start: false
});

scheduler.evaluateSubmissionCount = new CronTask({
  cronTime: '* * * * * *',
  task: function (callback) {
    submissionEvaluator.evaluateSubmission(100, function (err, submissionEvaluated) {
      if (err) {
        console.log("error evaluating submission: " + err);
      } else {
        console.log("done evaluating " + submissionEvaluated + " submission for submission count");
      }

      callback();
    });
  },
  start: false
});

scheduler.evaluateAcceptedSubmissionCount = new CronTask({
  cronTime: '* * * * * *',
  task: function (callback) {
    acceptedSubmissionEvaluator.evaluateAcceptedSubmission(100, function (err, submissionEvaluated) {
      if (err) {
        console.log("error evaluating submission: " + err);
      } else {
        console.log("done evaluating " + submissionEvaluated + " submission for accepted submission count");
      }

      callback();
    });
  },
  start: false
});

scheduler.evaluateAccepterUserProblemCount = new CronTask({
  cronTime: '* * * * * *',
  task: function (callback) {
    acceptedUserProblemEvaluator.evaluateAcceptedUserProblem(100, function (err, count) {
      if (err) {
        console.log("error evaluating submission: " + err);
      } else {
        console.log("done evaluating " + count + " submission for accepted problem count");
      }

      callback();
    });
  },
  start: true
});

module.exports = scheduler;
