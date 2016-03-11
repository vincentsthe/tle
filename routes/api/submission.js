var express = require('express');
var router = express.Router();
var url = require('url');

var recentSubmissionService = require('../../tleModuleServices/recentSubmissionService');

router.get('/recent', function (req, res, next) {
  var query = url.parse(req.url, true).query;

  var limit = query.limit;
  if (!limit) {
    limit = 10;
  }

  limit = parseInt(limit);
  if (isNaN(limit) || (limit < 0)) {
    res.status(400).json({
      status: "invalid limit parameter"
    });
  } else {
    recentSubmissionService.getLatestSubmission(limit, function (err, submissions) {
      if (err) {
        res.status(500).json({
          status: "Internal error"
        });
      } else {
        res.status(200).json(submissions);
      }
    });
  }
});

module.exports = router;