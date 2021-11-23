import Joi, { SchemaMap } from 'joi';

export const searchSchema: SchemaMap<{ search: string }, true> = {
  search: Joi.string().empty('').messages({
    'string:base': 'Search param should be a string',
  }),
};
