const userHandler = require('./handler');
const userValidator = require('./validator');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // === USER CRUD OPERATIONS ROUTES ===
  {
    method: 'POST',
    path: '/users',
    handler: userHandler.createUser,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['users:create']) }
      ],
      validate: {
        payload: userValidator.createUser
      },
      tags: ['users']
    }
  },
  {
    method: 'GET',
    path: '/users',
    handler: userHandler.getUsers,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: userValidator.getUsers
      },
      tags: ['users']
    }
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: userHandler.getUserById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: userValidator.getUserById
      },
      tags: ['users']
    }
  },
  {
    method: 'PUT',
    path: '/users/{id}',
    handler: userHandler.updateUser,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['users:update']) }
      ],
      validate: {
        params: userValidator.getUserById,
        payload: userValidator.updateUser
      },
      tags: ['users']
    }
  },
  {
    method: 'DELETE',
    path: '/users/{id}',
    handler: userHandler.deleteUser,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['users:delete']) }
      ],
      validate: {
        params: userValidator.deleteUser
      },
      tags: ['users']
    }
  },

  // === ROLE MANAGEMENT ROUTES ===
  {
    method: 'POST',
    path: '/roles',
    handler: userHandler.createRole,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['roles:create']) }
      ],
      validate: {
        payload: userValidator.createRole
      },
      tags: ['roles']
    }
  },
  {
    method: 'GET',
    path: '/roles',
    handler: userHandler.getRoles,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: userValidator.getRoles
      },
      tags: ['roles']
    }
  },
  {
    method: 'GET',
    path: '/roles/{id}',
    handler: userHandler.getRoleById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: userValidator.getRoleById
      },
      tags: ['roles']
    }
  },
  {
    method: 'PUT',
    path: '/roles/{id}',
    handler: userHandler.updateRole,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['roles:update']) }
      ],
      validate: {
        params: userValidator.getRoleById,
        payload: userValidator.updateRole
      },
      tags: ['roles']
    }
  },
  {
    method: 'DELETE',
    path: '/roles/{id}',
    handler: userHandler.deleteRole,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['roles:delete']) }
      ],
      validate: {
        params: userValidator.deleteRole
      },
      tags: ['roles']
    }
  },
  {
    method: 'POST',
    path: '/users/assign-role',
    handler: userHandler.assignRoleToUser,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['users:assign_role']) }
      ],
      validate: {
        payload: userValidator.assignRoleToUser
      },
      tags: ['users', 'roles']
    }
  },
  {
    method: 'DELETE',
    path: '/users/remove-role',
    handler: userHandler.removeRoleFromUser,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['users:remove_role']) }
      ],
      validate: {
        payload: userValidator.removeRoleFromUser
      },
      tags: ['users', 'roles']
    }
  },
  {
    method: 'GET',
    path: '/users/{user_id}/roles',
    handler: userHandler.getUserRoles,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: userValidator.getUserRoles
      },
      tags: ['users', 'roles']
    }
  },

  // === PERMISSION MANAGEMENT ROUTES ===
  {
    method: 'POST',
    path: '/permissions',
    handler: userHandler.createPermission,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['permissions:create']) }
      ],
      validate: {
        payload: userValidator.createPermission
      },
      tags: ['permissions']
    }
  },
  {
    method: 'GET',
    path: '/permissions',
    handler: userHandler.getPermissions,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: userValidator.getPermissions
      },
      tags: ['permissions']
    }
  },
  {
    method: 'GET',
    path: '/permissions/{id}',
    handler: userHandler.getPermissionById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: userValidator.getPermissionById
      },
      tags: ['permissions']
    }
  },
  {
    method: 'PUT',
    path: '/permissions/{id}',
    handler: userHandler.updatePermission,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['permissions:update']) }
      ],
      validate: {
        params: userValidator.getPermissionById,
        payload: userValidator.updatePermission
      },
      tags: ['permissions']
    }
  },
  {
    method: 'DELETE',
    path: '/permissions/{id}',
    handler: userHandler.deletePermission,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['permissions:delete']) }
      ],
      validate: {
        params: userValidator.deletePermission
      },
      tags: ['permissions']
    }
  },

  // === USER ACTIVITY LOGS ROUTES ===
  {
    method: 'GET',
    path: '/user-activity-logs',
    handler: userHandler.getUserActivityLogs,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: userValidator.getUserActivityLogs
      },
      tags: ['user-activity-logs']
    }
  },
  {
    method: 'GET',
    path: '/user-activity-logs/{id}',
    handler: userHandler.getActivityLogById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: userValidator.getActivityLogById
      },
      tags: ['user-activity-logs']
    }
  },

  // === PASSWORD RESET AND ACCOUNT RECOVERY ROUTES ===
  {
    method: 'POST',
    path: '/users/password-reset/initiate',
    handler: userHandler.initiatePasswordReset,
    options: {
      auth: false,
      validate: {
        payload: userValidator.initiatePasswordReset
      },
      tags: ['password-reset']
    }
  },
  {
    method: 'POST',
    path: '/users/password-reset/reset',
    handler: userHandler.resetPassword,
    options: {
      auth: false,
      validate: {
        payload: userValidator.resetPassword
      },
      tags: ['password-reset']
    }
  },
  {
    method: 'POST',
    path: '/users/password-reset/verify',
    handler: userHandler.verifyPasswordResetToken,
    options: {
      auth: false,
      validate: {
        payload: userValidator.verifyPasswordResetToken
      },
      tags: ['password-reset']
    }
  },
  {
    method: 'POST',
    path: '/users/change-password',
    handler: userHandler.changePassword,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation }
      ],
      validate: {
        payload: userValidator.changePassword
      },
      tags: ['password-reset']
    }
  },

  // === USER PROFILE MANAGEMENT ROUTES ===
  {
    method: 'PUT',
    path: '/users/profile',
    handler: userHandler.updateProfile,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation }
      ],
      validate: {
        payload: userValidator.updateProfile
      },
      tags: ['user-profile']
    }
  },
  {
    method: 'POST',
    path: '/users/avatar',
    handler: userHandler.uploadAvatar,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation }
      ],
      validate: {
        payload: userValidator.uploadAvatar
      },
      tags: ['user-profile']
    }
  },

  // === USER SESSIONS ROUTES ===
  {
    method: 'GET',
    path: '/user-sessions',
    handler: userHandler.getUserSessions,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: userValidator.getUserSessions
      },
      tags: ['user-sessions']
    }
  },
  {
    method: 'DELETE',
    path: '/user-sessions/{session_id}',
    handler: userHandler.revokeSession,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: userValidator.revokeSession
      },
      tags: ['user-sessions']
    }
  },
  {
    method: 'DELETE',
    path: '/users/{user_id}/sessions',
    handler: userHandler.revokeAllSessions,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: userValidator.revokeAllSessions
      },
      tags: ['user-sessions']
    }
  },

  // === USER STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/user-statistics',
    handler: userHandler.getUserStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: userValidator.getUserStatistics
      },
      tags: ['user-statistics']
    }
  },

  // === BULK OPERATIONS ROUTES ===
  {
    method: 'PUT',
    path: '/users/bulk-update',
    handler: userHandler.bulkUpdateUsers,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['users:bulk_update']) }
      ],
      validate: {
        payload: userValidator.bulkUpdateUsers
      },
      tags: ['users', 'bulk-operations']
    }
  },
  {
    method: 'DELETE',
    path: '/users/bulk-delete',
    handler: userHandler.bulkDeleteUsers,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['users:bulk_delete']) }
      ],
      validate: {
        payload: userValidator.bulkDeleteUsers
      },
      tags: ['users', 'bulk-operations']
    }
  },

  // === USER IMPORT/EXPORT ROUTES ===
  {
    method: 'POST',
    path: '/users/import',
    handler: userHandler.importUsers,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['users:import']) }
      ],
      validate: {
        payload: userValidator.importUsers
      },
      tags: ['users', 'import-export']
    }
  },
  {
    method: 'GET',
    path: '/users/export',
    handler: userHandler.exportUsers,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['users:export']) }
      ],
      validate: {
        query: userValidator.exportUsers
      },
      tags: ['users', 'import-export']
    }
  },

  // === USER NOTIFICATIONS ROUTES ===
  {
    method: 'GET',
    path: '/user-notifications',
    handler: userHandler.getUserNotifications,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation }
      ],
      validate: {
        query: userValidator.getUserNotifications
      },
      tags: ['user-notifications']
    }
  },
  {
    method: 'PUT',
    path: '/user-notifications/{notification_id}/read',
    handler: userHandler.markNotificationAsRead,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation }
      ],
      validate: {
        params: userValidator.markNotificationAsRead
      },
      tags: ['user-notifications']
    }
  },
  {
    method: 'PUT',
    path: '/user-notifications/read-all',
    handler: userHandler.markAllNotificationsAsRead,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation }
      ],
      validate: {
        payload: userValidator.markAllNotificationsAsRead
      },
      tags: ['user-notifications']
    }
  },

  // === USER PREFERENCES ROUTES ===
  {
    method: 'GET',
    path: '/user-preferences',
    handler: userHandler.getUserPreferences,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation }
      ],
      validate: {
        payload: userValidator.getUserPreferences
      },
      tags: ['user-preferences']
    }
  },
  {
    method: 'PUT',
    path: '/user-preferences',
    handler: userHandler.updateUserPreferences,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation }
      ],
      validate: {
        payload: userValidator.updateUserPreferences
      },
      tags: ['user-preferences']
    }
  }
];

module.exports = routes;
