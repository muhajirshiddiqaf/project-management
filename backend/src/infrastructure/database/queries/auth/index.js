// Auth module database queries
const authQueries = {
  // Find user by email
  findUserByEmail: `
    SELECT u.*, o.name as organization_name, o.slug as organization_slug
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.email = $1 AND u.is_active = true
  `,

  // Find user by ID
  findUserById: `
    SELECT u.*, o.name as organization_name, o.slug as organization_slug
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.id = $1 AND u.is_active = true
  `,

  // Find organization by ID
  findOrganizationById: `
    SELECT * FROM organizations
    WHERE id = $1 AND is_active = true
  `,

  // Create organization
  createOrganization: `
    INSERT INTO organizations (name, slug)
    VALUES ($1, $2)
    RETURNING *
  `,

  // Create user
  createUser: `
    INSERT INTO users (email, password_hash, first_name, last_name, organization_id, role)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `,

  // Update user (dynamic query built in repository)
  updateUser: `
    UPDATE users
    SET first_name = $1, last_name = $2, email = $3, role = $4,
        permissions = $5, avatar_url = $6, two_factor_enabled = $7,
        two_factor_secret = $8, reset_token = $9, reset_token_expires = $10,
        updated_at = NOW()
    WHERE id = $11
    RETURNING *
  `,

  // Find users by organization
  findUsersByOrganization: `
    SELECT u.*, o.name as organization_name
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.organization_id = $1
      AND u.is_active = $3
      AND ($2::text IS NULL OR u.role = $2)
    ORDER BY u.created_at DESC
    LIMIT $4 OFFSET $5
  `,

  // Count users by organization
  countUsersByOrganization: `
    SELECT COUNT(*) as count
    FROM users
    WHERE organization_id = $1
      AND is_active = $3
      AND ($2::text IS NULL OR role = $2)
  `,

  // Search users
  searchUsers: `
    SELECT u.*, o.name as organization_name
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.organization_id = $1
      AND u.is_active = true
      AND (
        u.first_name ILIKE $2 OR
        u.last_name ILIKE $2 OR
        u.email ILIKE $2
      )
      AND ($3::text IS NULL OR u.role = $3)
    ORDER BY u.created_at DESC
    LIMIT $4 OFFSET $5
  `,

  // Count search users
  countSearchUsers: `
    SELECT COUNT(*) as count
    FROM users
    WHERE organization_id = $1
      AND is_active = true
      AND (
        first_name ILIKE $2 OR
        last_name ILIKE $2 OR
        email ILIKE $2
      )
      AND ($3::text IS NULL OR role = $3)
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
      COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_users,
      COUNT(CASE WHEN two_factor_enabled = true THEN 1 END) as two_factor_users,
      COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30_days,
      AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as avg_user_activity_hours
    FROM users
    WHERE organization_id = $1 AND is_active = true
  `
};

module.exports = authQueries;
