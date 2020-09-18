const Contest = require('../models/Contest');
const { AppError } = require('../usecases/error');

module.exports = async ({ userId, params: { id } }, res, next) => {
  const contest = await Contest.findById(id);
  if (!contest) throw new AppError('Resource not found', 404);
  if (contest.author.toString() === userId.toString()) {
    next();
  } else {
    throw new AppError('User has no permission to proceed request', 401);
  }
};
