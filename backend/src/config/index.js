// Configuration management
require('dotenv').config();

const config = {
  // Server configuration
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV || 'development',
  },

  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME || 'project_management',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.DB_SSL === 'true',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS, 10) || 20,
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT, 10) || 30000,
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT, 10) || 2000,
  },

  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || null,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'pm:',
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_here',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_here',
    resetSecret: process.env.JWT_RESET_SECRET || 'your_reset_secret_here',
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '24h',
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    resetTokenExpiry: process.env.JWT_RESET_EXPIRY || '1h',
  },

  // Security configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    corsOrigin: process.env.CORS_ORIGIN || '*',
    corsMethods: process.env.CORS_METHODS || 'GET,POST,PUT,DELETE,PATCH',
    corsHeaders: process.env.CORS_HEADERS || 'Content-Type,Authorization',
  },

  // File upload configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: process.env.ALLOWED_MIME_TYPES ? process.env.ALLOWED_MIME_TYPES.split(',') : [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    uploadDir: process.env.UPLOAD_DIR || 'uploads/',
  },

  // Email configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@projectmanagement.com',
  },

  // AWS S3 configuration
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
    bucketName: process.env.AWS_S3_BUCKET || 'project-management-files',
  },

  // Stripe configuration
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },

  // Application configuration
  app: {
    name: process.env.APP_NAME || 'Project Management System',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    debug: process.env.DEBUG === 'true',
    logLevel: process.env.LOG_LEVEL || 'info',
    timeout: parseInt(process.env.API_TIMEOUT, 10) || 30000, // 30 seconds
    pagination: {
      defaultLimit: parseInt(process.env.DEFAULT_PAGINATION_LIMIT, 10) || 10,
      maxLimit: parseInt(process.env.MAX_PAGINATION_LIMIT, 10) || 100,
    },
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
    file: process.env.LOG_FILE || 'logs/app.log',
    maxSize: process.env.LOG_MAX_SIZE || '10m',
    maxFiles: parseInt(process.env.LOG_MAX_FILES, 10) || 5,
  },
};

module.exports = config;
