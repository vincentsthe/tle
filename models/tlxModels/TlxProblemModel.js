var TlxProblemModel = function () {
  this.id = 0;
  this.jid = "";
  this.slug = "";
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

TlxProblemModel.prototype.getId = function () {
  return this.id;
};

TlxProblemModel.prototype.getJid = function () {
  return this.jid;
};

TlxProblemModel.prototype.getSlug = function () {
  return this.slug;
};

module.exports = TlxProblemModel;