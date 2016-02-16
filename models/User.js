var User = function () {
  this.id = "";
  this.jophielUserJid = "";
  this.userJid = "";
  this.username = "";
  this.name = "";
  this.acceptedSubmission = 0;
  this.totalSubmission = 0;
  this.acceptedProblem = 0;
};

User.prototype.setId = function (id) {
  this.id = id;
  return this;
};

User.prototype.setJophielUserJid = function (jophielUserJid) {
  this.jophielUserJid = jophielUserJid;
  return this;
};

User.prototype.setUseJid = function (userJid) {
  this.userJid = userJid;
  return this;
};

User.prototype.setUsername = function (username) {
  this.username = username;
  return this;
};

User.prototype.setName = function (name) {
  this.name = name;
  return this;
};

User.prototype.setAcceptedSubmission = function (acceptedSubmission) {
  this.acceptedSubmission = acceptedSubmission;
  return this;
};

User.prototype.setTotalSubmission = function (totalSubmission) {
  this.totalSubmission = totalSubmission;
  return this;
};

User.prototype.setAcceptedProblem = function (acceptedProblem) {
  this.acceptedProblem = acceptedProblem;
  return this;
};

User.prototype.getId = function () {
  return this.id;
};

User.prototype.getJophielUserJid = function () {
  return this.jophielUserJid;
};

User.prototype.getUserJid = function () {
  return this.userJid;
};

User.prototype.getUsername = function () {
  return this.username;
};

User.prototype.getName = function () {
  return this.name;
};

User.prototype.getAcceptedSubmission = function () {
  return this.acceptedSubmission;
};

User.prototype.getTotalSubmission = function () {
  return this.totalSubmission;
};

User.prototype.getAcceptedProblem = function () {
  return this.acceptedProblem;
};

module.exports = User;
