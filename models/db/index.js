var model = {};

var GradingModel = require('./GradingModel');
var LastIdModel = require('./LastIdModel');
var ProblemModel = require('./ProblemModel');
var ProblemStatisticModel = require('./ProblemStatisticModel');
var SubmissionModel = require('./SubmissionModel');
var UserAcceptedSubmissionModel = require('./UserAcceptedSubmissionModel');
var UserModel = require('./UserModel');
var UserStatisticModel = require('./UserStatisticModel');

ProblemModel.hasOne(ProblemStatisticModel, {
  foreignKey: 'problem_id',
  constraints: false,
  as: 'statistic'
});

ProblemStatisticModel.belongsTo(ProblemModel, {
  foreignKey: 'problem_id',
  constraints: false,
  as: 'problem'
});

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

UserModel.hasOne(UserStatisticModel, {
  foreignKey: 'user_id',
  constraints: false,
  as: 'statistic'
});

UserStatisticModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  constraints: false,
  as: 'user'
});

model.GradingModel = GradingModel;
model.LastIdModel = LastIdModel;
model.ProblemModel = ProblemModel;
model.ProblemStatisticModel = ProblemStatisticModel;
model.SubmissionModel = SubmissionModel;
model.UserAcceptedSubmissionModel = UserAcceptedSubmissionModel;
model.UserModel = UserModel;
model.UserStatisticModel = UserStatisticModel;

module.exports = model;