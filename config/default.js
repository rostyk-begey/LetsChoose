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

module.exports = {
  port: PORT || 5000,
  jwt: {
    accessSecret: JWT_ACCESS_SECRET || 'default_jwt_secret',
    refreshSecret: JWT_REFRESH_SECRET || 'default_jwt_secret',
    emailSecret: JWT_EMAIL_SECRET || 'default_jwt_secret',
    passwordResetSecret: JWT_PASSWORD_RESET_SECRET || 'default_jwt_secret',
  },
  mongoUri: MONGO_URI,
  mongooseDebug: MONGOOSE_DEBUG || false,
  appUrl: APP_URL,
  gmail: {
    user: GMAIL_USER,
    password: GMAIL_PASSWORD,
  },
  cloudinary: {
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    apiSecret: CLOUDINARY_API_SECRET,
  },
};
