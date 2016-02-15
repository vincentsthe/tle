var User = function () {
  this.id = "";
  this.jophielUserJid = "";
  this.userJid = "";
  this.username = "";
  this.name = "";
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

User.prototype.getId = function (id) {
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

module.exports = User;
