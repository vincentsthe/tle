var async = require('async');
var express = require('express');
var router = express.Router();

var userRankService = require('../tleModuleServices/userRankService');
var problemRankService = require('../tleModuleServices/problemRankService');

/* GET home page. */
router.get('/', function(req, res, next) {
  var userRanks = [];
  var problemRanks = [];

  async.parallel([
    function (callback) {
      userRankService.getUsersByRankRange(1, 50, function (err, users) {
        userRanks = users;
        callback(err);
      });
    }, function (callback) {
      problemRankService.getProblemsByRankRange(1, 50, function (err, problems) {
        problemRanks = problems;
        callback(err);
      });
    }
  ], function (err) {
    if(err) {
      console.error(err);
    }
    res.render('index', {
      users: userRanks,
      problems: problemRanks
    });
  });
});

module.exports = router;
