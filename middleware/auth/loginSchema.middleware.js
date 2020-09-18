const { checkSchema } = require('express-validator');
const validator = require('validator');

module.exports = checkSchema({
  login: {
    in: 'body',
    isEmail: {
      errorMessage: 'Invalid email',
    },
    custom: {
      options: (value) =>
        validator.isEmail(value) || value.match(/^[a-zA-Z._0-9]+$/),
      errorMessage: 'Invalid login',
    },
  },
  password: {
    in: 'body',
    errorMessage: 'Invalid password',
    exists: true,
  },
});
