const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agri-marketplace',
  jwtSecret: process.env.JWT_SECRET || 'agri_marketplace_super_secret_jwt_key_2026_secure',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};