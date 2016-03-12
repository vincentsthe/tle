var express = require('express');
var router = express.Router();
var url = require('url');

var recentSubmissionService = require('../../../tleModuleServices/recentSubmissionService');
var submissionService = require('../../../services/submissionService');

/**
 * Get latest submission
 *
 * @param   user_id(optional)     specify the user_id parameter
 * @param   problem_id(optional)  specify the problem_id parameter
 * @param   limit                 specify number of record returned, default to 10
 * @return  array                 array of submission data
 */
router.get('/', function (req, res, next) {
  var query = url.parse(req.url, true).query;
  var limit = query.limit;
  if (!limit) {
    limit = 10;
  }
  var userId = parseInt(query.user_id);
  if (isNaN(userId)) {
    userId = null;
  }
  var problemId = parseInt(query.problem_id);
  if (isNaN(problemId)) {
    problemId = null;
  }

  limit = parseInt(limit);
  if (isNaN(limit) || (limit < 0)) {
    res.status(400).json({
      status: "invalid limit parameter"
    });
  } else {
    if (!userId && !problemId) {
      recentSubmissionService.getLatestSubmission(limit, function (err, submissions) {
        if (err) {
          res.status(500).json({
            status: "Internal error"
          });
        } else {
          res.status(200).json(submissions);
        }
      });
    } else {
      submissionService.getSubmission(userId, problemId, limit, function (err, submissions) {
        if (err) {
          res.status(500).json({
            status: "Internal error"
          });
        } else {
          res.status(200).json(submissions);
        }
      })
    }
  }
});

module.exports = router;