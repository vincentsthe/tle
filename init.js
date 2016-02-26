var async = require('async');

var userRankService = require('./tleModuleServices/userRankService');
var problemRankService = require('./tleModuleServices/problemRankService');

async.parallel([
  function (callback) {
    userRankService.init(function (err) {
      if (err) {
        console.log("error populating user rank redis: " + err);
      }
      callback(err);
    });
  }, function (callback) {
    problemRankService.init(function (err) {
      if (err) {
        console.log("error populating problem rank redis: " + err);
      }
      callback(err);
    });
  }
], function (err) {
  console.log("done populating cache");
});
