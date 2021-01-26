import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '..', '..', '..', '.env') });

const {
  APP_URL,
  PORT,
  MONGOOSE_DEBUG,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
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
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = process.env;

export interface JwtConfig {
  accessTokenKey: string;
  refreshTokenKey: string;
  accessSecret: string;
  refreshSecret: string;
  emailSecret: string;
  passwordResetSecret: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export interface GmailConfig {
  user: string;
  password: string;
}

export interface GoogleOAuth {
  clientId: string;
  clientSecret: string;
}

export interface Config {
  port: number;
  jwt: JwtConfig;
  mongoUri: string;
  mongooseDebug: boolean;
  appUrl: string;
  gmail: GmailConfig;
  cloudinary: CloudinaryConfig;
  googleOAuth: GoogleOAuth;
}

const config: Config = {
  port: (PORT || 5000) as number,
  jwt: {
    accessTokenKey: ACCESS_TOKEN_KEY || 'accessToken',
    refreshTokenKey: REFRESH_TOKEN_KEY || 'refreshToken',
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
  googleOAuth: {
    clientId: GOOGLE_CLIENT_ID as string,
    clientSecret: GOOGLE_CLIENT_SECRET as string,
  },
  cloudinary: {
    cloudName: CLOUDINARY_CLOUD_NAME as string,
    apiKey: CLOUDINARY_API_KEY as string,
    apiSecret: CLOUDINARY_API_SECRET as string,
  },
};

export default () => config;
