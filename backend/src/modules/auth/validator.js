const Joi = require('@hapi/joi');

const authSchemas = {
  // === EXISTING AUTH SCHEMAS ===
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    organization_name: Joi.string().min(2).max(100).required(),
    organization_domain: Joi.string().domain().optional()
  }),

  refreshToken: Joi.object({
    refresh_token: Joi.string().required()
  }),

  logout: Joi.object({
    refresh_token: Joi.string().required()
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required()
  }),

  changePassword: Joi.object({
    current_password: Joi.string().required(),
    new_password: Joi.string().min(6).required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    avatar: Joi.string().uri().optional()
  }),

  // === NEW 2FA SCHEMAS ===
  setup2FA: Joi.object({
    // No payload required for initial 2FA setup
  }),

  verify2FA: Joi.object({
    token: Joi.string().length(6).pattern(/^[0-9]+$/).required()
  }),

  enable2FA: Joi.object({
    token: Joi.string().length(6).pattern(/^[0-9]+$/).required()
  }),

  disable2FA: Joi.object({
    password: Joi.string().required()
  }),

  generateQRCode: Joi.object({
    // No payload required for QR code generation
  }),

  verify2FAToken: Joi.object({
    token: Joi.string().length(6).pattern(/^[0-9]+$/).required()
  }),

  resend2FAToken: Joi.object({
    // No payload required for resending 2FA token
  }),

  get2FAStatus: Joi.object({
    // No payload required for getting 2FA status
  }),

  backupCodes: Joi.object({
    // No payload required for generating backup codes
  }),

  verifyBackupCode: Joi.object({
    backup_code: Joi.string().length(10).pattern(/^[A-Z0-9]+$/).required()
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
