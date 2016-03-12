var express = require('express');
var router = express.Router();
var url = require('url');

var userRankService = require('../../../tleModuleServices/userRankService');
var userService = require('../../../services/userService');

/**
 * Get user record by username
 *
 * @param   username  username to be searched
 * @return  user      user data
 */
router.get('/search/username/:username', function (req, res, next) {
  var username = req.params.username;
  userService.getUserByUsername(username, function (err, user) {
    if (err) {
      res.status(500).json({
        status: "internal error"
      });
    } else if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        status: "username not found"
      });
    }
  });
});

/**
 * Get the rank of the user with specified id
 *
 * @param   id      the id of user which rank to be searched
 * @return  object  object with rank key and integer value, the rank of the given user
 */
router.get('/rank/user/:id', function (req, res, next) {
  var userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    res.status(400).json({
      status: "id must be an integer"
    });
  } else {
    userRankService.getRank(userId, function (err, rank) {
      if (err) {
        res.status(500).json({
          status: "internal error"
        });
      } else {
        res.status(200).json({
          rank: rank
        });
      }
    });
  }
});

/**
 * Get array of user from the specified rank range
 *
 * @param   start   the starting rank
 * @param   limit   user count to be returned, max 50
 * @return  array   array of user data, sorted by rank
 */
router.get('/rank', function (req, res, next) {
  var query = url.parse(req.url, true).query;

  var start = query.start || 1;
  var limit = query.limit || 10;
  start = parseInt(start);
  limit = Math.min(parseInt(limit), 50);

  if (isNaN(start) || isNaN(limit) || (start < 1) || (limit < 0)) {
    res.status(400).json({
      status: "invalid parameter"
    });
  } else {
    userRankService.getUsersByRankRange(start, limit, function (err, users) {
      if (err) {
        res.status(500).json({
          status: "internal error"
        });
      } else {
        res.status(200).json(users);
      }
    });
  }
});

module.exports = router;