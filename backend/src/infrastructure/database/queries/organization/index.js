// Organization module database queries
const organizationQueries = {
  // Find organization by ID
  findOrganizationById: `
    SELECT * FROM organizations
    WHERE id = $1 AND is_active = true
  `,

  // Find organization by slug
  findOrganizationBySlug: `
    SELECT * FROM organizations
    WHERE slug = $1 AND is_active = true
  `,

  // Find organizations
  findOrganizations: `
    SELECT * FROM organizations
    WHERE is_active = true
    ORDER BY created_at DESC
  `,

  // Create organization
  createOrganization: `
    INSERT INTO organizations (id, name, slug, domain, subscription_plan,
                            max_users, max_projects, logo_url, primary_color,
                            secondary_color, settings)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
  `,

  // Update organization
  updateOrganization: `
    UPDATE organizations
    SET name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        domain = COALESCE($3, domain),
        subscription_plan = COALESCE($4, subscription_plan),
        max_users = COALESCE($5, max_users),
        max_projects = COALESCE($6, max_projects),
        logo_url = COALESCE($7, logo_url),
        primary_color = COALESCE($8, primary_color),
        secondary_color = COALESCE($9, secondary_color),
        settings = COALESCE($10, settings),
        updated_at = NOW()
    WHERE id = $11
    RETURNING *
  `,

  // Delete organization (soft delete)
  deleteOrganization: `
    UPDATE organizations
    SET is_active = false, updated_at = NOW()
    WHERE id = $1
  `,

  // Get organization statistics
  getOrganizationStatistics: `
    SELECT
      o.id,
      o.name,
      o.slug,
      o.subscription_plan,
      COUNT(u.id) as total_users,
      COUNT(p.id) as total_projects,
      COUNT(c.id) as total_clients,
      COUNT(q.id) as total_quotations,
      COUNT(ord.id) as total_orders,
      COUNT(t.id) as total_tickets,
      COUNT(i.id) as total_invoices,
      COUNT(s.id) as total_services
    FROM organizations o
    LEFT JOIN users u ON o.id = u.organization_id AND u.is_active = true
    LEFT JOIN projects p ON o.id = p.organization_id AND p.is_active = true
    LEFT JOIN clients c ON o.id = c.organization_id AND c.is_active = true
    LEFT JOIN quotations q ON o.id = q.organization_id AND q.is_active = true
    LEFT JOIN orders ord ON o.id = ord.organization_id AND ord.is_active = true
    LEFT JOIN tickets t ON o.id = t.organization_id AND t.is_active = true
    LEFT JOIN invoices i ON o.id = i.organization_id AND i.is_active = true
    LEFT JOIN services s ON o.id = s.organization_id AND s.is_active = true
    WHERE o.id = $1 AND o.is_active = true
    GROUP BY o.id, o.name, o.slug, o.subscription_plan
  `,

  // Get organization usage limits
  getOrganizationUsageLimits: `
    SELECT
      o.id,
      o.name,
      o.subscription_plan,
      o.max_users,
      o.max_projects,
      COUNT(u.id) as current_users,
      COUNT(p.id) as current_projects,
      (o.max_users - COUNT(u.id)) as remaining_users,
      (o.max_projects - COUNT(p.id)) as remaining_projects
    FROM organizations o
    LEFT JOIN users u ON o.id = u.organization_id AND u.is_active = true
    LEFT JOIN projects p ON o.id = p.organization_id AND p.is_active = true
    WHERE o.id = $1 AND o.is_active = true
    GROUP BY o.id, o.name, o.subscription_plan, o.max_users, o.max_projects
  `,

  // Get organization revenue
  getOrganizationRevenue: `
    SELECT
      o.id,
      o.name,
      SUM(q.total_amount) as quotation_revenue,
      SUM(ord.total_amount) as order_revenue,
      SUM(i.total_amount) as invoice_revenue,
      (SUM(q.total_amount) + SUM(ord.total_amount) + SUM(i.total_amount)) as total_revenue
    FROM organizations o
    LEFT JOIN quotations q ON o.id = q.organization_id AND q.status = 'accepted' AND q.is_active = true
    LEFT JOIN orders ord ON o.id = ord.organization_id AND ord.payment_status = 'paid' AND ord.is_active = true
    LEFT JOIN invoices i ON o.id = i.organization_id AND i.status = 'paid' AND i.is_active = true
    WHERE o.id = $1 AND o.is_active = true
    GROUP BY o.id, o.name
  `,

  // Get organization activity
  getOrganizationActivity: `
    SELECT
      'user' as type,
      u.id,
      u.first_name || ' ' || u.last_name as title,
      u.created_at as date,
      'registered' as status
    FROM users u
    WHERE u.organization_id = $1 AND u.is_active = true

    UNION ALL

    SELECT
      'project' as type,
      p.id,
      p.name as title,
      p.created_at as date,
      p.status
    FROM projects p
    WHERE p.organization_id = $1 AND p.is_active = true

    UNION ALL

    SELECT
      'quotation' as type,
      q.id,
      q.title as title,
      q.created_at as date,
      q.status
    FROM quotations q
    WHERE q.organization_id = $1 AND q.is_active = true

    UNION ALL

    SELECT
      'order' as type,
      o.id,
      o.title as title,
      o.created_at as date,
      o.status
    FROM orders o
    WHERE o.organization_id = $1 AND o.is_active = true

    ORDER BY date DESC
    LIMIT 50
  `,

  // Get organization settings
  getOrganizationSettings: `
    SELECT settings FROM organizations
    WHERE id = $1 AND is_active = true
  `,

  // Update organization settings
  updateOrganizationSettings: `
    UPDATE organizations
    SET settings = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING settings
  `,

  // Get organization billing info
  getOrganizationBillingInfo: `
    SELECT
      o.id,
      o.name,
      o.subscription_plan,
      o.created_at as subscription_start,
      COUNT(u.id) as user_count,
      COUNT(p.id) as project_count,
      SUM(q.total_amount) as quotation_revenue,
      SUM(ord.total_amount) as order_revenue,
      SUM(i.total_amount) as invoice_revenue
    FROM organizations o
    LEFT JOIN users u ON o.id = u.organization_id AND u.is_active = true
    LEFT JOIN projects p ON o.id = p.organization_id AND p.is_active = true
    LEFT JOIN quotations q ON o.id = q.organization_id AND q.status = 'accepted' AND q.is_active = true
    LEFT JOIN orders ord ON o.id = ord.organization_id AND ord.payment_status = 'paid' AND ord.is_active = true
    LEFT JOIN invoices i ON o.id = i.organization_id AND i.status = 'paid' AND i.is_active = true
    WHERE o.id = $1 AND o.is_active = true
    GROUP BY o.id, o.name, o.subscription_plan, o.created_at
  `,

  // Get organization subscription plans
  getOrganizationSubscriptionPlans: `
    SELECT
      subscription_plan,
      COUNT(*) as organization_count,
      AVG(COUNT(u.id)) as avg_users_per_org,
      AVG(COUNT(p.id)) as avg_projects_per_org
    FROM organizations o
    LEFT JOIN users u ON o.id = u.organization_id AND u.is_active = true
    LEFT JOIN projects p ON o.id = p.organization_id AND p.is_active = true
    WHERE o.is_active = true
    GROUP BY subscription_plan
    ORDER BY organization_count DESC
  `,

  // Get organization growth metrics
  getOrganizationGrowthMetrics: `
    SELECT
      DATE_TRUNC('month', o.created_at) as period,
      COUNT(o.id) as new_organizations,
      COUNT(u.id) as new_users,
      COUNT(p.id) as new_projects
    FROM organizations o
    LEFT JOIN users u ON o.id = u.organization_id AND u.is_active = true
    LEFT JOIN projects p ON o.id = p.organization_id AND p.is_active = true
    WHERE o.is_active = true
    AND o.created_at >= $1 AND o.created_at <= $2
    GROUP BY DATE_TRUNC('month', o.created_at)
    ORDER BY period DESC
  `,

  // Get organization performance metrics
  getOrganizationPerformanceMetrics: `
    SELECT
      o.id,
      o.name,
      o.subscription_plan,
      COUNT(u.id) as user_count,
      COUNT(p.id) as project_count,
      COUNT(c.id) as client_count,
      AVG(p.progress_percentage) as avg_project_progress,
      COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as completed_projects,
      COUNT(CASE WHEN q.status = 'accepted' THEN 1 END) as accepted_quotations,
      COUNT(CASE WHEN ord.payment_status = 'paid' THEN 1 END) as paid_orders,
      COUNT(CASE WHEN i.status = 'paid' THEN 1 END) as paid_invoices
    FROM organizations o
    LEFT JOIN users u ON o.id = u.organization_id AND u.is_active = true
    LEFT JOIN projects p ON o.id = p.organization_id AND p.is_active = true
    LEFT JOIN clients c ON o.id = c.organization_id AND c.is_active = true
    LEFT JOIN quotations q ON o.id = q.organization_id AND q.is_active = true
    LEFT JOIN orders ord ON o.id = ord.organization_id AND ord.is_active = true
    LEFT JOIN invoices i ON o.id = i.organization_id AND i.is_active = true
    WHERE o.is_active = true
    GROUP BY o.id, o.name, o.subscription_plan
    ORDER BY user_count DESC
  `,

  // Check organization limits
  checkOrganizationLimits: `
    SELECT
      o.id,
      o.max_users,
      o.max_projects,
      COUNT(u.id) as current_users,
      COUNT(p.id) as current_projects,
      CASE WHEN COUNT(u.id) >= o.max_users THEN true ELSE false END as user_limit_reached,
      CASE WHEN COUNT(p.id) >= o.max_projects THEN true ELSE false END as project_limit_reached
    FROM organizations o
    LEFT JOIN users u ON o.id = u.organization_id AND u.is_active = true
    LEFT JOIN projects p ON o.id = p.organization_id AND p.is_active = true
    WHERE o.id = $1 AND o.is_active = true
    GROUP BY o.id, o.max_users, o.max_projects
  `,

  // Get organization dashboard data
  getOrganizationDashboardData: `
    SELECT
      o.id,
      o.name,
      o.slug,
      o.subscription_plan,
      o.logo_url,
      o.primary_color,
      o.secondary_color,
      COUNT(u.id) as total_users,
      COUNT(p.id) as total_projects,
      COUNT(c.id) as total_clients,
      COUNT(q.id) as total_quotations,
      COUNT(ord.id) as total_orders,
      COUNT(t.id) as total_tickets,
      COUNT(i.id) as total_invoices,
      COUNT(s.id) as total_services,
      SUM(q.total_amount) as quotation_revenue,
      SUM(ord.total_amount) as order_revenue,
      SUM(i.total_amount) as invoice_revenue
    FROM organizations o
    LEFT JOIN users u ON o.id = u.organization_id AND u.is_active = true
    LEFT JOIN projects p ON o.id = p.organization_id AND p.is_active = true
    LEFT JOIN clients c ON o.id = c.organization_id AND c.is_active = true
    LEFT JOIN quotations q ON o.id = q.organization_id AND q.status = 'accepted' AND q.is_active = true
    LEFT JOIN orders ord ON o.id = ord.organization_id AND ord.payment_status = 'paid' AND ord.is_active = true
    LEFT JOIN invoices i ON o.id = i.organization_id AND i.status = 'paid' AND i.is_active = true
    LEFT JOIN tickets t ON o.id = t.organization_id AND t.is_active = true
    LEFT JOIN services s ON o.id = s.organization_id AND s.is_active = true
    WHERE o.id = $1 AND o.is_active = true
    GROUP BY o.id, o.name, o.slug, o.subscription_plan, o.logo_url, o.primary_color, o.secondary_color
  `,

  // Get organization white-label settings
  getOrganizationWhiteLabelSettings: `
    SELECT
      id,
      name,
      slug,
      domain,
      logo_url,
      primary_color,
      secondary_color,
      settings
    FROM organizations
    WHERE id = $1 AND is_active = true
  `,

  // Update organization white-label settings
  updateOrganizationWhiteLabelSettings: `
    UPDATE organizations
    SET domain = COALESCE($1, domain),
        logo_url = COALESCE($2, logo_url),
        primary_color = COALESCE($3, primary_color),
        secondary_color = COALESCE($4, secondary_color),
        updated_at = NOW()
    WHERE id = $5
    RETURNING *
  `,

  // Get organization SSO settings
  getOrganizationSSOSettings: `
    SELECT
      settings->>'sso_enabled' as sso_enabled,
      settings->>'sso_provider' as sso_provider,
      settings->>'sso_config' as sso_config
    FROM organizations
    WHERE id = $1 AND is_active = true
  `,

  // Update organization SSO settings
  updateOrganizationSSOSettings: `
    UPDATE organizations
    SET settings = jsonb_set(
      COALESCE(settings, '{}'::jsonb),
      '{sso_enabled}',
      $1::jsonb
    ),
    settings = jsonb_set(
      settings,
      '{sso_provider}',
      $2::jsonb
    ),
    settings = jsonb_set(
      settings,
      '{sso_config}',
      $3::jsonb
    ),
    updated_at = NOW()
    WHERE id = $4
    RETURNING settings
  `
};

module.exports = organizationQueries;
