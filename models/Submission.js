var Submission = function () {
  this.id = 0;
  this.submissionJid = "";
  this.verdictCode = null;
  this.verdictName = null;
  this.score = null;
  this.userJid = "";
  this.username = "";
  this.submitTime = null;
  this.language = "";
  this.problemJid = "";
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

Submission.prototype.setUserJid = function (userJid) {
  this.userJid = userJid;
  return this;
};

Submission.prototype.setUsername = function (username) {
  this.username = username;
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

Submission.prototype.setProblemJid = function (problemJid) {
  this.problemJid = problemJid;
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

Submission.prototype.getUserJid = function () {
  return this.userJid;
};

Submission.prototype.getUsername = function () {
  return this.username;
};

Submission.prototype.getSubmitTime = function () {
  return this.submitTime;
};

Submission.prototype.getLanguage = function () {
  return this.language;
};

Submission.prototype.getProblemJid = function () {
  return this.problemJid;
};

Submission.prototype.getProblemSlug = function () {
  return this.problemSlug;
};

module.exports = Submission;