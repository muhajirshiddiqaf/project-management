const routes = (handler, auth) => [
  // === BASIC AUTH ROUTES ===
  {
    method: 'POST',
    path: '/auth/register',
    handler: handler.register,
    options: {
      auth: false,
      validate: {
        payload: auth.register
      },
      tags: ['auth']
    }
  },

  {
    method: 'POST',
    path: '/auth/login',
    handler: handler.login,
    options: {
      auth: false,
      validate: {
        payload: auth.login
      },
      tags: ['auth']
    }
  },

  {
    method: 'POST',
    path: '/auth/refresh-token',
    handler: handler.refreshToken,
    options: {
      auth: false,
      validate: {
        payload: auth.refreshToken
      },
      tags: ['auth']
    }
  },

  {
    method: 'POST',
    path: '/auth/logout',
    handler: handler.logout,
    options: {
      auth: 'jwt',
      auth: "jwt",
      validate: {
        payload: auth.logout
      },
      tags: ['auth']
    }
  },

  // === PASSWORD MANAGEMENT ===
  {
    method: 'POST',
    path: '/auth/forgot-password',
    handler: handler.forgotPassword,
    options: {
      auth: false,
      validate: {
        payload: auth.forgotPassword
      },
      tags: ['auth']
    }
  },

  {
    method: 'POST',
    path: '/auth/reset-password',
    handler: handler.resetPassword,
    options: {
      auth: false,
      validate: {
        payload: auth.resetPassword
      },
      tags: ['auth']
    }
  },

  {
    method: 'PUT',
    path: '/auth/change-password',
    handler: handler.changePassword,
    options: {
      auth: 'jwt',
      auth: "jwt",
      validate: {
        payload: auth.changePassword
      },
      tags: ['auth']
    }
  },

  // === PROFILE MANAGEMENT ===
  {
    method: 'GET',
    path: '/auth/profile',
    handler: handler.getProfile,
    options: {
      auth: 'jwt',
      auth: "jwt",
      tags: ['auth']
    }
  },

  {
    method: 'PUT',
    path: '/auth/profile',
    handler: handler.updateProfile,
    options: {
      auth: 'jwt',
      auth: "jwt",
      validate: {
        payload: auth.updateProfile
      },
      tags: ['auth']
    }
  },

  // === 2FA ROUTES ===
  {
    method: 'POST',
    path: '/auth/2fa/setup',
    handler: handler.setup2FA,
    options: {
      auth: 'jwt',
      auth: "jwt",
      validate: {
        payload: auth.setup2FA
      },
      tags: ['2fa']
    }
  },

  {
    method: 'POST',
    path: '/auth/2fa/verify',
    handler: handler.verify2FA,
    options: {
      auth: false,
      validate: {
        payload: auth.verify2FA
      },
      tags: ['2fa']
    }
  },

  {
    method: 'POST',
    path: '/auth/2fa/enable',
    handler: handler.enable2FA,
    options: {
      auth: 'jwt',
      auth: "jwt",
      validate: {
        payload: auth.enable2FA
      },
      tags: ['2fa']
    }
  },

  {
    method: 'POST',
    path: '/auth/2fa/disable',
    handler: handler.disable2FA,
    options: {
      auth: 'jwt',
      auth: "jwt",
      validate: {
        payload: auth.disable2FA
      },
      tags: ['2fa']
    }
  },

  {
    method: 'GET',
    path: '/auth/2fa/qr-code',
    handler: handler.generateQRCode,
    options: {
      auth: 'jwt',
      auth: "jwt",
      tags: ['2fa']
    }
  },

  {
    method: 'POST',
    path: '/auth/2fa/verify-token',
    handler: handler.verify2FAToken,
    options: {
      auth: false,
      validate: {
        payload: auth.verify2FAToken
      },
      tags: ['2fa']
    }
  },

  {
    method: 'POST',
    path: '/auth/2fa/resend',
    handler: handler.resend2FAToken,
    options: {
      auth: false,
      validate: {
        payload: auth.resend2FAToken
      },
      tags: ['2fa']
    }
  },

  {
    method: 'GET',
    path: '/auth/2fa/status',
    handler: handler.get2FAStatus,
    options: {
      auth: 'jwt',
      auth: "jwt",
      tags: ['2fa']
    }
  },

  {
    method: 'POST',
    path: '/auth/2fa/backup-codes',
    handler: handler.backupCodes,
    options: {
      auth: 'jwt',
      auth: "jwt",
      validate: {
        payload: auth.backupCodes
      },
      tags: ['2fa']
    }
  },

  {
    method: 'POST',
    path: '/auth/2fa/verify-backup',
    handler: handler.verifyBackupCode,
    options: {
      auth: false,
      validate: {
        payload: auth.verifyBackupCode
      },
      tags: ['2fa']
    }
  },

  // === 2FA RECOVERY ===
  {
    method: 'POST',
    path: '/auth/2fa/recovery/initiate',
    handler: handler.initiate2FARecovery,
    options: {
      auth: false,
      validate: {
        payload: auth.initiate2FARecovery
      },
      tags: ['2fa']
    }
  },

  {
    method: 'POST',
    path: '/auth/2fa/recovery/complete',
    handler: handler.complete2FARecovery,
    options: {
      auth: false,
      validate: {
        payload: auth.complete2FARecovery
      },
      tags: ['2fa']
    }
  },

  // === 2FA SETTINGS ===
  {
    method: 'GET',
    path: '/auth/2fa/settings',
    handler: handler.get2FASettings,
    options: {
      auth: 'jwt',
      auth: "jwt",
      tags: ['2fa']
    }
  },

  {
    method: 'PUT',
    path: '/auth/2fa/settings',
    handler: handler.update2FASettings,
    options: {
      auth: 'jwt',
      auth: "jwt",
      validate: {
        payload: auth.update2FASettings
      },
      tags: ['2fa']
    }
  },

  // === 2FA DEVICE MANAGEMENT ===
  {
    method: 'GET',
    path: '/auth/2fa/devices',
    handler: handler.get2FADevices,
    options: {
      auth: 'jwt',
      auth: "jwt",
      tags: ['2fa']
    }
  },

  {
    method: 'DELETE',
    path: '/auth/2fa/devices/{device_id}',
    handler: handler.revoke2FADevice,
    options: {
      auth: 'jwt',
      auth: "jwt",
      validate: {
        params: auth.revoke2FADevice
      },
      tags: ['2fa']
    }
  },

  // === 2FA LOGS ===
  {
    method: 'GET',
    path: '/auth/2fa/logs',
    handler: handler.get2FALogs,
    options: {
      auth: 'jwt',
      auth: "jwt",
      validate: {
        query: auth.get2FALogs
      },
      tags: ['2fa']
    }
  }
];

module.exports = routes;
