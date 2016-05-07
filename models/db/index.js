var model = {};

var GradingModel = require('./GradingModel');
var LastIdModel = require('./LastIdModel');
var ProblemModel = require('./ProblemModel');
var SubmissionModel = require('./SubmissionModel');
var UserAcceptedSubmissionModel = require('./UserAcceptedSubmissionModel');
var UserModel = require('./UserModel');

SubmissionModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  constraints: false,
  as: 'user'
});

SubmissionModel.belongsTo(ProblemModel, {
  foreignKey: 'problem_id',
  constraints: false,
  as: 'problem'
});

UserModel.hasMany(SubmissionModel, {
  foreignKey: 'user_id',
  constraints: false,
  as: 'submissions'
});

model.GradingModel = GradingModel;
model.LastIdModel = LastIdModel;
model.ProblemModel = ProblemModel;
model.SubmissionModel = SubmissionModel;
model.UserAcceptedSubmissionModel = UserAcceptedSubmissionModel;
model.UserModel = UserModel;

module.exports = model;