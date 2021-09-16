import Joi, { StringSchema } from 'joi';

import { joiObjectIdValidator } from '@usecases/utils';

export const joiObjectIdSchema = (param = 'Url param'): StringSchema =>
  Joi.string()
    .custom(joiObjectIdValidator)
    .messages({
      'objectId.invalid': `${param} is invalid`,
    });
