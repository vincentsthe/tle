var Problem = function () {
  this.id = 0;
  this.problemJid = "";
  this.slug = "";
  this.createTime = 0;
  this.acceptedUser = 0;
  this.totalSubmission = 0;
  this.acceptedSubmission = 0;
  this.url = "";
};

Problem.prototype.setId = function (id) {
  this.id = id;
  return this;
};

Problem.prototype.setProblemJid = function (problemJid) {
  this.problemJid = problemJid;
  return this;
};

Problem.prototype.setSlug = function (slug) {
  this.slug = slug;
  return this;
};

Problem.prototype.setCreateTime = function (createTime) {
  this.createTime = createTime;
  return this;
};

Problem.prototype.setAcceptedUser = function (acceptedUser) {
  this.acceptedUser = acceptedUser;
  return this;
};

Problem.prototype.setTotalSubmission = function (totalSubmission) {
  this.totalSubmission = totalSubmission;
  return this;
};

Problem.prototype.setAcceptedSubmission = function (acceptedSubmission) {
  this.acceptedSubmission = acceptedSubmission;
  return this;
};

Problem.prototype.setUrl = function (url) {
  this.url = url;
  return this;
};

Problem.prototype.getId = function () {
  return this.id;
};

Problem.prototype.getProblemJid = function () {
  return this.problemJid;
};

Problem.prototype.getSlug = function () {
  return this.slug;
};

Problem.prototype.getCreateTime = function () {
  return this.createTime;
};

Problem.prototype.getAcceptedUser = function () {
  return this.acceptedUser;
};

Problem.prototype.getTotalSubmission = function () {
  return this.totalSubmission;
};

Problem.prototype.getAcceptedSubmission = function () {
  return this.acceptedSubmission;
};

Problem.prototype.getUrl = function () {
  return this.url;
};

module.exports = Problem;