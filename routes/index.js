var async = require('async');
var express = require('express');
var router = express.Router();

var userRankService = require('../tleModuleServices/userRankService');
var problemRankService = require('../tleModuleServices/problemRankService');
var recentSubmissionService = require('../tleModuleServices/recentSubmissionService');

/* GET home page. */
router.get('/', function(req, res, next) {
  var userRanks = [];
  var problemRanks = [];
  var recentSubmissions = [];

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
    }, function (callback) {
      recentSubmissionService.getLatestSubmission(10, function (err, submissions) {
        recentSubmissions = submissions;
        callback(err);
      });
    }
  ], function (err) {
    if(err) {
      console.error(err);
    }
    res.render('index', {
      users: userRanks,
      problems: problemRanks,
      submissions: recentSubmissions
    });
  });
});

router.get('/tes/submission', function (req, res, next) {
  recentSubmissionService.getLatestSubmission(10, function (err, submissions) {
    res.json(submissions);
  });
});

router.get('/tes/problem', function (req, res, next) {
  problemRankService.getProblemsByRankRange(1, 50, function (err, problems) {
    res.json(problems);
  });
});

router.get('/tes/user', function (req, res, next) {
  userRankService.getUsersByRankRange(1, 50, function (err, users) {
    res.json(users);
  });
});

module.exports = router;
