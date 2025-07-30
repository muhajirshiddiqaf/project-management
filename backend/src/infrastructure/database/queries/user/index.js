// === USER CRUD OPERATIONS ===

const createUser = `
  INSERT INTO users (
    organization_id, name, email, password, role, phone, avatar,
    department, position, is_active, permissions, metadata, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
  ) RETURNING *
`;

const getUsers = `
  SELECT
    u.*,
    COALESCE(COUNT(ur.role_id), 0) as role_count
  FROM users u
  LEFT JOIN user_roles ur ON u.id = ur.user_id
  WHERE u.organization_id = $1
  GROUP BY u.id
  ORDER BY u.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countUsers = `
  SELECT COUNT(*) as count
  FROM users u
  WHERE u.organization_id = $1
`;

const findUserById = `
  SELECT * FROM users
  WHERE id = $1 AND organization_id = $2
`;

const findUserByIdWithOrganization = `
  SELECT * FROM users
  WHERE id = $1 AND organization_id = $2
`;

const updateUser = `
  UPDATE users
  SET
    email = COALESCE($3, email),
    first_name = COALESCE($4, first_name),
    last_name = COALESCE($5, last_name),
    avatar_url = COALESCE($6, avatar_url),
    role = COALESCE($7, role),
    permissions = COALESCE($8, permissions),
    two_factor_enabled = COALESCE($9, two_factor_enabled),
    two_factor_secret = COALESCE($10, two_factor_secret),
    is_active = COALESCE($11, is_active),
    updated_at = NOW()
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

const deleteUser = `
  UPDATE users
  SET is_active = false, updated_at = NOW()
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

const findUserByEmail = `
  SELECT * FROM users
  WHERE email = $1 AND organization_id = $2
`;

const findUserByResetToken = `
  SELECT * FROM users
  WHERE reset_token = $1 AND reset_token_expiry > NOW()
`;

const findUsersByOrganization = `
  SELECT * FROM users
  WHERE organization_id = $1
  AND ($2::varchar IS NULL OR role = $2)
  AND ($3::boolean IS NULL OR is_active = $3)
  ORDER BY created_at DESC
  LIMIT $4 OFFSET $5
`;

const countUsersByOrganization = `
  SELECT COUNT(*) as count
  FROM users
  WHERE organization_id = $1
  AND ($2::varchar IS NULL OR role = $2)
  AND ($3::boolean IS NULL OR is_active = $3)
`;

const searchUsers = `
  SELECT * FROM users
  WHERE organization_id = $1
  AND (
    email ILIKE $2 OR
    first_name ILIKE $2 OR
    last_name ILIKE $2 OR
    CONCAT(first_name, ' ', last_name) ILIKE $2
  )
  AND ($3::varchar IS NULL OR role = $3)
  ORDER BY created_at DESC
  LIMIT $4 OFFSET $5
`;

const countSearchUsers = `
  SELECT COUNT(*) as count
  FROM users
  WHERE organization_id = $1
  AND (
    email ILIKE $2 OR
    first_name ILIKE $2 OR
    last_name ILIKE $2 OR
    CONCAT(first_name, ' ', last_name) ILIKE $2
  )
  AND ($3::varchar IS NULL OR role = $3)
`;

const getUserStatistics = `
  SELECT
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
    COUNT(CASE WHEN role = 'manager' THEN 1 END) as manager_count,
    COUNT(CASE WHEN role = 'user' THEN 1 END) as user_count
  FROM users
  WHERE organization_id = $1
`;

const getUsersForExport = `
  SELECT
    id,
    email,
    first_name,
    last_name,
    role,
    is_active,
    created_at,
    last_login_at
  FROM users
  WHERE organization_id = $1
  ORDER BY created_at DESC
`;

// === ROLE AND PERMISSION MANAGEMENT ===

const createRole = `
  INSERT INTO roles (
    organization_id, name, description, permissions, is_system, metadata, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7
  ) RETURNING *
`;

const getRoles = `
  SELECT
    r.*,
    COALESCE(COUNT(ur.user_id), 0) as user_count
  FROM roles r
  LEFT JOIN user_roles ur ON r.id = ur.role_id
  WHERE r.organization_id = $1
  GROUP BY r.id
  ORDER BY r.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countRoles = `
  SELECT COUNT(*) as count
  FROM roles r
  WHERE r.organization_id = $1
`;

const findRoleById = `
  SELECT
    r.*,
    COALESCE(COUNT(ur.user_id), 0) as user_count
  FROM roles r
  LEFT JOIN user_roles ur ON r.id = ur.role_id
  WHERE r.id = $1 AND r.organization_id = $2
  GROUP BY r.id
`;

const updateRole = `
  UPDATE roles
  SET column = $1, updated_at = NOW()
  WHERE id = $2 AND organization_id = $3
  RETURNING *
`;

const deleteRole = `
  DELETE FROM roles
  WHERE id = $1 AND organization_id = $2 AND is_system = false
  RETURNING *
`;

const assignRoleToUser = `
  INSERT INTO user_roles (user_id, role_id, organization_id)
  VALUES ($1, $2, $3)
  ON CONFLICT (user_id, role_id) DO NOTHING
  RETURNING *
`;

const removeRoleFromUser = `
  DELETE FROM user_roles
  WHERE user_id = $1 AND role_id = $2 AND organization_id = $3
  RETURNING *
`;

const getUserRoles = `
  SELECT
    r.*,
    ur.created_at as assigned_at
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = $1 AND ur.organization_id = $2
  ORDER BY ur.created_at DESC
`;

// === PERMISSION MANAGEMENT ===

const createPermission = `
  INSERT INTO permissions (
    organization_id, name, description, resource, action, is_system, metadata, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8
  ) RETURNING *
`;

const getPermissions = `
  SELECT * FROM permissions p
  WHERE p.organization_id = $1
  ORDER BY p.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countPermissions = `
  SELECT COUNT(*) as count
  FROM permissions p
  WHERE p.organization_id = $1
`;

const findPermissionById = `
  SELECT * FROM permissions
  WHERE id = $1 AND organization_id = $2
`;

const updatePermission = `
  UPDATE permissions
  SET column = $1, updated_at = NOW()
  WHERE id = $2 AND organization_id = $3
  RETURNING *
`;

const deletePermission = `
  DELETE FROM permissions
  WHERE id = $1 AND organization_id = $2 AND is_system = false
  RETURNING *
`;

// === USER ACTIVITY LOGS ===

const createActivityLog = `
  INSERT INTO user_activity_logs (
    organization_id, user_id, action, resource, resource_id, details, ip_address, user_agent
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8
  ) RETURNING *
`;

const getUserActivityLogs = `
  SELECT
    al.*,
    u.name as user_name,
    u.email as user_email
  FROM user_activity_logs al
  LEFT JOIN users u ON al.user_id = u.id
  WHERE al.organization_id = $1
  ORDER BY al.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countUserActivityLogs = `
  SELECT COUNT(*) as count
  FROM user_activity_logs al
  WHERE al.organization_id = $1
`;

const findActivityLogById = `
  SELECT
    al.*,
    u.name as user_name,
    u.email as user_email
  FROM user_activity_logs al
  LEFT JOIN users u ON al.user_id = u.id
  WHERE al.id = $1 AND al.organization_id = $2
`;

// === USER SESSIONS ===

const getUserSessions = `
  SELECT
    us.*,
    u.name as user_name,
    u.email as user_email
  FROM user_sessions us
  LEFT JOIN users u ON us.user_id = u.id
  WHERE us.organization_id = $1
  ORDER BY us.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countUserSessions = `
  SELECT COUNT(*) as count
  FROM user_sessions us
  WHERE us.organization_id = $1
`;

const revokeSession = `
  UPDATE user_sessions
  SET is_active = false, ended_at = NOW()
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

const revokeAllSessions = `
  UPDATE user_sessions
  SET is_active = false, ended_at = NOW()
  WHERE user_id = $1 AND organization_id = $2 AND is_active = true
  RETURNING *
`;

// === USER NOTIFICATIONS ===

const getUserNotifications = `
  SELECT * FROM user_notifications
  WHERE user_id = $1 AND organization_id = $2
  ORDER BY created_at DESC
  LIMIT $3 OFFSET $4
`;

const countUserNotifications = `
  SELECT COUNT(*) as count
  FROM user_notifications
  WHERE user_id = $1 AND organization_id = $2
`;

const markNotificationAsRead = `
  UPDATE user_notifications
  SET is_read = true, read_at = NOW()
  WHERE id = $1 AND user_id = $2 AND organization_id = $3
  RETURNING *
`;

const markAllNotificationsAsRead = `
  UPDATE user_notifications
  SET is_read = true, read_at = NOW()
  WHERE user_id = $1 AND organization_id = $2
  RETURNING *
`;

const getUserPreferences = `
  SELECT preferences FROM user_preferences
  WHERE user_id = $1 AND organization_id = $2
`;

const updateUserPreferences = `
  INSERT INTO user_preferences (user_id, organization_id, preferences)
  VALUES ($1, $2, $3)
  ON CONFLICT (user_id, organization_id)
  DO UPDATE SET preferences = $3, updated_at = NOW()
  RETURNING *
`;

module.exports = {
  // User CRUD
  createUser,
  getUsers,
  countUsers,
  findUserById,
  findUserByIdWithOrganization,
  updateUser,
  deleteUser,
  findUserByEmail,
  findUserByResetToken,
  findUsersByOrganization,
  countUsersByOrganization,
  searchUsers,
  countSearchUsers,
  getUserStatistics,
  getUsersForExport,

  // Role Management
  createRole,
  getRoles,
  countRoles,
  findRoleById,
  updateRole,
  deleteRole,
  assignRoleToUser,
  removeRoleFromUser,
  getUserRoles,

  // Permission Management
  createPermission,
  getPermissions,
  countPermissions,
  findPermissionById,
  updatePermission,
  deletePermission,

  // Activity Logs
  createActivityLog,
  getUserActivityLogs,
  countUserActivityLogs,
  findActivityLogById,

  // User Sessions
  getUserSessions,
  countUserSessions,
  revokeSession,
  revokeAllSessions,

  // User Notifications
  getUserNotifications,
  countUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,

  // User Preferences
  getUserPreferences,
  updateUserPreferences
};
