var express = require('express');
var router = express.Router();
var url = require('url');

var statisticService = require('../../../tleModuleServices/recentStatisticService');

/**
 * Get new problem added to training
 * 
 * @return  array               array of problem data
 */
router.get('/problem/new', function (req, res, next) {
  statisticService.getNewProblem(function (err, problems) {
    if (err) {
      res.status(500).json({
        status: "internal error"
      });
    } else {
      res.status(200).json(problems);
    }
  });
});

/**
 * Get popular problem (problem with most submission)
 * 
 * @return  array               array of popular problem data with structure:
 * [
 *    problem_id: int
 *    problem_slug: string
 *    problem_url: string
 *    submission_count: int
 *    accepted_submission_count: int
 * ]
 */
router.get('/problem/popular', function (req, res, next) {
  statisticService.getRecentActiveProblem(function (err, problems) {
    if (err) {
      res.status(500).json({
        status: "internal error"
      });
    } else {
      res.status(200).json(problems);
    }
  });
});

/**
 * Get most active user (sorted by most new accepted submission)
 *
 * @return  array               array of active user data with structure:
 * [
 *    user_id: int
 *    username: string
 *    submission_count: int
 *    accepted_submission_count: int
 *    new_accepted_problem_count: int
 * ]
 */
router.get('/user/active', function (req, res, next) {
  statisticService.getRecentMostActiveUser(function (err, users) {
    if (err) {
      res.status(500).json({
        status: "internal error"
      });
    } else {
      res.status(200).json(users);
    }
  });
});

module.exports = router;