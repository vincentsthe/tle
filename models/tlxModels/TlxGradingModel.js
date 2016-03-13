var TlxGradingModel = function () {
  this.id = 0;
  this.submissionId = 0;
  this.score = 0;
  this.verdictCode = "";
  this.verdictName = "";
  this.userJid = "";
  this.problemJid = "";
  this.submissionTime = 0;
};

TlxGradingModel.prototype.setId = function (id) {
  this.id = id;
  return this;
};

TlxGradingModel.prototype.setSubmissionId = function (submissionId) {
  this.submissionId = submissionId;
  return this;
};

TlxGradingModel.prototype.setScore = function (score) {
  this.score = score;
  return this;
};

TlxGradingModel.prototype.setVerdictCode = function (verdictCode) {
  this.verdictCode = verdictCode;
  return this;
};

TlxGradingModel.prototype.setVerdictName = function (verdictName) {
  this.verdictName = verdictName;
  return this;
};

TlxGradingModel.prototype.setUserJid = function (userJid) {
  this.userJid = userJid;
  return this;
};

TlxGradingModel.prototype.setProblemJid = function (problemJid) {
  this.problemJid = problemJid;
  return this;
};

TlxGradingModel.prototype.setSubmissionTime = function (submissionTime) {
  this.submissionTime = submissionTime;
  return this;
};

TlxGradingModel.prototype.getId = function () {
  return this.id;
};

TlxGradingModel.prototype.getSubmissionId = function () {
  return this.submissionId;
};

TlxGradingModel.prototype.getScore = function () {
  return this.score;
};

TlxGradingModel.prototype.getVerdictCode = function () {
  return this.verdictCode;
};

TlxGradingModel.prototype.getVerdictName = function () {
  return this.verdictName;
};

TlxGradingModel.prototype.getUserJid = function () {
  return this.userJid;
};

TlxGradingModel.prototype.getProblemJid = function () {
  return this.problemJid;
};

TlxGradingModel.prototype.getSubmissionTime = function () {
  return this.submissionTime;
};

module.exports = TlxGradingModel;