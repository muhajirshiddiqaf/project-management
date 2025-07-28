// === ORGANIZATION CRUD OPERATIONS ===

const createOrganization = `
  INSERT INTO organizations (
    name, slug, description, domain, logo, website, contact_email, contact_phone,
    address, industry, company_size, timezone, locale, is_active, metadata, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
  ) RETURNING *
`;

const getOrganizations = `
  SELECT
    o.*,
    COALESCE(COUNT(u.id), 0) as user_count,
    COALESCE(COUNT(p.id), 0) as project_count,
    COALESCE(COUNT(c.id), 0) as client_count
  FROM organizations o
  LEFT JOIN users u ON o.id = u.organization_id AND u.deleted_at IS NULL
  LEFT JOIN projects p ON o.id = p.organization_id AND p.is_active = true
  LEFT JOIN clients c ON o.id = c.organization_id AND c.is_active = true
  GROUP BY o.id
  ORDER BY o.created_at DESC
  LIMIT $1 OFFSET $2
`;

const countOrganizations = `
  SELECT COUNT(*) as count
  FROM organizations o
`;

const getOrganizationById = `
  SELECT
    o.*,
    COALESCE(COUNT(u.id), 0) as user_count,
    COALESCE(COUNT(p.id), 0) as project_count,
    COALESCE(COUNT(c.id), 0) as client_count
  FROM organizations o
  LEFT JOIN users u ON o.id = u.organization_id AND u.deleted_at IS NULL
  LEFT JOIN projects p ON o.id = p.organization_id AND p.is_active = true
  LEFT JOIN clients c ON o.id = c.organization_id AND c.is_active = true
  WHERE o.id = $1
  GROUP BY o.id
`;

const getOrganizationBySlug = `
  SELECT * FROM organizations
  WHERE slug = $1 AND deleted_at IS NULL
`;

const updateOrganization = `
  UPDATE organizations
  SET column = $1, updated_at = NOW()
  WHERE id = $2
  RETURNING *
`;

const deleteOrganization = `
  UPDATE organizations
  SET deleted_at = NOW(), is_active = false
  WHERE id = $1
  RETURNING *
`;

const getOrganizationsForExport = `
  SELECT
    id, name, slug, description, domain, contact_email, industry, company_size,
    timezone, locale, is_active, created_at, updated_at
  FROM organizations
  WHERE deleted_at IS NULL
  ORDER BY created_at DESC
`;

// === SUBSCRIPTION PLAN MANAGEMENT ===

const createSubscriptionPlan = `
  INSERT INTO subscription_plans (
    name, description, price, currency, billing_cycle, features, limits,
    is_active, is_popular, metadata, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
  ) RETURNING *
`;

const getSubscriptionPlans = `
  SELECT
    sp.*,
    COALESCE(COUNT(os.organization_id), 0) as organization_count
  FROM subscription_plans sp
  LEFT JOIN organization_subscriptions os ON sp.id = os.subscription_plan_id
  GROUP BY sp.id
  ORDER BY sp.created_at DESC
  LIMIT $1 OFFSET $2
`;

const countSubscriptionPlans = `
  SELECT COUNT(*) as count
  FROM subscription_plans sp
`;

const getSubscriptionPlanById = `
  SELECT
    sp.*,
    COALESCE(COUNT(os.organization_id), 0) as organization_count
  FROM subscription_plans sp
  LEFT JOIN organization_subscriptions os ON sp.id = os.subscription_plan_id
  WHERE sp.id = $1
  GROUP BY sp.id
`;

const updateSubscriptionPlan = `
  UPDATE subscription_plans
  SET column = $1, updated_at = NOW()
  WHERE id = $2
  RETURNING *
`;

const deleteSubscriptionPlan = `
  DELETE FROM subscription_plans
  WHERE id = $1
  RETURNING *
`;

// === ORGANIZATION SUBSCRIPTION MANAGEMENT ===

const assignSubscriptionToOrganization = `
  INSERT INTO organization_subscriptions (
    organization_id, subscription_plan_id, start_date, end_date, auto_renew,
    payment_method, billing_address, metadata, assigned_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9
  ) RETURNING *
`;

const updateOrganizationSubscription = `
  UPDATE organization_subscriptions
  SET column = $1, updated_at = NOW()
  WHERE organization_id = $2
  RETURNING *
`;

const getOrganizationSubscription = `
  SELECT
    os.*,
    sp.name as plan_name,
    sp.description as plan_description,
    sp.features as plan_features,
    sp.limits as plan_limits
  FROM organization_subscriptions os
  JOIN subscription_plans sp ON os.subscription_plan_id = sp.id
  WHERE os.organization_id = $1
`;

const cancelOrganizationSubscription = `
  UPDATE organization_subscriptions
  SET
    status = 'cancelled',
    cancelled_at = NOW(),
    cancellation_reason = $2,
    effective_date = $3,
    cancelled_by = $4,
    updated_at = NOW()
  WHERE organization_id = $1
  RETURNING *
`;

// === TENANT SETTINGS ===

const getTenantSettings = `
  SELECT * FROM tenant_settings
  WHERE organization_id = $1
`;

const updateTenantSettings = `
  UPDATE tenant_settings
  SET column = $1, updated_at = NOW()
  WHERE organization_id = $2
  RETURNING *
`;

const upsertTenantSettings = `
  INSERT INTO tenant_settings (
    organization_id, general, notifications, security, integrations, branding
  ) VALUES (
    $1, $2, $3, $4, $5, $6
  )
  ON CONFLICT (organization_id)
  DO UPDATE SET
    general = EXCLUDED.general,
    notifications = EXCLUDED.notifications,
    security = EXCLUDED.security,
    integrations = EXCLUDED.integrations,
    branding = EXCLUDED.branding,
    updated_at = NOW()
  RETURNING *
`;

// === TENANT ONBOARDING ===

const initiateOnboarding = `
  INSERT INTO organization_onboarding (
    organization_id, onboarding_type, steps, assigned_admin,
    estimated_completion_days, metadata, initiated_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7
  ) RETURNING *
`;

const updateOnboardingProgress = `
  INSERT INTO onboarding_progress (
    organization_id, step, status, completed_at, notes, metadata, updated_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7
  ) RETURNING *
`;

const getOnboardingStatus = `
  SELECT
    o.*,
    COALESCE(COUNT(op.id), 0) as completed_steps,
    COALESCE(COUNT(op.id) FILTER (WHERE op.status = 'completed'), 0) as total_steps
  FROM organization_onboarding o
  LEFT JOIN onboarding_progress op ON o.organization_id = op.organization_id
  WHERE o.organization_id = $1
  GROUP BY o.id
`;

// === TENANT OFFBOARDING ===

const initiateOffboarding = `
  INSERT INTO organization_offboarding (
    organization_id, reason, effective_date, data_retention_days,
    export_data, notify_users, metadata, initiated_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8
  ) RETURNING *
`;

const updateOffboardingProgress = `
  INSERT INTO offboarding_progress (
    organization_id, step, status, completed_at, notes, metadata, updated_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7
  ) RETURNING *
`;

const getOffboardingStatus = `
  SELECT
    o.*,
    COALESCE(COUNT(op.id), 0) as completed_steps,
    COALESCE(COUNT(op.id) FILTER (WHERE op.status = 'completed'), 0) as total_steps
  FROM organization_offboarding o
  LEFT JOIN offboarding_progress op ON o.organization_id = op.organization_id
  WHERE o.organization_id = $1
  GROUP BY o.id
`;

// === ORGANIZATION STATISTICS ===

const getOrganizationStatistics = `
  SELECT
    DATE_TRUNC('day', o.created_at) as date,
    COUNT(o.id) as new_organizations,
    COUNT(CASE WHEN o.is_active = true THEN 1 END) as active_organizations,
    COUNT(CASE WHEN os.status = 'active' THEN 1 END) as subscribed_organizations,
    AVG(COALESCE(u.user_count, 0)) as avg_users_per_organization,
    AVG(COALESCE(p.project_count, 0)) as avg_projects_per_organization
  FROM organizations o
  LEFT JOIN organization_subscriptions os ON o.id = os.organization_id
  LEFT JOIN (
    SELECT organization_id, COUNT(*) as user_count
    FROM users
    WHERE deleted_at IS NULL
    GROUP BY organization_id
  ) u ON o.id = u.organization_id
  LEFT JOIN (
    SELECT organization_id, COUNT(*) as project_count
    FROM projects
    WHERE is_active = true
    GROUP BY organization_id
  ) p ON o.id = p.organization_id
  WHERE o.deleted_at IS NULL
  GROUP BY DATE_TRUNC('day', o.created_at)
  ORDER BY date DESC
`;

// === ACTIVITY LOGS ===

const createActivityLog = `
  INSERT INTO organization_activity_logs (
    organization_id, user_id, action, resource, resource_id, details, ip_address, user_agent
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8
  ) RETURNING *
`;

const getOrganizationActivityLogs = `
  SELECT
    al.*,
    u.name as user_name,
    u.email as user_email
  FROM organization_activity_logs al
  LEFT JOIN users u ON al.user_id = u.id
  WHERE al.organization_id = $1
  ORDER BY al.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countOrganizationActivityLogs = `
  SELECT COUNT(*) as count
  FROM organization_activity_logs al
  WHERE al.organization_id = $1
`;

module.exports = {
  // Organization CRUD
  createOrganization,
  getOrganizations,
  countOrganizations,
  getOrganizationById,
  getOrganizationBySlug,
  updateOrganization,
  deleteOrganization,
  getOrganizationsForExport,

  // Subscription Plans
  createSubscriptionPlan,
  getSubscriptionPlans,
  countSubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,

  // Organization Subscriptions
  assignSubscriptionToOrganization,
  updateOrganizationSubscription,
  getOrganizationSubscription,
  cancelOrganizationSubscription,

  // Tenant Settings
  getTenantSettings,
  updateTenantSettings,
  upsertTenantSettings,

  // Onboarding
  initiateOnboarding,
  updateOnboardingProgress,
  getOnboardingStatus,

  // Offboarding
  initiateOffboarding,
  updateOffboardingProgress,
  getOffboardingStatus,

  // Statistics
  getOrganizationStatistics,

  // Activity Logs
  createActivityLog,
  getOrganizationActivityLogs,
  countOrganizationActivityLogs
};
