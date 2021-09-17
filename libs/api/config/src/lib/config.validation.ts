import Joi from 'joi';
import { Config } from './config';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  USE_SSL: Joi.string().valid('true', 'false').default('false'),
  APP_URL: Joi.string().required(),
  ACCESS_TOKEN_KEY: Joi.string().default('accessToken'),
  REFRESH_TOKEN_KEY: Joi.string().default('refreshToken'),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_EMAIL_SECRET: Joi.string().required(),
  JWT_PASSWORD_RESET_SECRET: Joi.string().required(),
  MONGO_URI: Joi.string().required(),
  MONGO_TEST_URI: Joi.string().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  GMAIL_USER: Joi.string().required(),
  GMAIL_PASSWORD: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
});

export const validateConfig = (config: Record<string, string>): Config => {
  const { error, value } = configValidationSchema.validate(config, {
    allowUnknown: true,
    abortEarly: false,
  });

  if (error) {
    throw error;
  }

  return value;
};
