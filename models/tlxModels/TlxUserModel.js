var TlxUserModel = function () {
  this.id = 0;
  this.jid = "";
  this.username = "";
  this.name = "";
};

TlxUserModel.prototype.setId = function (id) {
  this.id = id;
  return this;
};

TlxUserModel.prototype.setJid = function (jid) {
  this.jid = jid;
  return this;
};

TlxUserModel.prototype.setUsername = function (username) {
  this.username = username;
  return this;
};

TlxUserModel.prototype.setName = function (name) {
  this.name = name;
  return this;
};

TlxUserModel.prototype.getId = function () {
  return this.id;
};

TlxUserModel.prototype.getJid = function () {
  return this.jid;
};

TlxUserModel.prototype.getUsername = function () {
  return this.username;
};

TlxUserModel.prototype.getName = function () {
  return this.name;
};

module.exports = TlxUserModel;