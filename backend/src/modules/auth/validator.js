const Joi = require('@hapi/joi');

const authSchemas = {
  // === EXISTING AUTH SCHEMAS ===
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100).required(),
    organizationName: Joi.string().min(2).max(100).required(),
    organizationSlug: Joi.string().min(2).max(50).optional()
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required()
  }),

  logout: Joi.object({
    refreshToken: Joi.string().required()
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().min(2).max(100).optional(),
    lastName: Joi.string().min(2).max(100).optional()
  }),

  // === NEW 2FA SCHEMAS ===
  setup2FA: Joi.object({
    // No payload required for initial 2FA setup
  }),

  verify2FA: Joi.object({
    userId: Joi.string().uuid().required(),
    token: Joi.string().length(6).pattern(/^[0-9]+$/).required()
  }),

  enable2FA: Joi.object({
    token: Joi.string().length(6).pattern(/^[0-9]+$/).required()
  }),

  disable2FA: Joi.object({
    token: Joi.string().length(6).pattern(/^[0-9]+$/).required()
  }),

  generateQRCode: Joi.object({
    // No payload required for QR code generation
  }),

  verify2FAToken: Joi.object({
    userId: Joi.string().uuid().required(),
    token: Joi.string().length(6).pattern(/^[0-9]+$/).required()
  }),

  resend2FAToken: Joi.object({
    email: Joi.string().email().required()
  }),

  get2FAStatus: Joi.object({
    // No payload required for getting 2FA status
  }),

  backupCodes: Joi.object({
    // No payload required for generating backup codes
  }),

  verifyBackupCode: Joi.object({
    backup_code: Joi.string().length(10).pattern(/^[A-Z0-9]+$/).required(),
    email: Joi.string().email().required()
  }),

  // === 2FA RECOVERY SCHEMAS ===
  initiate2FARecovery: Joi.object({
    email: Joi.string().email().required()
  }),

  complete2FARecovery: Joi.object({
    recovery_token: Joi.string().required(),
    new_password: Joi.string().min(6).required()
  }),

  // === 2FA SETTINGS SCHEMAS ===
  update2FASettings: Joi.object({
    require_2fa_for_login: Joi.boolean().optional(),
    require_2fa_for_admin: Joi.boolean().optional(),
    backup_codes_enabled: Joi.boolean().optional(),
    sms_fallback_enabled: Joi.boolean().optional()
  }),

  get2FASettings: Joi.object({
    // No payload required for getting 2FA settings
  }),

  // === 2FA DEVICE MANAGEMENT ===
  get2FADevices: Joi.object({
    // No payload required for getting 2FA devices
  }),

  revoke2FADevice: Joi.object({
    device_id: Joi.string().uuid().required()
  }),

  // === 2FA LOGS ===
  get2FALogs: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    action: Joi.string().valid('setup', 'verify', 'enable', 'disable', 'failed').optional()
  })
};

module.exports = authSchemas;
