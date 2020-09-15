const {
  PORT,
  MONGOOSE_DEBUG,
  JWT_SECRET,
  MONGO_URI,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

module.exports = {
  port: PORT || 5000,
  jwtSecret: JWT_SECRET || 'default_jwt_secret',
  mongoUri: MONGO_URI,
  mongooseDebug: MONGOOSE_DEBUG || false,
  cloudinary: {
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    apiSecret: CLOUDINARY_API_SECRET,
  },
};
