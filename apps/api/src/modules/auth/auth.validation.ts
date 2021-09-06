/* eslint-disable import/namespace */
import Joi from 'joi';

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().message('Invalid email'),
});

export const loginSchema = Joi.object({
  login: Joi.string().exist().messages({
    'string:base': 'Login should be a string',
    'string:exist': 'No login provided',
  }),
  password: Joi.string().exist().messages({
    'string:base': 'Password should be a string',
    'string:exist': 'No password provided',
  }),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().exist().messages({
    'string:email': 'Invalid email',
  }),
  username: Joi.string()
    .exist()
    .min(3)
    .regex(/^[a-z._0-9]+$/)
    .messages({
      'string.min': 'Invalid username',
    }),
  password: Joi.string().exist().min(6).messages({
    'string:min': 'Invalid password',
  }),
});

export const updatePasswordSchema = Joi.object({
  password: Joi.string().exist().messages({
    'string:base': 'Password should be a string',
    'string:exist': 'No password provided',
  }),
  newPassword: Joi.string().exist().min(6).messages({
    'string:min': 'Invalid password',
  }),
});

export const refreshTokenLocation = Joi.string().valid('body', 'cookies');

export const resetPasswordSchema = Joi.object({
  token: Joi.string().exist(),
  password: Joi.string().exist().min(6),
});
