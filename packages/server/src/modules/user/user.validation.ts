import Joi from 'joi';

export const updateUserProfileSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .regex(/^[a-z._0-9]+$/)
    .messages({
      'string.min': 'Invalid username',
    }),
  email: Joi.string().email().messages({
    'string:email': 'Invalid email',
  }),
});
