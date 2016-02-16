var Submission = function () {
  this.id = 0;
  this.jerahmeelSubmissionId = "";
  this.submissionJid = "";
  this.verdictCode = null;
  this.verdictName = null;
  this.score = null;
  this.userJid = "";
  this.username = "";
  this.timestamp = null;
  this.language = "";
  this.problemJid = "";
  this.problemSlug = "";
};

Submission.prototype.setId = function (id) {
  this.id = id;
  return this;
};

Submission.prototype.setJerahmeelSubmissionId = function (jerahmeelSubmissionId) {
  this.jerahmeelSubmissionId = jerahmeelSubmissionId;
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

Submission.prototype.setTimestamp = function (timestamp) {
  this.timestamp = timestamp;
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

Submission.prototype.getJerahmeelSubmissionId = function () {
  return this.jerahmeelSubmissionId;
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

Submission.prototype.getTimeStamp = function () {
  return this.timestamp;
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