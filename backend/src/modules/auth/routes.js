const Joi = require('@hapi/joi');
const authHandler = require('./handler');
const authValidator = require('./validator');
const { tenantIsolation, roleBasedAccess } = require('../../middleware');

const routes = [
  // === BASIC AUTH ROUTES ===
  {
    method: 'POST',
    path: '/register',
    handler: authHandler.register,
    options: {
      auth: false,
      validate: {
        payload: authValidator.register
      },
      tags: ['auth']
    }
  },

  {
    method: 'POST',
    path: '/login',
    handler: authHandler.login,
    options: {
      auth: false,
      validate: {
        payload: authValidator.login
      },
      tags: ['auth']
    }
  },

  {
    method: 'POST',
    path: '/refresh-token',
    handler: authHandler.refreshToken,
    options: {
      auth: false,
      validate: {
        payload: authValidator.refreshToken
      },
      tags: ['auth']
    }
  },

  {
    method: 'POST',
    path: '/logout',
    handler: authHandler.logout,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.logout
      },
      tags: ['auth']
    }
  },

  // === PASSWORD MANAGEMENT ===
  {
    method: 'POST',
    path: '/forgot-password',
    handler: authHandler.forgotPassword,
    options: {
      auth: false,
      validate: {
        payload: authValidator.forgotPassword
      },
      tags: ['auth']
    }
  },

  {
    method: 'POST',
    path: '/reset-password',
    handler: authHandler.resetPassword,
    options: {
      auth: false,
      validate: {
        payload: authValidator.resetPassword
      },
      tags: ['auth']
    }
  },

  {
    method: 'PUT',
    path: '/change-password',
    handler: authHandler.changePassword,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.changePassword
      },
      tags: ['auth']
    }
  },

  // === PROFILE MANAGEMENT ===
  {
    method: 'GET',
    path: '/profile',
    handler: authHandler.getProfile,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      tags: ['auth']
    }
  },

  {
    method: 'PUT',
    path: '/profile',
    handler: authHandler.updateProfile,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.updateProfile
      },
      tags: ['auth']
    }
  },

  // === 2FA ROUTES ===
  {
    method: 'POST',
    path: '/2fa/setup',
    handler: authHandler.setup2FA,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.setup2FA
      },
      tags: ['2fa']
    }
  },

  {
    method: 'POST',
    path: '/2fa/verify',
    handler: authHandler.verify2FA,
    options: {
      auth: false,
      validate: {
        payload: authValidator.verify2FA
      },
      tags: ['2fa']
    }
  },

  {
    method: 'POST',
    path: '/2fa/enable',
    handler: authHandler.enable2FA,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.enable2FA
      },
      tags: ['2fa']
    }
  },

  {
    method: 'POST',
    path: '/2fa/disable',
    handler: authHandler.disable2FA,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.disable2FA
      },
      tags: ['2fa']
    }
  },

  {
    method: 'GET',
    path: '/2fa/qr-code',
    handler: authHandler.generateQRCode,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.generateQRCode
      },
      tags: ['2fa']
    }
  },

  {
    method: 'POST',
    path: '/2fa/verify-token',
    handler: authHandler.verify2FAToken,
    options: {
      auth: false,
      validate: {
        payload: authValidator.verify2FAToken
      },
      tags: ['2fa']
    }
  },

  {
    method: 'POST',
    path: '/2fa/resend',
    handler: authHandler.resend2FAToken,
    options: {
      auth: false,
      validate: {
        payload: authValidator.resend2FAToken
      },
      tags: ['2fa']
    }
  },

  {
    method: 'GET',
    path: '/2fa/status',
    handler: authHandler.get2FAStatus,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.get2FAStatus
      },
      tags: ['2fa']
    }
  },

  {
    method: 'POST',
    path: '/2fa/backup-codes',
    handler: authHandler.backupCodes,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.backupCodes
      },
      tags: ['2fa']
    }
  },

  {
    method: 'POST',
    path: '/2fa/verify-backup',
    handler: authHandler.verifyBackupCode,
    options: {
      auth: false,
      validate: {
        payload: authValidator.verifyBackupCode
      },
      tags: ['2fa']
    }
  },

  // === 2FA RECOVERY ===
  {
    method: 'POST',
    path: '/2fa/recovery/initiate',
    handler: authHandler.initiate2FARecovery,
    options: {
      auth: false,
      validate: {
        payload: authValidator.initiate2FARecovery
      },
      tags: ['2fa']
    }
  },

  {
    method: 'POST',
    path: '/2fa/recovery/complete',
    handler: authHandler.complete2FARecovery,
    options: {
      auth: false,
      validate: {
        payload: authValidator.complete2FARecovery
      },
      tags: ['2fa']
    }
  },

  // === 2FA SETTINGS ===
  {
    method: 'GET',
    path: '/2fa/settings',
    handler: authHandler.get2FASettings,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.get2FASettings
      },
      tags: ['2fa']
    }
  },

  {
    method: 'PUT',
    path: '/2fa/settings',
    handler: authHandler.update2FASettings,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.update2FASettings
      },
      tags: ['2fa']
    }
  },

  // === 2FA DEVICE MANAGEMENT ===
  {
    method: 'GET',
    path: '/2fa/devices',
    handler: authHandler.get2FADevices,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        payload: authValidator.get2FADevices
      },
      tags: ['2fa']
    }
  },

  {
    method: 'DELETE',
    path: '/2fa/devices/{device_id}',
    handler: authHandler.revoke2FADevice,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        params: authValidator.revoke2FADevice
      },
      tags: ['2fa']
    }
  },

  // === 2FA LOGS ===
  {
    method: 'GET',
    path: '/2fa/logs',
    handler: authHandler.get2FALogs,
    options: {
      auth: 'jwt',
      pre: [{ method: tenantIsolation }],
      validate: {
        query: authValidator.get2FALogs
      },
      tags: ['2fa']
    }
  }
];

module.exports = routes;
