/* eslint-disable import/namespace */
import * as Joi from 'joi';

export const gamePlaySchema = Joi.object({
  winnerId: Joi.string().required(),
});
