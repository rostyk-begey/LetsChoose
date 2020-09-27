const { checkSchema } = require('express-validator');
const validator = require('validator');

module.exports = checkSchema({
  login: {
    in: 'body',
    exists: true,
    errorMessage: 'Invalid login',
    custom: {
      options: (value) =>
        validator.isEmail(value) || value.match(/^[a-zA-Z._0-9]+$/),
    },
  },
  password: {
    in: 'body',
    errorMessage: 'Invalid password',
    exists: true,
  },
});
