const Joi = require('@hapi/joi');
const authHandler = require('./handler');
const authValidator = require('./validator');

const routes = [
  // Register
  {
    method: 'POST',
    path: '/register',
    handler: authHandler.register,
    options: {
      auth: false,
      validate: {
        payload: authValidator.registerSchema
      },
      tags: ['auth']
    }
  },

  // Login
  {
    method: 'POST',
    path: '/login',
    handler: authHandler.login,
    options: {
      auth: false,
      validate: {
        payload: authValidator.loginSchema
      },
      tags: ['auth']
    }
  },

  // Refresh token
  {
    method: 'POST',
    path: '/refresh',
    handler: authHandler.refreshToken,
    options: {
      auth: false,
      validate: {
        payload: authValidator.refreshTokenSchema
      },
      tags: ['auth']
    }
  },

  // Logout
  {
    method: 'POST',
    path: '/logout',
    handler: authHandler.logout,
    options: {
      auth: 'jwt',
      tags: ['auth']
    }
  },

  // Get profile
  {
    method: 'GET',
    path: '/profile',
    handler: authHandler.getProfile,
    options: {
      auth: 'jwt',
      tags: ['auth']
    }
  },

  // Update profile
  {
    method: 'PUT',
    path: '/profile',
    handler: authHandler.updateProfile,
    options: {
      auth: 'jwt',
      validate: {
        payload: authValidator.updateProfileSchema
      },
      tags: ['auth']
    }
  },

  // Change password
  {
    method: 'POST',
    path: '/change-password',
    handler: authHandler.changePassword,
    options: {
      auth: 'jwt',
      validate: {
        payload: authValidator.changePasswordSchema
      },
      tags: ['auth']
    }
  },

  // Verify token
  {
    method: 'GET',
    path: '/verify',
    handler: authHandler.verifyToken,
    options: {
      auth: 'jwt',
      tags: ['auth']
    }
  },

  // Forgot password
  {
    method: 'POST',
    path: '/forgot-password',
    handler: authHandler.forgotPassword,
    options: {
      auth: false,
      validate: {
        payload: authValidator.forgotPasswordSchema
      },
      tags: ['auth']
    }
  },

  // Reset password
  {
    method: 'POST',
    path: '/reset-password',
    handler: authHandler.resetPassword,
    options: {
      auth: false,
      validate: {
        payload: authValidator.resetPasswordSchema
      },
      tags: ['auth']
    }
  },

  // Setup 2FA
  {
    method: 'POST',
    path: '/2fa/setup',
    handler: authHandler.setup2FA,
    options: {
      auth: 'jwt',
      tags: ['auth']
    }
  },

  // Verify 2FA
  {
    method: 'POST',
    path: '/2fa/verify',
    handler: authHandler.verify2FA,
    options: {
      auth: false,
      validate: {
        payload: authValidator.verify2FASchema
      },
      tags: ['auth']
    }
  }
];

module.exports = routes;
