var TlxProblemModel = function () {
  this.id = 0;
  this.jid = "";
  this.slug = "";
  this.createTime = "";
};

TlxProblemModel.prototype.setId = function (id) {
  this.id = id;
  return this;
};

TlxProblemModel.prototype.setJid = function (jid) {
  this.jid = jid;
  return this;
};

TlxProblemModel.prototype.setSlug = function (slug) {
  this.slug = slug;
  return this;
};

TlxProblemModel.prototype.setCreateTime = function (createTime) {
  this.createTime = createTime;
  return this;
};

TlxProblemModel.prototype.getId = function () {
  return this.id;
};

TlxProblemModel.prototype.getJid = function () {
  return this.jid;
};

TlxProblemModel.prototype.getSlug = function () {
  return this.slug;
};

TlxProblemModel.prototype.getCreateTime = function () {
  return this.createTime;
};

module.exports = TlxProblemModel;