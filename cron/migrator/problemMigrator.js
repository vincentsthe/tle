var _ = require('underscore');
var async = require('async');

var lastIdService = require('../../services/lastIdService');
var problemRankService = require('../../tleModuleServices/problemRankService');
var problemService = require('../../services/problemService');
var tlxProblemService = require('../../tlxservices/tlxProblemService');

var problemMigrator = {};

var saveProblem = function (problemJid, problemUrl, createTime, callback) {
  async.waterfall([
    function (callback) {
      tlxProblemService.getProblemByJid(problemJid, function (err, tlxProblemModel) {
        if (err) {
          callback(err);
        } else if (!tlxProblemModel) {
          callback("problem not found");
        } else {
          callback(null, tlxProblemModel);
        }
      });
    }, function (tlxProblemModel, callback) {
      problemService.insertProblem(tlxProblemModel.getId(), problemJid, tlxProblemModel.getSlug(), createTime, problemUrl, function (err) {
        if (err) {
          console.error(err);
          callback(err);
        } else {
          problemRankService.insertProblemRecord(tlxProblemModel.getId(), 0, function (err) {
            callback(null);
          });
        }
      });
    }
  ], function (err) {
    callback(null);
  });
};

var migrateProblemset = function (limit, callback) {
  async.waterfall([
    function (callback) {
      lastIdService.getKeyLastId(lastIdService.PROBLEMSET_PROBLEM_LAST_ID_KEY, function (err, lastId) {
        callback(err, lastId);
      });
    }, function (lastId, callback) {
      tlxProblemService.fetchProblemFromJerahmeelProblemset(lastId, limit, function (err, tlxProblemsetProblemModels) {
        callback(err, tlxProblemsetProblemModels);
      });
    }, function (tlxProblemsetProblemModels, callback) {
      async.each(tlxProblemsetProblemModels, function (tlxProblemsetProblemModel, callback) {
        saveProblem(tlxProblemsetProblemModel.getProblemJid(), tlxProblemsetProblemModel.getUrl(),
          tlxProblemsetProblemModel.getCreateTime(), function (err) {
          callback(err);
        });
      }, function (err) {
        callback(err, tlxProblemsetProblemModels);
      });
    }, function (tlxProblemsetProblemModels, callback) {
      if (tlxProblemsetProblemModels.length) {
        var maxId = _.max(tlxProblemsetProblemModels, function (tlxProblemsetProblemModel) {
          return tlxProblemsetProblemModel.getId();
        }).getId();

        lastIdService.updateLastId(lastIdService.PROBLEMSET_PROBLEM_LAST_ID_KEY, maxId, function (err) {
          callback(err, tlxProblemsetProblemModels.length);
        });
      } else {
        callback(null, 0);
      }
    }
  ], function (err, problemCount) {
    callback(err, problemCount);
  });
};

var migrateCourseProblem = function (limit, callback) {
  async.waterfall([
    function (callback) {
      lastIdService.getKeyLastId(lastIdService.COURSE_PROBLEM_LAST_ID_KEY, function (err, lastId) {
        callback(err, lastId);
      });
    }, function (lastId, callback) {
      tlxProblemService.fetchProblemFromJerahmeelCourse(lastId, limit, function (err, tlxCourseProblemModels) {
        callback(err, tlxCourseProblemModels);
      })
    }, function (tlxCourseProblemModels, callback) {
      async.each(tlxCourseProblemModels, function (tlxCourseProblemModel, callback) {
        saveProblem(tlxCourseProblemModel.getProblemJid(), tlxCourseProblemModel.getUrl(), tlxCourseProblemModel.getCreateTime(), function (err) {
          callback(err);
        });
      }, function (err) {
        callback(err, tlxCourseProblemModels);
      });
    }, function (tlxCourseProblemModels, callback) {
      if (tlxCourseProblemModels.length) {
        var maxId = _.max(tlxCourseProblemModels, function (tlxCourseProblemModel) {
          return tlxCourseProblemModel.getId();
        }).getId();

        lastIdService.updateLastId(lastIdService.COURSE_PROBLEM_LAST_ID_KEY, maxId, function (err) {
          callback(err, tlxCourseProblemModels.length);
        });
      } else {
        callback(null, 0);
      }
    }
  ], function (err, problemCount) {
    callback(err, problemCount)
  });
};

problemMigrator.migrate = function (limit, callback) {
  var totalCount = 0;

  async.series([
    function (callback) {
      migrateProblemset(limit, function (err, count) {
        totalCount += count;
        callback(err);
      });
    }, function (callback) {
      migrateCourseProblem(limit, function (err, count) {
        totalCount += count;
        callback(err);
      })
    }
  ], function (err) {
    callback(err, totalCount);
  });
};

module.exports = problemMigrator;
