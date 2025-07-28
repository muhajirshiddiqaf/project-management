const Joi = require('@hapi/joi');

const systemSchemas = {
  // === GENERAL SYSTEM SETTINGS ===
  getGeneralSettings: Joi.object({
    // No parameters needed for GET
  }),

  updateGeneralSettings: Joi.object({
    application: Joi.object({
      name: Joi.string().min(2).max(100).optional(),
      version: Joi.string().max(20).optional(),
      description: Joi.string().max(500).optional(),
      logo: Joi.string().uri().optional(),
      favicon: Joi.string().uri().optional(),
      primary_color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
      secondary_color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
      maintenance_mode: Joi.boolean().default(false),
      maintenance_message: Joi.string().max(500).optional()
    }).optional(),
    security: Joi.object({
      session_timeout_minutes: Joi.number().integer().min(15).max(1440).default(480),
      max_login_attempts: Joi.number().integer().min(3).max(10).default(5),
      password_policy: Joi.object({
        min_length: Joi.number().integer().min(6).max(20).default(8),
        require_uppercase: Joi.boolean().default(true),
        require_lowercase: Joi.boolean().default(true),
        require_numbers: Joi.boolean().default(true),
        require_special_chars: Joi.boolean().default(true),
        password_expiry_days: Joi.number().integer().min(0).optional()
      }).optional(),
      require_2fa: Joi.boolean().default(false),
      allowed_file_types: Joi.array().items(Joi.string()).optional(),
      max_file_size_mb: Joi.number().positive().max(100).default(10)
    }).optional(),
    email: Joi.object({
      from_name: Joi.string().max(100).optional(),
      from_email: Joi.string().email().optional(),
      reply_to_email: Joi.string().email().optional(),
      smtp_host: Joi.string().max(100).optional(),
      smtp_port: Joi.number().integer().min(1).max(65535).optional(),
      smtp_secure: Joi.boolean().default(true),
      smtp_username: Joi.string().max(100).optional(),
      smtp_password: Joi.string().max(100).optional()
    }).optional(),
    database: Joi.object({
      connection_pool_size: Joi.number().integer().min(1).max(50).default(10),
      query_timeout_seconds: Joi.number().integer().min(1).max(300).default(30),
      backup_enabled: Joi.boolean().default(true),
      backup_frequency_hours: Joi.number().integer().min(1).max(168).default(24),
      backup_retention_days: Joi.number().integer().min(1).max(365).default(30)
    }).optional(),
    logging: Joi.object({
      level: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
      log_to_file: Joi.boolean().default(true),
      log_to_console: Joi.boolean().default(true),
      log_rotation: Joi.boolean().default(true),
      log_retention_days: Joi.number().integer().min(1).max(365).default(30)
    }).optional()
  }),

  // === NOTIFICATION SETTINGS ===
  getNotificationSettings: Joi.object({
    // No parameters needed for GET
  }),

  updateNotificationSettings: Joi.object({
    email: Joi.object({
      enabled: Joi.boolean().default(true),
      smtp_provider: Joi.string().valid('sendgrid', 'mailgun', 'smtp').default('sendgrid'),
      api_key: Joi.string().max(200).optional(),
      webhook_url: Joi.string().uri().optional(),
      rate_limit_per_hour: Joi.number().integer().min(1).max(1000).default(100),
      templates: Joi.object({
        welcome_email: Joi.boolean().default(true),
        password_reset: Joi.boolean().default(true),
        project_updates: Joi.boolean().default(true),
        quotation_notifications: Joi.boolean().default(true),
        invoice_notifications: Joi.boolean().default(true)
      }).optional()
    }).optional(),
    push: Joi.object({
      enabled: Joi.boolean().default(false),
      provider: Joi.string().valid('firebase', 'onesignal', 'custom').optional(),
      api_key: Joi.string().max(200).optional(),
      app_id: Joi.string().max(100).optional(),
      webhook_url: Joi.string().uri().optional()
    }).optional(),
    sms: Joi.object({
      enabled: Joi.boolean().default(false),
      provider: Joi.string().valid('twilio', 'nexmo', 'custom').optional(),
      api_key: Joi.string().max(200).optional(),
      api_secret: Joi.string().max(200).optional(),
      from_number: Joi.string().max(20).optional(),
      webhook_url: Joi.string().uri().optional()
    }).optional(),
    in_app: Joi.object({
      enabled: Joi.boolean().default(true),
      retention_days: Joi.number().integer().min(1).max(90).default(30),
      max_notifications_per_user: Joi.number().integer().min(10).max(1000).default(100),
      real_time_updates: Joi.boolean().default(true)
    }).optional()
  }),

  // === INTEGRATION SETTINGS ===
  getIntegrationSettings: Joi.object({
    // No parameters needed for GET
  }),

  updateIntegrationSettings: Joi.object({
    payment: Joi.object({
      stripe: Joi.object({
        enabled: Joi.boolean().default(false),
        publishable_key: Joi.string().max(200).optional(),
        secret_key: Joi.string().max(200).optional(),
        webhook_secret: Joi.string().max(200).optional(),
        currency: Joi.string().length(3).default('USD')
      }).optional(),
      paypal: Joi.object({
        enabled: Joi.boolean().default(false),
        client_id: Joi.string().max(200).optional(),
        client_secret: Joi.string().max(200).optional(),
        mode: Joi.string().valid('sandbox', 'live').default('sandbox'),
        currency: Joi.string().length(3).default('USD')
      }).optional()
    }).optional(),
    storage: Joi.object({
      local: Joi.object({
        enabled: Joi.boolean().default(true),
        upload_path: Joi.string().max(200).default('./uploads'),
        max_file_size_mb: Joi.number().positive().max(100).default(10)
      }).optional(),
      s3: Joi.object({
        enabled: Joi.boolean().default(false),
        bucket_name: Joi.string().max(100).optional(),
        region: Joi.string().max(50).optional(),
        access_key_id: Joi.string().max(200).optional(),
        secret_access_key: Joi.string().max(200).optional(),
        cdn_url: Joi.string().uri().optional()
      }).optional(),
      google_cloud: Joi.object({
        enabled: Joi.boolean().default(false),
        bucket_name: Joi.string().max(100).optional(),
        project_id: Joi.string().max(100).optional(),
        key_file_path: Joi.string().max(200).optional(),
        cdn_url: Joi.string().uri().optional()
      }).optional()
    }).optional(),
    analytics: Joi.object({
      google_analytics: Joi.object({
        enabled: Joi.boolean().default(false),
        tracking_id: Joi.string().max(50).optional(),
        enhanced_ecommerce: Joi.boolean().default(false)
      }).optional(),
      mixpanel: Joi.object({
        enabled: Joi.boolean().default(false),
        project_token: Joi.string().max(100).optional()
      }).optional(),
      hotjar: Joi.object({
        enabled: Joi.boolean().default(false),
        site_id: Joi.string().max(50).optional()
      }).optional()
    }).optional(),
    communication: Joi.object({
      slack: Joi.object({
        enabled: Joi.boolean().default(false),
        webhook_url: Joi.string().uri().optional(),
        channel: Joi.string().max(50).optional(),
        notifications: Joi.array().items(Joi.string()).optional()
      }).optional(),
      discord: Joi.object({
        enabled: Joi.boolean().default(false),
        webhook_url: Joi.string().uri().optional(),
        channel: Joi.string().max(50).optional(),
        notifications: Joi.array().items(Joi.string()).optional()
      }).optional(),
      teams: Joi.object({
        enabled: Joi.boolean().default(false),
        webhook_url: Joi.string().uri().optional(),
        channel: Joi.string().max(50).optional(),
        notifications: Joi.array().items(Joi.string()).optional()
      }).optional()
    }).optional()
  }),

  // === AUDIT LOGS ===
  getAuditLogs: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    user_id: Joi.string().uuid().optional(),
    action: Joi.string().max(50).optional(),
    resource: Joi.string().max(50).optional(),
    resource_id: Joi.string().uuid().optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    ip_address: Joi.string().ip().optional(),
    sort_by: Joi.string().valid('created_at', 'action', 'user_id', 'resource').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  getAuditLogById: Joi.object({
    id: Joi.string().uuid().required()
  }),

  exportAuditLogs: Joi.object({
    format: Joi.string().valid('csv', 'excel', 'json').default('csv'),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    user_id: Joi.string().uuid().optional(),
    action: Joi.string().max(50).optional(),
    resource: Joi.string().max(50).optional()
  }),

  // === SYSTEM HEALTH ===
  getSystemHealth: Joi.object({
    // No parameters needed for GET
  }),

  getSystemMetrics: Joi.object({
    period: Joi.string().valid('1h', '24h', '7d', '30d').default('24h'),
    metrics: Joi.array().items(Joi.string().valid('cpu', 'memory', 'disk', 'network', 'database')).optional()
  }),

  // === BACKUP & RESTORE ===
  createBackup: Joi.object({
    type: Joi.string().valid('full', 'database', 'files').default('full'),
    description: Joi.string().max(500).optional(),
    include_logs: Joi.boolean().default(false),
    compression: Joi.boolean().default(true)
  }),

  getBackups: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    type: Joi.string().valid('full', 'database', 'files').optional(),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'failed').optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    sort_by: Joi.string().valid('created_at', 'size', 'type').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  getBackupById: Joi.object({
    id: Joi.string().uuid().required()
  }),

  downloadBackup: Joi.object({
    id: Joi.string().uuid().required()
  }),

  deleteBackup: Joi.object({
    id: Joi.string().uuid().required()
  }),

  restoreBackup: Joi.object({
    id: Joi.string().uuid().required(),
    confirm: Joi.boolean().required(),
    options: Joi.object({
      overwrite_existing: Joi.boolean().default(false),
      restore_logs: Joi.boolean().default(false),
      validate_only: Joi.boolean().default(false)
    }).optional()
  }),

  // === SYSTEM MAINTENANCE ===
  startMaintenance: Joi.object({
    mode: Joi.string().valid('full', 'read_only', 'custom').required(),
    message: Joi.string().max(500).optional(),
    scheduled_start: Joi.date().optional(),
    scheduled_end: Joi.date().optional(),
    allowed_ips: Joi.array().items(Joi.string().ip()).optional(),
    allowed_users: Joi.array().items(Joi.string().uuid()).optional()
  }),

  endMaintenance: Joi.object({
    // No parameters needed
  }),

  getMaintenanceStatus: Joi.object({
    // No parameters needed for GET
  }),

  // === SYSTEM UPDATES ===
  checkForUpdates: Joi.object({
    // No parameters needed
  }),

  getUpdateHistory: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'failed').optional(),
    sort_by: Joi.string().valid('created_at', 'version').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  installUpdate: Joi.object({
    version: Joi.string().required(),
    confirm: Joi.boolean().required(),
    backup_before_update: Joi.boolean().default(true),
    auto_restart: Joi.boolean().default(true)
  }),

  // === SYSTEM CONFIGURATION ===
  getSystemConfiguration: Joi.object({
    section: Joi.string().valid('all', 'general', 'security', 'email', 'database', 'logging', 'notifications', 'integrations').default('all')
  }),

  updateSystemConfiguration: Joi.object({
    section: Joi.string().valid('general', 'security', 'email', 'database', 'logging', 'notifications', 'integrations').required(),
    settings: Joi.object().required()
  }),

  resetSystemConfiguration: Joi.object({
    section: Joi.string().valid('all', 'general', 'security', 'email', 'database', 'logging', 'notifications', 'integrations').required(),
    confirm: Joi.boolean().required()
  }),

  // === SYSTEM STATISTICS ===
  getSystemStatistics: Joi.object({
    period: Joi.string().valid('1h', '24h', '7d', '30d', '90d').default('24h'),
    include_details: Joi.boolean().default(false)
  }),

  // === SYSTEM DIAGNOSTICS ===
  runSystemDiagnostics: Joi.object({
    tests: Joi.array().items(Joi.string().valid('database', 'email', 'storage', 'integrations', 'performance', 'security')).optional(),
    verbose: Joi.boolean().default(false)
  }),

  getDiagnosticReport: Joi.object({
    id: Joi.string().uuid().required()
  })
};

module.exports = systemSchemas;
