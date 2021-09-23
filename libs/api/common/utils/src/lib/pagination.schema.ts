import Joi, { SchemaMap } from 'joi';

export const paginationSchema: SchemaMap<
  { page: number; perPage: number },
  true
> = {
  page: Joi.number().integer().positive().default(1).messages({
    'number:base': 'Page param should be a string',
    'number:integer': 'Page param should be a integer value',
  }),
  perPage: Joi.number().integer().positive().default(10).messages({
    'number:base': 'Page param should be a string',
    'number:integer': 'Page param should be a integer value',
  }),
};
