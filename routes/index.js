var express = require('express');
var router = express.Router();

var userRankService = require('../tleModuleServices/userRankService');

/* GET home page. */
router.get('/', function(req, res, next) {
  userRankService.getUsersByRankRange(1, 50, function (err, users) {
    res.render('index', {
      users: users
    });
  });
});

module.exports = router;
