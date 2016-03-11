var Submission = function () {
  this.id = 0;
  this.submissionJid = "";
  this.verdictCode = null;
  this.verdictName = null;
  this.score = null;
  this.userId = "";
  this.username = "";
  this.name = "";
  this.submitTime = null;
  this.language = "";
  this.problemId = "";
  this.problemSlug = "";
};

Submission.prototype.setId = function (id) {
  this.id = id;
  return this;
};

Submission.prototype.setSubmissionJid = function (submissionJid) {
  this.submissionJid = submissionJid;
  return this;
};

Submission.prototype.setVerdictCode = function (verdictCode) {
  this.verdictCode = verdictCode;
  return this;
};

Submission.prototype.setVerdictName = function (verdictName) {
  this.verdictName = verdictName;
  return this;
};

Submission.prototype.setScore = function (score) {
  this.score = score;
  return this;
};

Submission.prototype.setUserId = function (userId) {
  this.userId = userId;
  return this;
};

Submission.prototype.setUsername = function (username) {
  this.username = username;
  return this;
};

Submission.prototype.setName = function (name) {
  this.name = name;
  return this;
};

Submission.prototype.setSubmitTime = function (submitTime) {
  this.submitTime = submitTime;
  return this;
};

Submission.prototype.setLanguage = function (language) {
  this.language = language;
  return this;
};

Submission.prototype.setProblemId = function (problemId) {
  this.problemId = problemId;
  return this;
};

Submission.prototype.setProblemSlug = function (problemSlug) {
  this.problemSlug = problemSlug;
  return this;
};

Submission.prototype.getId = function () {
  return this.id;
};

Submission.prototype.getSubmissionJid = function () {
  return this.submissionJid;
};

Submission.prototype.getVerdictCode = function () {
  return this.verdictCode;
};

Submission.prototype.getVerdictName = function () {
  return this.verdictName;
};

Submission.prototype.getScore = function () {
  return this.score;
};

Submission.prototype.getUserId = function () {
  return this.userId;
};

Submission.prototype.getUsername = function () {
  return this.username;
};

Submission.prototype.getName = function () {
  return this.name;
};

Submission.prototype.getSubmitTime = function () {
  return this.submitTime;
};

Submission.prototype.getLanguage = function () {
  return this.language;
};

Submission.prototype.getProblemId = function () {
  return this.problemId;
};

Submission.prototype.getProblemSlug = function () {
  return this.problemSlug;
};

module.exports = Submission;