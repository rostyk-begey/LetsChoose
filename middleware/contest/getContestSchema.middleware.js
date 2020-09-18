const { checkSchema } = require('express-validator');

const SORT_OPTIONS = {
  POPULAR: 'views',
  NEWEST: '_id',
};

module.exports = checkSchema({
  page: {
    in: 'query',
    toInt: true,
  },
  perPage: {
    in: 'query',
    toInt: true,
  },
  search: {
    in: 'query',
    trim: true,
  },
  author: {
    in: 'query',
    trim: true,
  },
  sortBy: {
    in: 'query',
    customSanitizer: {
      options: (value) =>
        Object.keys(SORT_OPTIONS).includes(value)
          ? value
          : SORT_OPTIONS.POPULAR,
    },
  },
});
