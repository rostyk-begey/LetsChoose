const { checkSchema } = require('express-validator');

module.exports = checkSchema({
  token: {
    in: 'params',
    exists: {
      errorMessage: 'Invalid url',
    },
  },
  password: {
    in: 'body',
    errorMessage: 'Invalid password',
    isLength: { min: 6 },
    exists: true,
  },
});
