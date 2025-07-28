const Joi = require('@hapi/joi');

const organizationSchemas = {
  // === ORGANIZATION CRUD OPERATIONS ===
  createOrganization: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    slug: Joi.string().min(2).max(50).pattern(/^[a-z0-9-]+$/).required(),
    description: Joi.string().max(500).optional(),
    domain: Joi.string().domain().optional(),
    logo: Joi.string().uri().optional(),
    website: Joi.string().uri().optional(),
    contact_email: Joi.string().email().optional(),
    contact_phone: Joi.string().max(20).optional(),
    address: Joi.object({
      street: Joi.string().max(200).optional(),
      city: Joi.string().max(100).optional(),
      state: Joi.string().max(100).optional(),
      country: Joi.string().max(100).optional(),
      postal_code: Joi.string().max(20).optional()
    }).optional(),
    industry: Joi.string().max(100).optional(),
    company_size: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '500+').optional(),
    timezone: Joi.string().max(50).default('UTC'),
    locale: Joi.string().max(10).default('en'),
    is_active: Joi.boolean().default(true),
    metadata: Joi.object().optional()
  }),

  updateOrganization: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    slug: Joi.string().min(2).max(50).pattern(/^[a-z0-9-]+$/).optional(),
    description: Joi.string().max(500).optional(),
    domain: Joi.string().domain().optional(),
    logo: Joi.string().uri().optional(),
    website: Joi.string().uri().optional(),
    contact_email: Joi.string().email().optional(),
    contact_phone: Joi.string().max(20).optional(),
    address: Joi.object({
      street: Joi.string().max(200).optional(),
      city: Joi.string().max(100).optional(),
      state: Joi.string().max(100).optional(),
      country: Joi.string().max(100).optional(),
      postal_code: Joi.string().max(20).optional()
    }).optional(),
    industry: Joi.string().max(100).optional(),
    company_size: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '500+').optional(),
    timezone: Joi.string().max(50).optional(),
    locale: Joi.string().max(10).optional(),
    is_active: Joi.boolean().optional(),
    metadata: Joi.object().optional()
  }),

  getOrganizationById: Joi.object({
    id: Joi.string().uuid().required()
  }),

  getOrganizations: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).optional(),
    industry: Joi.string().max(100).optional(),
    company_size: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '500+').optional(),
    is_active: Joi.boolean().optional(),
    sort_by: Joi.string().valid('created_at', 'updated_at', 'name', 'slug').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  deleteOrganization: Joi.object({
    id: Joi.string().uuid().required()
  }),

  // === SUBSCRIPTION PLAN MANAGEMENT ===
  createSubscriptionPlan: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
    price: Joi.number().positive().required(),
    currency: Joi.string().length(3).default('USD'),
    billing_cycle: Joi.string().valid('monthly', 'quarterly', 'yearly').required(),
    features: Joi.array().items(Joi.string()).required(),
    limits: Joi.object({
      users: Joi.number().integer().min(1).optional(),
      projects: Joi.number().integer().min(1).optional(),
      storage_gb: Joi.number().positive().optional(),
      api_calls_per_month: Joi.number().integer().min(1).optional()
    }).optional(),
    is_active: Joi.boolean().default(true),
    is_popular: Joi.boolean().default(false),
    metadata: Joi.object().optional()
  }),

  updateSubscriptionPlan: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(500).optional(),
    price: Joi.number().positive().optional(),
    currency: Joi.string().length(3).optional(),
    billing_cycle: Joi.string().valid('monthly', 'quarterly', 'yearly').optional(),
    features: Joi.array().items(Joi.string()).optional(),
    limits: Joi.object({
      users: Joi.number().integer().min(1).optional(),
      projects: Joi.number().integer().min(1).optional(),
      storage_gb: Joi.number().positive().optional(),
      api_calls_per_month: Joi.number().integer().min(1).optional()
    }).optional(),
    is_active: Joi.boolean().optional(),
    is_popular: Joi.boolean().optional(),
    metadata: Joi.object().optional()
  }),

  getSubscriptionPlanById: Joi.object({
    id: Joi.string().uuid().required()
  }),

  getSubscriptionPlans: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).optional(),
    billing_cycle: Joi.string().valid('monthly', 'quarterly', 'yearly').optional(),
    is_active: Joi.boolean().optional(),
    sort_by: Joi.string().valid('created_at', 'updated_at', 'name', 'price').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  deleteSubscriptionPlan: Joi.object({
    id: Joi.string().uuid().required()
  }),

  // === ORGANIZATION SUBSCRIPTION MANAGEMENT ===
  assignSubscriptionToOrganization: Joi.object({
    organization_id: Joi.string().uuid().required(),
    subscription_plan_id: Joi.string().uuid().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().optional(),
    auto_renew: Joi.boolean().default(true),
    payment_method: Joi.string().max(100).optional(),
    billing_address: Joi.object({
      street: Joi.string().max(200).optional(),
      city: Joi.string().max(100).optional(),
      state: Joi.string().max(100).optional(),
      country: Joi.string().max(100).optional(),
      postal_code: Joi.string().max(20).optional()
    }).optional(),
    metadata: Joi.object().optional()
  }),

  updateOrganizationSubscription: Joi.object({
    subscription_plan_id: Joi.string().uuid().optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    auto_renew: Joi.boolean().optional(),
    payment_method: Joi.string().max(100).optional(),
    billing_address: Joi.object({
      street: Joi.string().max(200).optional(),
      city: Joi.string().max(100).optional(),
      state: Joi.string().max(100).optional(),
      country: Joi.string().max(100).optional(),
      postal_code: Joi.string().max(20).optional()
    }).optional(),
    metadata: Joi.object().optional()
  }),

  getOrganizationSubscription: Joi.object({
    organization_id: Joi.string().uuid().required()
  }),

  cancelOrganizationSubscription: Joi.object({
    organization_id: Joi.string().uuid().required(),
    reason: Joi.string().max(500).optional(),
    effective_date: Joi.date().optional()
  }),

  // === TENANT SETTINGS ===
  getTenantSettings: Joi.object({
    organization_id: Joi.string().uuid().required()
  }),

  updateTenantSettings: Joi.object({
    general: Joi.object({
      timezone: Joi.string().max(50).optional(),
      locale: Joi.string().max(10).optional(),
      date_format: Joi.string().max(20).optional(),
      time_format: Joi.string().valid('12h', '24h').optional(),
      currency: Joi.string().length(3).optional()
    }).optional(),
    notifications: Joi.object({
      email_notifications: Joi.boolean().default(true),
      push_notifications: Joi.boolean().default(true),
      sms_notifications: Joi.boolean().default(false),
      notification_frequency: Joi.string().valid('immediate', 'daily', 'weekly').default('immediate')
    }).optional(),
    security: Joi.object({
      password_policy: Joi.object({
        min_length: Joi.number().integer().min(6).max(20).default(8),
        require_uppercase: Joi.boolean().default(true),
        require_lowercase: Joi.boolean().default(true),
        require_numbers: Joi.boolean().default(true),
        require_special_chars: Joi.boolean().default(true),
        password_expiry_days: Joi.number().integer().min(0).optional()
      }).optional(),
      session_timeout_minutes: Joi.number().integer().min(15).max(1440).default(480),
      max_login_attempts: Joi.number().integer().min(3).max(10).default(5),
      require_2fa: Joi.boolean().default(false)
    }).optional(),
    integrations: Joi.object({
      allow_third_party_integrations: Joi.boolean().default(true),
      webhook_url: Joi.string().uri().optional(),
      api_rate_limit: Joi.number().integer().min(100).max(10000).default(1000)
    }).optional(),
    branding: Joi.object({
      custom_logo: Joi.string().uri().optional(),
      primary_color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
      secondary_color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
      custom_css: Joi.string().max(5000).optional()
    }).optional()
  }),

  // === TENANT ONBOARDING/OFFBOARDING ===
  initiateOnboarding: Joi.object({
    organization_id: Joi.string().uuid().required(),
    onboarding_type: Joi.string().valid('basic', 'advanced', 'enterprise').default('basic'),
    steps: Joi.array().items(Joi.string()).optional(),
    assigned_admin: Joi.string().uuid().optional(),
    estimated_completion_days: Joi.number().integer().min(1).max(90).default(7),
    metadata: Joi.object().optional()
  }),

  updateOnboardingProgress: Joi.object({
    organization_id: Joi.string().uuid().required(),
    step: Joi.string().required(),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'failed').required(),
    completed_at: Joi.date().optional(),
    notes: Joi.string().max(1000).optional(),
    metadata: Joi.object().optional()
  }),

  getOnboardingStatus: Joi.object({
    organization_id: Joi.string().uuid().required()
  }),

  initiateOffboarding: Joi.object({
    organization_id: Joi.string().uuid().required(),
    reason: Joi.string().max(500).required(),
    effective_date: Joi.date().required(),
    data_retention_days: Joi.number().integer().min(0).max(365).default(30),
    export_data: Joi.boolean().default(true),
    notify_users: Joi.boolean().default(true),
    metadata: Joi.object().optional()
  }),

  updateOffboardingProgress: Joi.object({
    organization_id: Joi.string().uuid().required(),
    step: Joi.string().required(),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'failed').required(),
    completed_at: Joi.date().optional(),
    notes: Joi.string().max(1000).optional(),
    metadata: Joi.object().optional()
  }),

  getOffboardingStatus: Joi.object({
    organization_id: Joi.string().uuid().required()
  }),

  // === ORGANIZATION STATISTICS ===
  getOrganizationStatistics: Joi.object({
    organization_id: Joi.string().uuid().optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    group_by: Joi.string().valid('day', 'week', 'month').default('day')
  }),

  // === BULK OPERATIONS ===
  bulkUpdateOrganizations: Joi.object({
    organization_ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
    updates: Joi.object({
      is_active: Joi.boolean().optional(),
      industry: Joi.string().max(100).optional(),
      timezone: Joi.string().max(50).optional(),
      locale: Joi.string().max(10).optional()
    }).required()
  }),

  bulkDeleteOrganizations: Joi.object({
    organization_ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
    force: Joi.boolean().default(false),
    export_data: Joi.boolean().default(true)
  }),

  // === ORGANIZATION IMPORT/EXPORT ===
  importOrganizations: Joi.object({
    file: Joi.object({
      hapi: Joi.object({
        filename: Joi.string().required(),
        headers: Joi.object().required()
      }).required()
    }).required(),
    options: Joi.object({
      update_existing: Joi.boolean().default(false),
      skip_errors: Joi.boolean().default(false),
      default_subscription_plan: Joi.string().uuid().optional()
    }).optional()
  }),

  exportOrganizations: Joi.object({
    format: Joi.string().valid('csv', 'excel', 'json').default('csv'),
    filters: Joi.object({
      industry: Joi.string().max(100).optional(),
      company_size: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '500+').optional(),
      is_active: Joi.boolean().optional()
    }).optional()
  })
};

module.exports = organizationSchemas;
