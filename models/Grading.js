var Grading = function () {
  this.id = 0;
  this.submissionId = "";
  this.score = null;
  this.verdictCode = "";
  this.verdictName = "";
  this.evaluated = false;
  this.userId = "";
  this.problemId = "";
  this.submissionTime = 0;
};

Grading.prototype.setId = function (id) {
  this.id = id;
  return this;
};

Grading.prototype.setSubmissionId = function (submissionId) {
  this.submissionId = submissionId;
  return this;
};

Grading.prototype.setScore = function (score) {
  this.score = score;
  return this;
};

Grading.prototype.setVerdictCode = function (verdictCode) {
  this.verdictCode = verdictCode;
  return this;
};

Grading.prototype.setVerdictName = function (verdictName) {
  this.verdictName = verdictName;
  return this;
};

Grading.prototype.setEvaluated = function (evaluated) {
  this.evaluated = evaluated;
  return this;
};

Grading.prototype.setUserId = function (userId) {
  this.userId = userId;
  return this;
};

Grading.prototype.setProblemId = function (problemId) {
  this.problemId = problemId;
  return this;
};

Grading.prototype.setSubmissionTime = function (submissionTime) {
  this.submissionTime = submissionTime;
  return this;
};

Grading.prototype.getId = function () {
  return this.id;
};

Grading.prototype.getSubmissionId = function () {
  return this.submissionId;
};

Grading.prototype.getScore = function () {
  return this.score;
};

Grading.prototype.getVerdictCode = function () {
  return this.verdictCode;
};

Grading.prototype.getVerdictName = function () {
  return this.verdictName;
};

Grading.prototype.isEvaluated = function () {
  return this.evaluated;
};

Grading.prototype.getUserId = function () {
  return this.userId;
};

Grading.prototype.getProblemId = function () {
  return this.problemId;
};

Grading.prototype.getSubmissionTime = function () {
  return this.submissionTime;
};

module.exports = Grading;