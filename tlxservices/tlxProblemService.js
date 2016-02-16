var _ = require("underscore");

var dbConnection = require('../dbConnection');
var Problem = require('../models/Problem');

var tlxProblemService = {};

tlxProblemService.fetchProblemFromJerahmeelProblemset = function (lastId, limit, callback) {
  dbConnection.jerahmeel.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      callback("error connecting to jerahmeel: " + err);
    } else {
      var query = "SELECT jerahmeel_problem_set_problem.id id, jerahmeel_problem_set_problem.problemJid problemJid, jerahmeel_problem_set.id problemset_id"
                  + " FROM jerahmeel_problem_set_problem"
                  + " JOIN jerahmeel_problem_set ON jerahmeel_problem_set_problem.problemSetJid = jerahmeel_problem_set.jid"
                  + " LIMIT " + limit;

      connection.query(query, function (err, rows) {
        connection.release();
        if (err) {
          callback("error querying jerahmeel " + err);
        } else {
          var problems = [];

          for (var i = 0; i < rows.length; i++) {
            var problem = new Problem();
            problem.setProblemJid(rows[i]["problemJid"])
                  .setUrl("/problemsets/" + rows[i]["problemset_id"] + "/problems/" + rows[i]["id"] + "/");

            problems.push(problem);
          }

          callback(null, problems);
        }
      });
    }
  });
};

tlxProblemService.fillProblemSlugFromSandalphon = function (problems, callback) {
  dbConnection.sandalphon.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      callback("Error connecting to Sandalphon");
    } else {
      var problemJids = _.map(problems, function (value) {
        return "'" + value.getProblemJid() + "'";
      });

      var query = "SELECT id, jid, slug FROM sandalphon_problem"
                  + " WHERE jid IN (" + problemJids.join(",") + ")";

      connection.query(query, function (err, rows) {
        connection.release();
        if (err) {
          callback("error query sandalphon: " + query)
        } else {
          var problemSlugs = {};
          var maxId = 0;
          for (var i = 0; i < rows.length; i++) {
            problemSlugs[rows[i]["jid"]] = rows[i]["slug"];
            maxId = Math.max(maxId, rows[i]["id"]);
          }

          for (var i = 0; i < problems.length; i++) {
            problems[i].setSlug(problemSlugs[problems[i].getProblemJid()]);
          }

          callback(null, rows, maxId);
        }
      });
    }
  });
};

module.exports = tlxProblemService;