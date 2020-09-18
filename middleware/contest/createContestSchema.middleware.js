const { checkSchema } = require('express-validator');
const _ = require('lodash');

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
  items: {
    in: 'body',
    custom: {
      options: (value) => {
        if (_.isArray(value) && value.length >= 2) return true;
        throw new Error('Contest should have at least 2 items');
      },
    },
  },
});
