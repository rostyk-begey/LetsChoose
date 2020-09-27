const { checkSchema } = require('express-validator');

module.exports = checkSchema({
  title: {
    in: 'body',
    isLength: {
      errorMessage: 'Title should have at least 5 characters',
      min: 5,
      max: 255,
    },
  },
  excerpt: {
    in: 'body',
    isLength: {
      errorMessage: 'Excerpt is too large',
      max: 255,
    },
  },
});
