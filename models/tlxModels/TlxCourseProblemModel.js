var TlxCourseProblemModel = function () {
  this.id = 0;
  this.problemJid = "";
  this.sessionId = 0;
  this.curriculumCourseId = 0;
  this.curriculumId = 0;
};

TlxCourseProblemModel.prototype.setId = function (id) {
  this.id = id;
  return this;
};

TlxCourseProblemModel.prototype.setProblemJid = function (problemJid) {
  this.problemJid = problemJid;
  return this;
};

TlxCourseProblemModel.prototype.setSessionId = function (sessionId) {
  this.sessionId = sessionId;
  return this;
};

TlxCourseProblemModel.prototype.setCurriculumCourseId = function (curriculumCourseId) {
  this.curriculumCourseId = curriculumCourseId;
  return this;
};

TlxCourseProblemModel.prototype.setCurriculumId = function (curriculumId) {
  this.curriculumId = curriculumId;
  return this;
};

TlxCourseProblemModel.prototype.getId = function () {
  return this.id;
};

TlxCourseProblemModel.prototype.getProblemJid = function () {
  return this.problemJid;
};

TlxCourseProblemModel.prototype.getSessionId = function () {
  return this.sessionId;
};

TlxCourseProblemModel.prototype.getCurriculumCourseId = function () {
  return this.curriculumCourseId;
};

TlxCourseProblemModel.prototype.getCurriculumId = function () {
  return this.curriculumId;
};

TlxCourseProblemModel.prototype.getUrl = function () {
  return "/training/curriculums/" + this.curriculumId + "/courses/" + this.curriculumCourseId + "/sessions/" + this.sessionId + "/problems/" + this.id + "/";
};

module.exports = TlxCourseProblemModel;