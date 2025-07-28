const Joi = require('@hapi/joi');
const authHandler = require('./handler');
const authValidator = require('./validator');

const routes = [
  /**
   * @route   POST /api/auth/register
   * @desc    Register new user
   * @access  Public
   */
  {
    method: 'POST',
    path: '/register',
    handler: authHandler.register,
    options: {
      auth: false,
      validate: {
        payload: authValidator.registerSchema,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation failed',
            errors: err.details.map(detail => ({
              field: detail.path.join('.'),
              message: detail.message
            })),
            code: 'VALIDATION_ERROR'
          }).code(400).takeover();
        }
      },
      description: 'Register new user',
      tags: ['api', 'auth'],
      notes: 'Register a new user with optional organization creation',
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          message: Joi.string().required(),
          data: Joi.object({
            user: Joi.object({
              id: Joi.string().required(),
              email: Joi.string().email().required(),
              firstName: Joi.string().required(),
              lastName: Joi.string().required(),
              role: Joi.string().required(),
              organizationId: Joi.string().required()
            }).required(),
            tokens: Joi.object({
              accessToken: Joi.string().required(),
              refreshToken: Joi.string().required(),
              expiresIn: Joi.string().required()
            }).required()
          }).required()
        }).required()
      }
    }
  },

  /**
   * @route   POST /api/auth/login
   * @desc    Login user
   * @access  Public
   */
  {
    method: 'POST',
    path: '/login',
    handler: authHandler.login,
    options: {
      auth: false,
      validate: {
        payload: authValidator.loginSchema,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation failed',
            errors: err.details.map(detail => ({
              field: detail.path.join('.'),
              message: detail.message
            })),
            code: 'VALIDATION_ERROR'
          }).code(400).takeover();
        }
      },
      description: 'Login user',
      tags: ['api', 'auth'],
      notes: 'Authenticate user and return access token',
      response: {
        schema: Joi.object({
          success: Joi.boolean().required(),
          message: Joi.string().required(),
          data: Joi.object({
            user: Joi.object({
              id: Joi.string().required(),
              email: Joi.string().email().required(),
              firstName: Joi.string().required(),
              lastName: Joi.string().required(),
              role: Joi.string().required(),
              organizationId: Joi.string().required(),
              organizationName: Joi.string().required(),
              organizationSlug: Joi.string().required()
            }).required(),
            tokens: Joi.object({
              accessToken: Joi.string().required(),
              refreshToken: Joi.string().required(),
              expiresIn: Joi.string().required()
            }).required()
          }).required()
        }).required()
      }
    }
  },

  /**
   * @route   POST /api/auth/refresh
   * @desc    Refresh access token
   * @access  Public
   */
  {
    method: 'POST',
    path: '/refresh',
    handler: authHandler.refreshToken,
    options: {
      auth: false,
      validate: {
        payload: authValidator.refreshTokenSchema,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation failed',
            errors: err.details.map(detail => ({
              field: detail.path.join('.'),
              message: detail.message
            })),
            code: 'VALIDATION_ERROR'
          }).code(400).takeover();
        }
      },
      description: 'Refresh access token',
      tags: ['api', 'auth'],
      notes: 'Refresh access token using refresh token'
    }
  },

  /**
   * @route   POST /api/auth/logout
   * @desc    Logout user
   * @access  Private
   */
  {
    method: 'POST',
    path: '/logout',
    handler: authHandler.logout,
    options: {
      auth: 'jwt',
      description: 'Logout user',
      tags: ['api', 'auth'],
      notes: 'Logout current user'
    }
  },

  /**
   * @route   GET /api/auth/profile
   * @desc    Get current user profile
   * @access  Private
   */
  {
    method: 'GET',
    path: '/profile',
    handler: authHandler.getProfile,
    options: {
      auth: 'jwt',
      description: 'Get current user profile',
      tags: ['api', 'auth'],
      notes: 'Get profile of authenticated user'
    }
  },

  /**
   * @route   PUT /api/auth/profile
   * @desc    Update current user profile
   * @access  Private
   */
  {
    method: 'PUT',
    path: '/profile',
    handler: authHandler.updateProfile,
    options: {
      auth: 'jwt',
      validate: {
        payload: authValidator.updateProfileSchema,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation failed',
            errors: err.details.map(detail => ({
              field: detail.path.join('.'),
              message: detail.message
            })),
            code: 'VALIDATION_ERROR'
          }).code(400).takeover();
        }
      },
      description: 'Update current user profile',
      tags: ['api', 'auth'],
      notes: 'Update profile of authenticated user'
    }
  },

  /**
   * @route   POST /api/auth/change-password
   * @desc    Change user password
   * @access  Private
   */
  {
    method: 'POST',
    path: '/change-password',
    handler: authHandler.changePassword,
    options: {
      auth: 'jwt',
      validate: {
        payload: authValidator.changePasswordSchema,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation failed',
            errors: err.details.map(detail => ({
              field: detail.path.join('.'),
              message: detail.message
            })),
            code: 'VALIDATION_ERROR'
          }).code(400).takeover();
        }
      },
      description: 'Change user password',
      tags: ['api', 'auth'],
      notes: 'Change password of authenticated user'
    }
  },

  /**
   * @route   GET /api/auth/verify
   * @desc    Verify access token
   * @access  Private
   */
  {
    method: 'GET',
    path: '/verify',
    handler: authHandler.verifyToken,
    options: {
      auth: 'jwt',
      description: 'Verify access token',
      tags: ['api', 'auth'],
      notes: 'Verify if current token is valid'
    }
  },

  /**
   * @route   POST /api/auth/forgot-password
   * @desc    Send password reset email
   * @access  Public
   */
  {
    method: 'POST',
    path: '/forgot-password',
    handler: authHandler.forgotPassword,
    options: {
      auth: false,
      validate: {
        payload: authValidator.forgotPasswordSchema,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation failed',
            errors: err.details.map(detail => ({
              field: detail.path.join('.'),
              message: detail.message
            })),
            code: 'VALIDATION_ERROR'
          }).code(400).takeover();
        }
      },
      description: 'Send password reset email',
      tags: ['api', 'auth'],
      notes: 'Send password reset email to user'
    }
  },

  /**
   * @route   POST /api/auth/reset-password
   * @desc    Reset password with token
   * @access  Public
   */
  {
    method: 'POST',
    path: '/reset-password',
    handler: authHandler.resetPassword,
    options: {
      auth: false,
      validate: {
        payload: authValidator.resetPasswordSchema,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation failed',
            errors: err.details.map(detail => ({
              field: detail.path.join('.'),
              message: detail.message
            })),
            code: 'VALIDATION_ERROR'
          }).code(400).takeover();
        }
      },
      description: 'Reset password with token',
      tags: ['api', 'auth'],
      notes: 'Reset password using reset token'
    }
  },

  /**
   * @route   POST /api/auth/2fa/setup
   * @desc    Setup two-factor authentication
   * @access  Private
   */
  {
    method: 'POST',
    path: '/2fa/setup',
    handler: authHandler.setup2FA,
    options: {
      auth: 'jwt',
      description: 'Setup two-factor authentication',
      tags: ['api', 'auth'],
      notes: 'Setup 2FA for authenticated user'
    }
  },

  /**
   * @route   POST /api/auth/2fa/verify
   * @desc    Verify two-factor authentication code
   * @access  Public
   */
  {
    method: 'POST',
    path: '/2fa/verify',
    handler: authHandler.verify2FA,
    options: {
      auth: false,
      validate: {
        payload: authValidator.verify2FASchema,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation failed',
            errors: err.details.map(detail => ({
              field: detail.path.join('.'),
              message: detail.message
            })),
            code: 'VALIDATION_ERROR'
          }).code(400).takeover();
        }
      },
      description: 'Verify two-factor authentication code',
      tags: ['api', 'auth'],
      notes: 'Verify 2FA code for user'
    }
  }
];

module.exports = routes;
