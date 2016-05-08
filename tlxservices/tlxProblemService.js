var _ = require("underscore");

var knexConnection = require('../core/knexConnection');
var TlxCourseProblemModel = require('../models/tlxModels/TlxCourseProblemModel');
var TlxProblemModel = require('../models/tlxModels/TlxProblemModel');
var TlxProblemsetProblemModel = require('../models/tlxModels/TlxProblemsetProblemModel');

var tlxProblemService = {};

tlxProblemService.fetchProblemFromJerahmeelProblemset = function (lastId, limit, callback) {
  knexConnection.jerahmeel
    .select('problem_set_problem.id AS id', 'problem_set_problem.problemJid AS problemJid'
      , 'problem_set_problem.timeCreate AS create_time', 'problem_set.id AS problemsetId')
    .from('jerahmeel_problem_set_problem AS problem_set_problem')
    .join('jerahmeel_problem_set AS problem_set', 'problem_set_problem.problemSetJid', '=', 'problem_set.jid')
    .where('problem_set_problem.id', '>', lastId)
    .limit(limit)
    .then(function (problemRecords) {
      var tlxProblemsetProblemModels = _.map(problemRecords, function (problemRecord) {
        var tlxProblemsetProblemModel = new TlxProblemsetProblemModel();
        tlxProblemsetProblemModel.setId(problemRecord.id)
                                .setProblemJid(problemRecord.problemJid)
                                .setCreateTime(Math.round(problemRecord.create_time / 1000))
                                .setProblemsetId(problemRecord.problemsetId);

        return tlxProblemsetProblemModel;
      });

      callback(null, tlxProblemsetProblemModels);
    }, function (err) {
      callback(err);
    });
};

tlxProblemService.fetchProblemFromJerahmeelCourse = function (lastId, limit, callback) {
  knexConnection.jerahmeel
    .select('session_problem.id AS session_problem_id', 'session_problem.problemJid AS problem_jid', 'session_problem.timeCreate AS create_time'
      , 'session.id AS session_id', 'curriculum_course.id AS curriculum_course_id', 'curriculum.id AS curriculum_id')
    .from('jerahmeel_session_problem AS session_problem')
    .join('jerahmeel_session AS session', 'session_problem.sessionJid', '=', 'session.jid')
    .join('jerahmeel_course_session AS course_session', 'session.jid', '=', 'course_session.sessionJid')
    .join('jerahmeel_course AS course', 'course.jid', '=', 'course_session.courseJid')
    .join('jerahmeel_curriculum_course AS curriculum_course', 'curriculum_course.courseJid', '=', 'course.jid')
    .join('jerahmeel_curriculum AS curriculum', 'curriculum_course.curriculumJid', '=', 'curriculum.jid')
    .where('session_problem.type', 'PROGRAMMING')
    .andWhere('session_problem.id', '>', lastId)
    .limit(limit)
    .then(function (problemRecords) {
      var tlxCourseProblemModels = _.map(problemRecords, function (problemRecord) {
        var tlxCourseProblemModel = new TlxCourseProblemModel();
        tlxCourseProblemModel.setId(problemRecord.session_problem_id)
                            .setProblemJid(problemRecord.problem_jid)
                            .setCreateTime(Math.round(problemRecord.create_time / 1000))
                            .setSessionId(problemRecord.session_id)
                            .setCurriculumCourseId(problemRecord.curriculum_course_id)
                            .setCurriculumId(problemRecord.curriculum_id);

        return tlxCourseProblemModel;
      });

      callback(null, tlxCourseProblemModels);
    }, function (err) {
      console.log(err);
    });
};

tlxProblemService.getProblemJidToProblemMap = function (problemJids, callback) {
  knexConnection.sandalphon
    .select("id", "jid", "slug")
    .from("sandalphon_problem")
    .whereIn("jid", problemJids)
    .then(function (problems) {
      var problemMap = {};
      problems.forEach(function (problem) {
        var tlxProblemModel = new TlxProblemModel();
        tlxProblemModel.setId(problem.id)
                      .setJid(problem.jid)
                      .setSlug(problem.slug);

        problemMap[problem.jid] = tlxProblemModel;
      });

      callback(null, problemMap);
    }, function (err) {
      callback(err);
    });
};

tlxProblemService.getProblemByJid = function (problemJid, callback) {
  knexConnection.sandalphon
    .from("sandalphon_problem")
    .where("jid", problemJid)
    .then(function (problems) {
      if (problems.length == 0) {
        callback(null, null);
      } else {
        var problem = problems[0];
        var tlxProblemModel = new TlxProblemModel();
        tlxProblemModel.setId(problem.id)
                      .setJid(problem.jid)
                      .setSlug(problem.slug);

        callback(null, tlxProblemModel);
      }
    }, function (err) {
      callback(err);
    });
};

module.exports = tlxProblemService;