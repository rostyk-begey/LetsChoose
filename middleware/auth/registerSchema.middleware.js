const { checkSchema } = require('express-validator');
const { AppError } = require('../../usecases/error');
const User = require('../../models/User');

module.exports = checkSchema({
  email: {
    in: 'body',
    isEmail: {
      errorMessage: 'Invalid email',
    },
    custom: {
      options: async (email) => {
        const candidate = await User.findOne({ email });

        if (candidate) {
          throw new AppError(`User with email ${email} already exists!`, 400);
        }
        return true;
      },
    },
  },
  username: {
    in: 'body',
    errorMessage: 'Invalid username',
    isLength: { min: 3 },
    matches: /^[a-z._0-9]+$/,
    custom: {
      options: async (username) => {
        const candidate = await User.findOne({ username });

        if (candidate) {
          throw new AppError('Username already taken!', 400);
        }
        return true;
      },
    },
  },
  password: {
    in: 'body',
    errorMessage: 'Invalid password',
    isLength: { min: 6 },
  },
});
