// Auth module database queries
const authQueries = {
  // Find user by email with organization info
  findUserByEmail: `
    SELECT u.*, o.name as organization_name, o.slug as organization_slug
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.email = $1 AND u.is_active = true AND o.is_active = true
  `,

  // Find user by ID with organization info
  findUserById: `
    SELECT u.*, o.name as organization_name, o.slug as organization_slug
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.id = $1 AND u.is_active = true
  `,

  // Check if email exists
  checkEmailExists: `
    SELECT id FROM users WHERE email = $1
  `,

  // Create user
  createUser: `
    INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name, role)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, email, first_name, last_name, role, organization_id
  `,

  // Update user last login
  updateLastLogin: `
    UPDATE users
    SET last_login_at = NOW()
    WHERE id = $1
  `,

  // Update user profile
  updateUserProfile: `
    UPDATE users
    SET first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        avatar_url = COALESCE($3, avatar_url),
        updated_at = NOW()
    WHERE id = $4
    RETURNING id, email, first_name, last_name, role, avatar_url
  `,

  // Update user password
  updateUserPassword: `
    UPDATE users
    SET password_hash = $1, updated_at = NOW()
    WHERE id = $2
  `,

  // Get user password hash
  getUserPasswordHash: `
    SELECT password_hash FROM users WHERE id = $1
  `,

  // Get user profile
  getUserProfile: `
    SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.permissions,
           u.avatar_url, u.two_factor_enabled, u.last_login_at,
           o.name as organization_name, o.slug as organization_slug
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.id = $1 AND u.is_active = true
  `,

  // Find organization by slug
  findOrganizationBySlug: `
    SELECT * FROM organizations WHERE slug = $1 AND is_active = true
  `,

  // Find organization by ID
  findOrganizationById: `
    SELECT * FROM organizations WHERE id = $1 AND is_active = true
  `,

  // Create organization
  createOrganization: `
    INSERT INTO organizations (id, name, slug, domain, subscription_plan, max_users, max_projects)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, name, slug
  `,

  // Update organization
  updateOrganization: `
    UPDATE organizations
    SET name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        domain = COALESCE($3, domain),
        logo_url = COALESCE($4, logo_url),
        primary_color = COALESCE($5, primary_color),
        secondary_color = COALESCE($6, secondary_color),
        updated_at = NOW()
    WHERE id = $7
    RETURNING *
  `,

  // Get organization users count
  getOrganizationUsersCount: `
    SELECT COUNT(*) as user_count
    FROM users
    WHERE organization_id = $1 AND is_active = true
  `,

  // Get organization projects count
  getOrganizationProjectsCount: `
    SELECT COUNT(*) as project_count
    FROM projects
    WHERE organization_id = $1 AND is_active = true
  `
};

module.exports = authQueries;
