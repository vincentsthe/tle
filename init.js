var userRankService = require('./tleModuleServices/userRankService');

userRankService.init(function (err) {
  if (err) {
    console.log("error populating redis: " + err);
  }
});