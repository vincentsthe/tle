var CronJob = require('cron').CronJob;

var scheduler = {};

scheduler.test = new CronJob({
  cronTime: '* * * * * *',
  onTick: function () {
    console.log("tick");
  },
  start: true
});

scheduler.test2 = new CronJob({
  cronTime: '* * * * * *',
  onTick: function () {
    console.log("tock");
  },
  start: true
});

module.exports = scheduler;