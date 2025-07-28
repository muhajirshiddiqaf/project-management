const Joi = require('@hapi/joi');

const userSchemas = {
  // === USER CRUD OPERATIONS ===
  createUser: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'manager', 'user', 'viewer').default('user'),
    phone: Joi.string().max(20).optional(),
    avatar: Joi.string().uri().optional(),
    department: Joi.string().max(100).optional(),
    position: Joi.string().max(100).optional(),
    is_active: Joi.boolean().default(true),
    permissions: Joi.array().items(Joi.string()).optional(),
    metadata: Joi.object().optional()
  }),

  updateUser: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().max(20).optional(),
    avatar: Joi.string().uri().optional(),
    department: Joi.string().max(100).optional(),
    position: Joi.string().max(100).optional(),
    is_active: Joi.boolean().optional(),
    role: Joi.string().valid('admin', 'manager', 'user', 'viewer').optional(),
    permissions: Joi.array().items(Joi.string()).optional(),
    metadata: Joi.object().optional()
  }),

  getUserById: Joi.object({
    id: Joi.string().uuid().required()
  }),

  getUsers: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).optional(),
    role: Joi.string().valid('admin', 'manager', 'user', 'viewer').optional(),
    department: Joi.string().max(100).optional(),
    is_active: Joi.boolean().optional(),
    sort_by: Joi.string().valid('created_at', 'updated_at', 'name', 'email', 'role').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  deleteUser: Joi.object({
    id: Joi.string().uuid().required()
  }),

  // === ROLE AND PERMISSION MANAGEMENT ===
  createRole: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().max(200).optional(),
    permissions: Joi.array().items(Joi.string()).required(),
    is_system: Joi.boolean().default(false),
    metadata: Joi.object().optional()
  }),

  updateRole: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    description: Joi.string().max(200).optional(),
    permissions: Joi.array().items(Joi.string()).optional(),
    metadata: Joi.object().optional()
  }),

  getRoleById: Joi.object({
    id: Joi.string().uuid().required()
  }),

  getRoles: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).optional(),
    is_system: Joi.boolean().optional(),
    sort_by: Joi.string().valid('created_at', 'updated_at', 'name').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  deleteRole: Joi.object({
    id: Joi.string().uuid().required()
  }),

  assignRoleToUser: Joi.object({
    user_id: Joi.string().uuid().required(),
    role_id: Joi.string().uuid().required()
  }),

  removeRoleFromUser: Joi.object({
    user_id: Joi.string().uuid().required(),
    role_id: Joi.string().uuid().required()
  }),

  getUserRoles: Joi.object({
    user_id: Joi.string().uuid().required()
  }),

  // === PERMISSION MANAGEMENT ===
  createPermission: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(200).optional(),
    resource: Joi.string().max(50).required(),
    action: Joi.string().max(50).required(),
    is_system: Joi.boolean().default(false),
    metadata: Joi.object().optional()
  }),

  updatePermission: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(200).optional(),
    resource: Joi.string().max(50).optional(),
    action: Joi.string().max(50).optional(),
    metadata: Joi.object().optional()
  }),

  getPermissionById: Joi.object({
    id: Joi.string().uuid().required()
  }),

  getPermissions: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).optional(),
    resource: Joi.string().max(50).optional(),
    action: Joi.string().max(50).optional(),
    is_system: Joi.boolean().optional(),
    sort_by: Joi.string().valid('created_at', 'updated_at', 'name', 'resource').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  deletePermission: Joi.object({
    id: Joi.string().uuid().required()
  }),

  // === USER ACTIVITY LOGS ===
  getUserActivityLogs: Joi.object({
    user_id: Joi.string().uuid().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    action: Joi.string().max(50).optional(),
    resource: Joi.string().max(50).optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    sort_by: Joi.string().valid('created_at', 'action', 'resource').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  getActivityLogById: Joi.object({
    id: Joi.string().uuid().required()
  }),

  // === PASSWORD RESET AND ACCOUNT RECOVERY ===
  initiatePasswordReset: Joi.object({
    email: Joi.string().email().required()
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    new_password: Joi.string().min(6).required(),
    confirm_password: Joi.string().valid(Joi.ref('new_password')).required()
  }),

  changePassword: Joi.object({
    current_password: Joi.string().required(),
    new_password: Joi.string().min(6).required(),
    confirm_password: Joi.string().valid(Joi.ref('new_password')).required()
  }),

  verifyPasswordResetToken: Joi.object({
    token: Joi.string().required()
  }),

  // === USER PROFILE MANAGEMENT ===
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    phone: Joi.string().max(20).optional(),
    avatar: Joi.string().uri().optional(),
    department: Joi.string().max(100).optional(),
    position: Joi.string().max(100).optional(),
    metadata: Joi.object().optional()
  }),

  uploadAvatar: Joi.object({
    avatar: Joi.object({
      hapi: Joi.object({
        filename: Joi.string().required(),
        headers: Joi.object().required()
      }).required()
    }).required()
  }),

  // === USER SESSIONS ===
  getUserSessions: Joi.object({
    user_id: Joi.string().uuid().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    is_active: Joi.boolean().optional(),
    sort_by: Joi.string().valid('created_at', 'last_activity').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  revokeSession: Joi.object({
    session_id: Joi.string().uuid().required()
  }),

  revokeAllSessions: Joi.object({
    user_id: Joi.string().uuid().required()
  }),

  // === USER STATISTICS ===
  getUserStatistics: Joi.object({
    user_id: Joi.string().uuid().optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    group_by: Joi.string().valid('day', 'week', 'month').default('day')
  }),

  // === BULK OPERATIONS ===
  bulkUpdateUsers: Joi.object({
    user_ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
    updates: Joi.object({
      role: Joi.string().valid('admin', 'manager', 'user', 'viewer').optional(),
      is_active: Joi.boolean().optional(),
      department: Joi.string().max(100).optional(),
      permissions: Joi.array().items(Joi.string()).optional()
    }).required()
  }),

  bulkDeleteUsers: Joi.object({
    user_ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
    force: Joi.boolean().default(false)
  }),

  // === USER IMPORT/EXPORT ===
  importUsers: Joi.object({
    file: Joi.object({
      hapi: Joi.object({
        filename: Joi.string().required(),
        headers: Joi.object().required()
      }).required()
    }).required(),
    options: Joi.object({
      update_existing: Joi.boolean().default(false),
      skip_errors: Joi.boolean().default(false),
      default_role: Joi.string().valid('admin', 'manager', 'user', 'viewer').default('user')
    }).optional()
  }),

  exportUsers: Joi.object({
    format: Joi.string().valid('csv', 'excel', 'json').default('csv'),
    filters: Joi.object({
      role: Joi.string().valid('admin', 'manager', 'user', 'viewer').optional(),
      department: Joi.string().max(100).optional(),
      is_active: Joi.boolean().optional()
    }).optional()
  }),

  // === USER NOTIFICATIONS ===
  getUserNotifications: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    is_read: Joi.boolean().optional(),
    type: Joi.string().max(50).optional(),
    sort_by: Joi.string().valid('created_at', 'priority').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  markNotificationAsRead: Joi.object({
    notification_id: Joi.string().uuid().required()
  }),

  markAllNotificationsAsRead: Joi.object({
    // No payload required
  }),

  // === USER PREFERENCES ===
  getUserPreferences: Joi.object({
    // No payload required
  }),

  updateUserPreferences: Joi.object({
    theme: Joi.string().valid('light', 'dark', 'auto').optional(),
    language: Joi.string().max(10).optional(),
    timezone: Joi.string().max(50).optional(),
    notifications: Joi.object({
      email: Joi.boolean().default(true),
      push: Joi.boolean().default(true),
      sms: Joi.boolean().default(false)
    }).optional(),
    dashboard: Joi.object({
      layout: Joi.string().max(50).optional(),
      widgets: Joi.array().items(Joi.string()).optional()
    }).optional()
  })
};

module.exports = userSchemas;
