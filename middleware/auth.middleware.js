const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { userId } = jwt.verify(token, config.get('jwtSecret'));
    req.userId = userId;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
