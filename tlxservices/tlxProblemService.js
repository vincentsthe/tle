var _ = require("underscore");

var knexConnection = require('../knexConnection');
var Problem = require('../models/Problem');

var tlxProblemService = {};

tlxProblemService.fetchProblemFromJerahmeelProblemset = function (lastId, limit, callback) {
  knexConnection.jerahmeel
    .select('problem_set_problem.id AS id', 'problem_set_problem.problemJid AS problemJid', 'problem_set.id AS problemsetId')
    .from('jerahmeel_problem_set_problem AS problem_set_problem')
    .join('jerahmeel_problem_set AS problem_set', 'problem_set_problem.problemSetJid', '=', 'problem_set.jid')
    .where('problem_set_problem.id', '>', lastId)
    .limit(limit)
    .then(function (problemRecords) {
      var problems = [];
      var maxId = 0;
      problemRecords.forEach(function (problemRecord) {
        maxId = Math.max(maxId, problemRecord.id);

        var problem = new Problem();
        problem.setProblemJid(problemRecord.problemJid)
          .setUrl("/problemsets/" + problemRecord.problemsetId + "/problems/" + problemRecord.id + "/");

        problems.push(problem);
      });

      callback(null, problems,  maxId);
    }, function (err) {
      callback(err);
    });
};

tlxProblemService.fetchProblemFromJerahmeelCourse = function (lastId, limit, callback) {
  knexConnection.jerahmeel
    .select('session_problem.id AS session_problem_id', 'session_problem.problemJid AS problem_jid', 'session.id AS session_id', 'curriculum_course.id AS curriculum_course_id', 'curriculum.id AS curriculum_id')
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
      var problems = [];
      var maxId = 0;
      problemRecords.forEach(function (problemRecord) {
        maxId = Math.max(maxId, problemRecord.session_problem_id);

        var problem = new Problem();
        problem.setProblemJid(problemRecord.problem_jid)
          .setUrl("/training/curriculums/" + problemRecord.curriculum_id + "/courses/" + problemRecord.curriculum_course_id + "/sessions/" + problemRecord.session_id + "/problems/" + problemRecord.session_problem_id + "/");

        problems.push(problem);
      });

      callback(null, problems,  maxId);
    }, function (err) {
      console.log(err);
    });
};

tlxProblemService.fillProblemSlugFromSandalphon = function (problems, callback) {
  knexConnection.sandalphon
    .select("id", "jid", "slug")
    .from('sandalphon_problem')
    .whereIn('jid', _.map(problems, function (problem) {
      return problem.getProblemJid();
    }))
    .then(function (problemRecords) {
      var problemSlugs = {};
      problemRecords.forEach(function (problemRecord) {
        problemSlugs[problemRecord.jid] = problemRecord.slug;
      });

      problems.forEach(function (problem) {
        problem.setSlug(problemSlugs[problem.getProblemJid()]);
      });

      callback(null, problems)
    }, function (err) {
      callback(err);
    });
};

module.exports = tlxProblemService;