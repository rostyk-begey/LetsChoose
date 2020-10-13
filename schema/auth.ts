import { checkSchema } from 'express-validator';
import validator from 'validator';

import { AppError } from '../usecases/error';
import { UserModel } from '../models/User';

export const forgotPasswordSchema = checkSchema({
  email: {
    in: 'body',
    isEmail: {
      errorMessage: 'Invalid email',
    },
    custom: {
      options: async (email) => {
        const user = await UserModel.findOne({ email });

        if (!user) {
          throw new AppError('User not exists!', 404);
        }
        return true;
      },
    },
  },
});

export const loginSchema = checkSchema({
  login: {
    in: 'body',
    exists: true,
    errorMessage: 'Invalid login',
    custom: {
      options: (value) =>
        validator.isEmail(value) || value.match(/^[a-zA-Z._0-9]+$/),
    },
  },
  password: {
    in: 'body',
    errorMessage: 'Invalid password',
    exists: true,
  },
});

export const registerSchema = checkSchema({
  email: {
    in: 'body',
    isEmail: {
      errorMessage: 'Invalid email',
    },
    custom: {
      options: async (email) => {
        const candidate = await UserModel.findOne({ email });

        if (candidate) {
          throw new AppError(`User with email ${email} already exists!`, 400);
        }
        return true;
      },
    },
  },
  username: {
    in: 'body',
    errorMessage: 'Invalid username',
    // @ts-ignore
    isLength: { min: 3 },
    exists: true,
    // @ts-ignore
    matches: /^[a-z._0-9]+$/,
    custom: {
      options: async (username): Promise<boolean> => {
        const candidate = await UserModel.findOne({ username });

        if (candidate) {
          throw new AppError('Username already taken!', 400);
        }
        return true;
      },
    },
  },
  password: {
    in: 'body',
    errorMessage: 'Invalid password',
    // @ts-ignore
    isLength: { min: 6 },
    exists: true,
  },
});

export const resetPasswordSchema = checkSchema({
  token: {
    in: 'params',
    exists: {
      errorMessage: 'Invalid url',
    },
  },
  password: {
    in: 'body',
    errorMessage: 'Invalid password',
    // @ts-ignore
    isLength: { min: 6 },
    exists: true,
  },
});
