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
        const user = await User.findOne({ email });

        if (!user) {
          throw new AppError('User not exists!', 404);
        }
        return true;
      },
    },
  },
});
