const Joi = require('@hapi/joi');
const authHandler = require('./handler');
const authValidator = require('./validator');
const { tenantIsolation, roleBasedAccess } = require('../../middleware');

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

  // Verify 2FA
  {
    method: 'POST',
    path: '/verify-2fa',
    handler: authHandler.verify2FA,
    options: {
      auth: false,
      validate: {
        payload: authValidator.verify2FASchema
      },
      tags: ['auth']
    }
  },

  // Setup 2FA
  {
    method: 'POST',
    path: '/setup-2fa',
    handler: authHandler.setup2FA,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.setup2FASchema
      },
      tags: ['auth']
    }
  },

  // Enable 2FA
  {
    method: 'POST',
    path: '/enable-2fa',
    handler: authHandler.enable2FA,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.enable2FASchema
      },
      tags: ['auth']
    }
  },

  // Disable 2FA
  {
    method: 'POST',
    path: '/disable-2fa',
    handler: authHandler.disable2FA,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.disable2FASchema
      },
      tags: ['auth']
    }
  },

  // Refresh token
  {
    method: 'POST',
    path: '/refresh-token',
    handler: authHandler.refreshToken,
    options: {
      auth: false,
      validate: {
        payload: authValidator.refreshTokenSchema
      },
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
      pre: [{ method: tenantIsolation }],
      validate: {
        query: authValidator.getProfileSchema
      },
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
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.updateProfileSchema
      },
      tags: ['auth']
    }
  },

  // Change password
  {
    method: 'PUT',
    path: '/change-password',
    handler: authHandler.changePassword,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.changePasswordSchema
      },
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

  // Logout
  {
    method: 'POST',
    path: '/logout',
    handler: authHandler.logout,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.logoutSchema
      },
      tags: ['auth']
    }
  }
];

module.exports = routes;
