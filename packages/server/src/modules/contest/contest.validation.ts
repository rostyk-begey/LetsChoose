import Joi from '@hapi/joi';

// export const getContestSchema = Joi.object({
//   page: {
//     in: 'query',
//     toInt: true,
//     customSanitizer: {
//       options: (value) => value || 1,
//     },
//   },
//   perPage: {
//     in: 'query',
//     toInt: true,
//     customSanitizer: {
//       options: (value) => value || 10,
//     },
//   },
//   search: {
//     in: 'query',
//     trim: true,
//   },
//   author: {
//     in: 'query',
//     trim: true,
//   },
//   sortBy: {
//     in: 'query',
//     customSanitizer: {
//       options: (value: keyof typeof SORT_OPTIONS): SORT_OPTIONS =>
//         SORT_OPTIONS[value] || SORT_OPTIONS.NEWEST,
//     },
//   },
// });

export const validationSchema = {
  title: Joi.string()
    .exist()
    .message('Title is missing')
    .min(5)
    .message('Title should have at least 5 characters')
    .max(255),
  excerpt: Joi.string().max(255).message('Excerpt is too large'),
  items: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().exist(),
      }),
    )
    .min(2)
    .message('Contest should have at least 2 items'),
};

export const createContestSchema = Joi.object({
  title: validationSchema.title,
  excerpt: validationSchema.excerpt,
  items: validationSchema.items,
});

export const updateContestSchema = Joi.object({
  title: validationSchema.title,
  excerpt: validationSchema.excerpt,
});

export const getContestItemsSchema = Joi.object({
  id: {
    in: 'params',
    customSanitizer: {
      // options: (value) => Mongoose.Types.ObjectId(value),
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
