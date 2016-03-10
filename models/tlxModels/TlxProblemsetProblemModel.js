var TlxProblemsetProblemModel = function () {
  this.id = 0;
  this.problemJid = "";
  this.problemsetId = 0;
};

TlxProblemsetProblemModel.prototype.setId = function (id) {
  this.id = id;
  return this;
};

TlxProblemsetProblemModel.prototype.setProblemJid = function (problemJid) {
  this.problemJid = problemJid;
  return this;
};

TlxProblemsetProblemModel.prototype.setProblemsetId = function (problemsetId) {
  this.problemsetId = problemsetId;
  return this;
};

TlxProblemsetProblemModel.prototype.getId = function () {
  return this.id;
};

TlxProblemsetProblemModel.prototype.getProblemJid = function () {
  return this.problemJid;
};

TlxProblemsetProblemModel.prototype.getProblemsetId = function () {
  return this.problemsetId;
};

TlxProblemsetProblemModel.prototype.getUrl = function () {
  return "/problemsets/" + this.problemsetId + "/problems/" + this.id + "/";
};

module.exports = TlxProblemsetProblemModel;