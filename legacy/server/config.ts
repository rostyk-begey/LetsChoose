import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const {
  APP_URL,
  PORT,
  MONGOOSE_DEBUG,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EMAIL_SECRET,
  JWT_PASSWORD_RESET_SECRET,
  MONGO_URI,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  GMAIL_USER,
  GMAIL_PASSWORD,
} = process.env;

interface Config {
  port: number;
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    emailSecret: string;
    passwordResetSecret: string;
  };
  mongoUri: string;
  mongooseDebug: boolean;
  appUrl: string;
  gmail: {
    user: string;
    password: string;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
}

const config: Config = {
  port: (PORT || 5000) as number,
  jwt: {
    accessSecret: JWT_ACCESS_SECRET || 'default_jwt_secret',
    refreshSecret: JWT_REFRESH_SECRET || 'default_jwt_secret',
    emailSecret: JWT_EMAIL_SECRET || 'default_jwt_secret',
    passwordResetSecret: JWT_PASSWORD_RESET_SECRET || 'default_jwt_secret',
  },
  mongoUri: MONGO_URI as string,
  mongooseDebug: (MONGOOSE_DEBUG || false) as boolean,
  appUrl: APP_URL as string,
  gmail: {
    user: GMAIL_USER as string,
    password: GMAIL_PASSWORD as string,
  },
  cloudinary: {
    cloudName: CLOUDINARY_CLOUD_NAME as string,
    apiKey: CLOUDINARY_API_KEY as string,
    apiSecret: CLOUDINARY_API_SECRET as string,
  },
};

export default config;
