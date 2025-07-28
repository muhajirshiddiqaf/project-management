// User module database queries
const userQueries = {
  // Find all users by organization
  findUsersByOrganization: `
    SELECT u.*, o.name as organization_name, o.slug as organization_slug
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.organization_id = $1 AND u.is_active = true
    ORDER BY u.created_at DESC
  `,

  // Find user by ID with full details
  findUserById: `
    SELECT u.*, o.name as organization_name, o.slug as organization_slug
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.id = $1 AND u.organization_id = $2 AND u.is_active = true
  `,

  // Create user
  createUser: `
    INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name, role, permissions)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, email, first_name, last_name, role, organization_id
  `,

  // Update user
  updateUser: `
    UPDATE users
    SET first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        email = COALESCE($3, email),
        role = COALESCE($4, role),
        permissions = COALESCE($5, permissions),
        avatar_url = COALESCE($6, avatar_url),
        two_factor_enabled = COALESCE($7, two_factor_enabled),
        updated_at = NOW()
    WHERE id = $8 AND organization_id = $9
    RETURNING *
  `,

  // Delete user (soft delete)
  deleteUser: `
    UPDATE users
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get user statistics
  getUserStatistics: `
    SELECT
      COUNT(*) as total_users,
      COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
      COUNT(CASE WHEN role = 'manager' THEN 1 END) as manager_users,
      COUNT(CASE WHEN role = 'member' THEN 1 END) as member_users,
      COUNT(CASE WHEN two_factor_enabled = true THEN 1 END) as users_with_2fa,
      AVG(EXTRACT(EPOCH FROM (NOW() - last_login_at))/3600) as avg_hours_since_login
    FROM users
    WHERE organization_id = $1 AND is_active = true
  `,

  // Find users by role
  findUsersByRole: `
    SELECT u.*, o.name as organization_name
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.organization_id = $1 AND u.role = $2 AND u.is_active = true
    ORDER BY u.created_at DESC
  `,

  // Search users
  searchUsers: `
    SELECT u.*, o.name as organization_name
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.organization_id = $1 AND u.is_active = true
    AND (
      LOWER(u.first_name) LIKE LOWER($2) OR
      LOWER(u.last_name) LIKE LOWER($2) OR
      LOWER(u.email) LIKE LOWER($2)
    )
    ORDER BY u.created_at DESC
  `,

  // Get user activity
  getUserActivity: `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.last_login_at,
      COUNT(p.id) as project_count,
      COUNT(t.id) as ticket_count,
      COUNT(q.id) as quotation_count
    FROM users u
    LEFT JOIN projects p ON u.id = p.created_by AND p.is_active = true
    LEFT JOIN tickets t ON u.id = t.assigned_to AND t.is_active = true
    LEFT JOIN quotations q ON u.id = q.created_by AND q.is_active = true
    WHERE u.organization_id = $1 AND u.is_active = true
    GROUP BY u.id, u.first_name, u.last_name, u.email, u.last_login_at
    ORDER BY u.last_login_at DESC
  `,

  // Update user permissions
  updateUserPermissions: `
    UPDATE users
    SET permissions = $1, updated_at = NOW()
    WHERE id = $2 AND organization_id = $3
    RETURNING id, permissions
  `,

  // Enable/disable 2FA
  update2FAStatus: `
    UPDATE users
    SET two_factor_enabled = $1, updated_at = NOW()
    WHERE id = $2 AND organization_id = $3
    RETURNING id, two_factor_enabled
  `,

  // Get user dashboard data
  getUserDashboardData: `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.role,
      u.avatar_url,
      u.last_login_at,
      o.name as organization_name,
      o.slug as organization_slug,
      COUNT(DISTINCT p.id) as total_projects,
      COUNT(DISTINCT t.id) as total_tickets,
      COUNT(DISTINCT q.id) as total_quotations,
      COUNT(DISTINCT o2.id) as total_orders
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    LEFT JOIN projects p ON u.id = p.created_by AND p.is_active = true
    LEFT JOIN tickets t ON u.id = t.assigned_to AND t.is_active = true
    LEFT JOIN quotations q ON u.id = q.created_by AND q.is_active = true
    LEFT JOIN orders o2 ON u.id = o2.created_by AND o2.is_active = true
    WHERE u.id = $1 AND u.organization_id = $2 AND u.is_active = true
    GROUP BY u.id, u.first_name, u.last_name, u.email, u.role, u.avatar_url, u.last_login_at, o.name, o.slug
  `
};

module.exports = userQueries;
