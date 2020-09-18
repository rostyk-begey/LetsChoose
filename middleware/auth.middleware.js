const jwt = require('jsonwebtoken');
const config = require('config');
const { AppError } = require('../usecases/error');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  const token = req.headers?.authorization?.split(' ')[1];

  if (!token) throw new AppError('Unauthorized', 401);

  const { userId } = jwt.verify(token, config.get('jwtSecret'));
  req.userId = userId;
  next();
};
