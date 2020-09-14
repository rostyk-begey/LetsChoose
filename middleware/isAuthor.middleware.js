const Contest = require('../models/Contest');

module.exports = async ({ userId, params: { id } }, res, next) => {
  try {
    const { author } = await Contest.findById(id);
    if (author.toString() === userId.toString()) {
      next();
    } else {
      return res
        .status(401)
        .json({ message: 'User has no permission to proceed request' });
    }
  } catch (e) {
    return res.status(404).json({ message: 'Resource not found' });
  }
};
