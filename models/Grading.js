var Grading = function () {
  this.id = 0;
  this.submissionJid = "";
  this.score = null;
  this.verdictCode = "";
  this.verdictName = "";
  this.evaluated = false;
};

Grading.prototype.setId = function (id) {
  this.id = id;
  return this;
};

Grading.prototype.setSubmissionJid = function (submissionJid) {
  this.submissionJid = submissionJid;
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

Grading.prototype.getId = function () {
  return this.id;
};

Grading.prototype.getSubmissionJid = function () {
  return this.submissionJid;
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

module.exports = Grading;