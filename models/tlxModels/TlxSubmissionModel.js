var TlxSubmissionModel = function () {
  this.id = 0;
  this.jid = "";
  this.problemJid = "";
  this.userJid = "";
  this.language = "";
  this.timeCreate = "";
};

TlxSubmissionModel.prototype.setId = function (id) {
  this.id = id;
  return this;
};

TlxSubmissionModel.prototype.setJid = function (jid) {
  this.jid = jid;
  return this;
};

TlxSubmissionModel.prototype.setProblemJid = function (problemJid) {
  this.problemJid = problemJid;
  return this;
};

TlxSubmissionModel.prototype.setUserJid = function (userJid) {
  this.userJid = userJid;
  return this;
};

TlxSubmissionModel.prototype.setLanguage = function (language) {
  this.language = language;
  return this;
};

TlxSubmissionModel.prototype.setTimeCreate = function (timeCreate) {
  this.timeCreate = timeCreate;
  return this;
};

TlxSubmissionModel.prototype.getId = function () {
  return this.id;
};

TlxSubmissionModel.prototype.getJid = function () {
  return this.jid;
};

TlxSubmissionModel.prototype.getProblemJid = function () {
  return this.problemJid;
};

TlxSubmissionModel.prototype.getUserJid = function () {
  return this.userJid;
};

TlxSubmissionModel.prototype.getLanguage = function () {
  return this.language;
};

TlxSubmissionModel.prototype.getTimeCreate = function () {
  return this.timeCreate;
};

module.exports = TlxSubmissionModel;