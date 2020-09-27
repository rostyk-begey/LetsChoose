const jwt = require('jsonwebtoken');
const config = require('config');
const { AppError } = require('../usecases/error');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers?.authorization?.split(' ')[1];
    const { userId } = jwt.verify(token, config.get('jwt.accessSecret'));
    req.userId = userId;
    next();
  } catch (e) {
    throw new AppError('Unauthorized', 401);
  }
};
