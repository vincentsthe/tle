var CronJob = require('cron').CronJob;

var CronTask = function (config) {
  var that = this;

  this.cronTime = '* * * * * *';
  this.start = false;
  this.task = function (callback) {
    callback();
  };
  this.mutex = false;

  if (config.hasOwnProperty("cronTime")) {
    this.cronTime = config["cronTime"];
  }

  if (config.hasOwnProperty("start")) {
    this.start = config["start"];
  }

  if (config.hasOwnProperty("task")) {
    this.task = config["task"];
  }

  var scheduler = new CronJob({
    cronTime: that.cronTime,
    onTick: function () {
      if (!that.mutex) {
        that.mutex = true;

        that.task(function () {
          that.mutex = false;
        });
      }
    },
    start: that.start
  });
};

module.exports = CronTask;