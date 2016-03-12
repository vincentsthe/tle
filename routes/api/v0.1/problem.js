var express = require('express');
var router = express.Router();
var url = require('url');

var problemRankService = require('../../../tleModuleServices/problemRankService');
var problemService = require('../../../services/problemService');

/**
 * Get program recommendation (next problem to solve)
 *
 * @param   user_id(optional)   the user id of logged person
 * @param   limit               limit of returned data, default to 20, max 100
 * @return  array               array of problem data
 */
router.get('/recommendation', function (req, res, next) {
  var query = url.parse(req.url, true).query;
  var userId = parseInt(query.user_id);
  if (isNaN(userId)) {
    userId = null;
  }
  var limit = parseInt(query.limit);
  if (isNaN(limit)) {
    limit = 20;
  }
  limit = Math.max(limit, 0);
  limit = Math.min(limit, 100);

  problemRankService.getProblemRecommendation(userId, limit, function (err, problems) {
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
 * Get problem data of problem with specified id
 *
 * @param   id        the problem id
 * @return  problem   problem data
 */
router.get('/:id', function (req, res, next) {
  var id = req.params.id;
  problemService.getProblemById(id, function (err, problem) {
    if (err) {
      res.status(500).json({
        status: "internal error"
      });
    } else {
      res.status(200).json(problem);
    }
  })
});

module.exports = router;