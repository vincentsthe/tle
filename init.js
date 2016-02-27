var async = require('async');

var userRankService = require('./tleModuleServices/userRankService');
var problemRankService = require('./tleModuleServices/problemRankService');
var recentSubmissionService = require('./tleModuleServices/recentSubmissionService');

async.parallel([
  function (callback) {
    userRankService.init(function (err) {
      if (err) {
        console.error("error populating user rank redis: " + err);
      }
      callback(err);
    });
  }, function (callback) {
    problemRankService.init(function (err) {
      if (err) {
        console.error("error populating problem rank redis: " + err);
      }
      callback(err);
    });
  }, function (callback) {
    recentSubmissionService.init(function (err) {
      if (err) {
        console.error("error populating recent submission redis: " + err);
      }
      callback(err);
    });
  }
], function (err) {
  console.log("done populating cache");
  process.exit();
});
