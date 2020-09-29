const { checkSchema } = require('express-validator');
const Mongoose = require('mongoose');

module.exports = checkSchema({
  id: {
    in: 'params',
    customSanitizer: {
      options: (value) => Mongoose.Types.ObjectId(value),
    },
  },
  page: {
    in: 'query',
    toInt: true,
    customSanitizer: {
      options: (value) => value || 1,
    },
  },
  perPage: {
    in: 'query',
    toInt: true,
    customSanitizer: {
      options: (value) => value || 10,
    },
  },
  search: {
    in: 'query',
    trim: true,
  },
});
