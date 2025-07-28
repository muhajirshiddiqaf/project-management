const Joi = require('@hapi/joi');

// Auth validation schemas
const authSchemas = {
  // Register schema
  registerSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    organizationName: Joi.string().min(2).max(100).required(),
    organizationSlug: Joi.string().min(2).max(50).pattern(/^[a-z0-9-]+$/).required()
  }),

  // Login schema
  loginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // 2FA verification schema
  verify2FASchema: Joi.object({
    userId: Joi.string().uuid().required(),
    token: Joi.string().length(6).pattern(/^[0-9]+$/).required()
  }),

  // Setup 2FA schema (no payload needed, uses auth token)
  setup2FASchema: Joi.object({}),

  // Enable 2FA schema
  enable2FASchema: Joi.object({
    token: Joi.string().length(6).pattern(/^[0-9]+$/).required()
  }),

  // Disable 2FA schema
  disable2FASchema: Joi.object({
    token: Joi.string().length(6).pattern(/^[0-9]+$/).required()
  }),

  // Refresh token schema
  refreshTokenSchema: Joi.object({
    refreshToken: Joi.string().required()
  }),

  // Get profile schema (no payload needed, uses auth token)
  getProfileSchema: Joi.object({}),

  // Update profile schema
  updateProfileSchema: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required()
  }),

  // Change password schema
  changePasswordSchema: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required()
  }),

  // Forgot password schema
  forgotPasswordSchema: Joi.object({
    email: Joi.string().email().required()
  }),

  // Reset password schema
  resetPasswordSchema: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).required()
  }),

  // Logout schema (no payload needed, uses auth token)
  logoutSchema: Joi.object({})
};

module.exports = authSchemas;
