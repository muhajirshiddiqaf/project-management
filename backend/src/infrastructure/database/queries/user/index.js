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
  SELECT
    u.*,
    COALESCE(COUNT(ur.role_id), 0) as role_count
  FROM users u
  LEFT JOIN user_roles ur ON u.id = ur.user_id
  WHERE u.id = $1 AND u.organization_id = $2
  GROUP BY u.id
`;

const updateUser = `
  UPDATE users
  SET column = $1, updated_at = NOW()
  WHERE id = $2 AND organization_id = $3
  RETURNING *
`;

const deleteUser = `
  UPDATE users
  SET deleted_at = NOW(), is_active = false
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

const findUserByEmail = `
  SELECT * FROM users
  WHERE email = $1 AND organization_id = $2 AND deleted_at IS NULL
`;

const findUserByResetToken = `
  SELECT * FROM users
  WHERE reset_token = $1 AND reset_token_expiry > NOW()
`;

const findUsersByOrganization = `
  SELECT * FROM users
  WHERE organization_id = $1
    AND ($2::text IS NULL OR role = $2)
    AND is_active = $3
    AND deleted_at IS NULL
  ORDER BY created_at DESC
  LIMIT $4 OFFSET $5
`;

const countUsersByOrganization = `
  SELECT COUNT(*) as count
  FROM users
  WHERE organization_id = $1
    AND ($2::text IS NULL OR role = $2)
    AND is_active = $3
    AND deleted_at IS NULL
`;

const searchUsers = `
  SELECT * FROM users
  WHERE organization_id = $1
    AND (
      name ILIKE $2 OR
      email ILIKE $2 OR
      department ILIKE $2
    )
    AND ($3::text IS NULL OR role = $3)
    AND deleted_at IS NULL
  ORDER BY created_at DESC
  LIMIT $4 OFFSET $5
`;

const countSearchUsers = `
  SELECT COUNT(*) as count
  FROM users
  WHERE organization_id = $1
    AND (
      name ILIKE $2 OR
      email ILIKE $2 OR
      department ILIKE $2
    )
    AND ($3::text IS NULL OR role = $3)
    AND deleted_at IS NULL
`;

const getUserStatistics = `
  SELECT
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
    COUNT(CASE WHEN role = 'manager' THEN 1 END) as manager_count,
    COUNT(CASE WHEN role = 'user' THEN 1 END) as user_count
  FROM users
  WHERE organization_id = $1 AND deleted_at IS NULL
`;

const getUsersForExport = `
  SELECT
    id, name, email, role, phone, department, position,
    is_active, created_at, updated_at
  FROM users
  WHERE organization_id = $1 AND deleted_at IS NULL
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
  WHERE user_id = $1 AND organization_id = $2 AND is_read = false
  RETURNING COUNT(*) as count
`;

// === USER PREFERENCES ===

const findUserPreferences = `
  SELECT * FROM user_preferences
  WHERE user_id = $1 AND organization_id = $2
`;

const upsertUserPreferences = `
  INSERT INTO user_preferences (
    user_id, organization_id, theme, language, timezone, notifications, dashboard
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7
  )
  ON CONFLICT (user_id, organization_id)
  DO UPDATE SET
    theme = EXCLUDED.theme,
    language = EXCLUDED.language,
    timezone = EXCLUDED.timezone,
    notifications = EXCLUDED.notifications,
    dashboard = EXCLUDED.dashboard,
    updated_at = NOW()
  RETURNING *
`;

module.exports = {
  // User CRUD
  createUser,
  getUsers,
  countUsers,
  findUserById,
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
  findUserPreferences,
  upsertUserPreferences
};
