import { joiObjectIdSchema } from '@lets-choose/api/common/utils';
import Joi from 'joi';
import { searchSchema, paginationSchema } from '@lets-choose/api/common/utils';

export const validationSchema = {
  title: Joi.string().exist().min(5).max(255).messages({
    'string:exists': 'Title is missing',
    'string:min': 'Title should have at least 5 characters',
  }),
  excerpt: Joi.string().max(255).message('Excerpt is too large'),
  items: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().exist(),
      }),
    )
    .min(2)
    .messages({
      'array:min': 'Contest should have at least 2 items',
    }),
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

export const getContestSchema = Joi.object({
  author: Joi.string().empty(''),
  sortBy: Joi.string().valid('POPULAR', 'NEWEST').messages({
    'string:base': 'sortBy param should be a string',
    'string:valid': 'sortBy param should be one of POPULAR | NEWEST',
  }),
})
  .append(paginationSchema)
  .append(searchSchema);

export const getContestItemsSchema = Joi.object()
  .append(paginationSchema)
  .append(searchSchema);

export const gameIdSchema = Joi.object({ gameId: joiObjectIdSchema() });
export const contestIdSchema = Joi.object({ contestId: joiObjectIdSchema() });
