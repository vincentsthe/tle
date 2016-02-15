var Submission = function () {
  this.id = 0;
  this.jerahmeelSubmissionId = "";
  this.submissionJid = "";
  this.verdictCode = "";
  this.verdictName = "";
  this.score = null;
  this.userJid = "";
  this.username = "";
  this.timestamp = 0;
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

Submission.setUsername = function (username) {
  this.username = username;
  return this;
};

Submission.setTimestamp = function (timestamp) {
  this.timestamp = timestamp;
  return this;
};

Submission.setLanguage = function (language) {
  this.language = language;
  return this;
};

Submission.setProblemJid = function (problemJid) {
  this.problemJid = problemJid;
  return this;
};

Submission.setProblemSlug = function (problemSlug) {
  this.problemSlug = problemSlug;
  return this;
};

Submission.getId = function () {
  return this.id;
};

Submission.getJerahmeelSubmissionJid = function () {
  return this.jerahmeelSubmissionId;
};

Submission.getVerdictCode = function () {
  return this.verdictCode;
};

Submission.getVerdictName = function () {
  return this.verdictName;
};

Submission.getScore = function () {
  return this.score;
};

Submission.getUserJid = function () {
  return this.userJid;
};

Submission.getUsername = function () {
  return this.username;
};

Submission.getTimeStamp = function () {
  return this.timestamp;
};

Submission.getProblemJid = function () {
  return this.problemJid;
};

Submission.getProblemSlug = function () {
  return this.problemSlug;
};

module.exports = Submission;