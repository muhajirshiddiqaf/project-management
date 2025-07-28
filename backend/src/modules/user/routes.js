const routes = (handler, auth) => [
  // === USER CRUD OPERATIONS ROUTES ===
  {
    method: 'POST',
    path: '/users',
    handler: handler.createUser,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['users:create']) }
      ],
      validate: {
        payload: auth.createUser
      },
      tags: ['users']
    }
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUsers,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getUsers
      },
      tags: ['users']
    }
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getUserById
      },
      tags: ['users']
    }
  },
  {
    method: 'PUT',
    path: '/users/{id}',
    handler: handler.updateUser,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['users:update']) }
      ],
      validate: {
        params: auth.getUserById,
        payload: auth.updateUser
      },
      tags: ['users']
    }
  },
  {
    method: 'DELETE',
    path: '/users/{id}',
    handler: handler.deleteUser,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['users:delete']) }
      ],
      validate: {
        params: auth.deleteUser
      },
      tags: ['users']
    }
  },

  // === ROLE MANAGEMENT ROUTES ===
  {
    method: 'POST',
    path: '/roles',
    handler: handler.createRole,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['roles:create']) }
      ],
      validate: {
        payload: auth.createRole
      },
      tags: ['roles']
    }
  },
  {
    method: 'GET',
    path: '/roles',
    handler: handler.getRoles,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getRoles
      },
      tags: ['roles']
    }
  },
  {
    method: 'GET',
    path: '/roles/{id}',
    handler: handler.getRoleById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getRoleById
      },
      tags: ['roles']
    }
  },
  {
    method: 'PUT',
    path: '/roles/{id}',
    handler: handler.updateRole,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['roles:update']) }
      ],
      validate: {
        params: auth.getRoleById,
        payload: auth.updateRole
      },
      tags: ['roles']
    }
  },
  {
    method: 'DELETE',
    path: '/roles/{id}',
    handler: handler.deleteRole,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['roles:delete']) }
      ],
      validate: {
        params: auth.deleteRole
      },
      tags: ['roles']
    }
  },
  {
    method: 'POST',
    path: '/users/assign-role',
    handler: handler.assignRoleToUser,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['users:assign_role']) }
      ],
      validate: {
        payload: auth.assignRoleToUser
      },
      tags: ['users', 'roles']
    }
  },
  {
    method: 'DELETE',
    path: '/users/remove-role',
    handler: handler.removeRoleFromUser,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['users:remove_role']) }
      ],
      validate: {
        payload: auth.removeRoleFromUser
      },
      tags: ['users', 'roles']
    }
  },
  {
    method: 'GET',
    path: '/users/{user_id}/roles',
    handler: handler.getUserRoles,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getUserRoles
      },
      tags: ['users', 'roles']
    }
  },

  // === PERMISSION MANAGEMENT ROUTES ===
  {
    method: 'POST',
    path: '/permissions',
    handler: handler.createPermission,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['permissions:create']) }
      ],
      validate: {
        payload: auth.createPermission
      },
      tags: ['permissions']
    }
  },
  {
    method: 'GET',
    path: '/permissions',
    handler: handler.getPermissions,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getPermissions
      },
      tags: ['permissions']
    }
  },
  {
    method: 'GET',
    path: '/permissions/{id}',
    handler: handler.getPermissionById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getPermissionById
      },
      tags: ['permissions']
    }
  },
  {
    method: 'PUT',
    path: '/permissions/{id}',
    handler: handler.updatePermission,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['permissions:update']) }
      ],
      validate: {
        params: auth.getPermissionById,
        payload: auth.updatePermission
      },
      tags: ['permissions']
    }
  },
  {
    method: 'DELETE',
    path: '/permissions/{id}',
    handler: handler.deletePermission,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['permissions:delete']) }
      ],
      validate: {
        params: auth.deletePermission
      },
      tags: ['permissions']
    }
  },

  // === USER ACTIVITY LOGS ROUTES ===
  {
    method: 'GET',
    path: '/user-activity-logs',
    handler: handler.getUserActivityLogs,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getUserActivityLogs
      },
      tags: ['user-activity-logs']
    }
  },
  {
    method: 'GET',
    path: '/user-activity-logs/{id}',
    handler: handler.getActivityLogById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getActivityLogById
      },
      tags: ['user-activity-logs']
    }
  },

  // === PASSWORD RESET AND ACCOUNT RECOVERY ROUTES ===
  {
    method: 'POST',
    path: '/users/password-reset/initiate',
    handler: handler.initiatePasswordReset,
    options: {
      auth: false,
      validate: {
        payload: auth.initiatePasswordReset
      },
      tags: ['password-reset']
    }
  },
  {
    method: 'POST',
    path: '/users/password-reset/reset',
    handler: handler.resetPassword,
    options: {
      auth: false,
      validate: {
        payload: auth.resetPassword
      },
      tags: ['password-reset']
    }
  },
  {
    method: 'POST',
    path: '/users/password-reset/verify',
    handler: handler.verifyPasswordResetToken,
    options: {
      auth: false,
      validate: {
        payload: auth.verifyPasswordResetToken
      },
      tags: ['password-reset']
    }
  },
  {
    method: 'POST',
    path: '/users/change-password',
    handler: handler.changePassword,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: tenantIsolation }
      ],
      validate: {
        payload: auth.changePassword
      },
      tags: ['password-reset']
    }
  },

  // === USER PROFILE MANAGEMENT ROUTES ===
  {
    method: 'PUT',
    path: '/users/profile',
    handler: handler.updateProfile,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: tenantIsolation }
      ],
      validate: {
        payload: auth.updateProfile
      },
      tags: ['user-profile']
    }
  },
  {
    method: 'POST',
    path: '/users/avatar',
    handler: handler.uploadAvatar,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: tenantIsolation }
      ],
      validate: {
        payload: auth.uploadAvatar
      },
      tags: ['user-profile']
    }
  },

  // === USER SESSIONS ROUTES ===
  {
    method: 'GET',
    path: '/user-sessions',
    handler: handler.getUserSessions,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getUserSessions
      },
      tags: ['user-sessions']
    }
  },
  {
    method: 'DELETE',
    path: '/user-sessions/{session_id}',
    handler: handler.revokeSession,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.revokeSession
      },
      tags: ['user-sessions']
    }
  },
  {
    method: 'DELETE',
    path: '/users/{user_id}/sessions',
    handler: handler.revokeAllSessions,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.revokeAllSessions
      },
      tags: ['user-sessions']
    }
  },

  // === USER STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/user-statistics',
    handler: handler.getUserStatistics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getUserStatistics
      },
      tags: ['user-statistics']
    }
  },

  // === BULK OPERATIONS ROUTES ===
  {
    method: 'PUT',
    path: '/users/bulk-update',
    handler: handler.bulkUpdateUsers,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['users:bulk_update']) }
      ],
      validate: {
        payload: auth.bulkUpdateUsers
      },
      tags: ['users', 'bulk-operations']
    }
  },
  {
    method: 'DELETE',
    path: '/users/bulk-delete',
    handler: handler.bulkDeleteUsers,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['users:bulk_delete']) }
      ],
      validate: {
        payload: auth.bulkDeleteUsers
      },
      tags: ['users', 'bulk-operations']
    }
  },

  // === USER IMPORT/EXPORT ROUTES ===
  {
    method: 'POST',
    path: '/users/import',
    handler: handler.importUsers,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['users:import']) }
      ],
      validate: {
        payload: auth.importUsers
      },
      tags: ['users', 'import-export']
    }
  },
  {
    method: 'GET',
    path: '/users/export',
    handler: handler.exportUsers,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['users:export']) }
      ],
      validate: {
        query: auth.exportUsers
      },
      tags: ['users', 'import-export']
    }
  },

  // === USER NOTIFICATIONS ROUTES ===
  {
    method: 'GET',
    path: '/user-notifications',
    handler: handler.getUserNotifications,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: tenantIsolation }
      ],
      validate: {
        query: auth.getUserNotifications
      },
      tags: ['user-notifications']
    }
  },
  {
    method: 'PUT',
    path: '/user-notifications/{notification_id}/read',
    handler: handler.markNotificationAsRead,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: tenantIsolation }
      ],
      validate: {
        params: auth.markNotificationAsRead
      },
      tags: ['user-notifications']
    }
  },
  {
    method: 'PUT',
    path: '/user-notifications/read-all',
    handler: handler.markAllNotificationsAsRead,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: tenantIsolation }
      ],
      validate: {
        payload: auth.markAllNotificationsAsRead
      },
      tags: ['user-notifications']
    }
  },

  // === USER PREFERENCES ROUTES ===
  {
    method: 'GET',
    path: '/user-preferences',
    handler: handler.getUserPreferences,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: tenantIsolation }
      ],
      tags: ['user-preferences']
    }
  },
  {
    method: 'PUT',
    path: '/user-preferences',
    handler: handler.updateUserPreferences,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: tenantIsolation }
      ],
      validate: {
        payload: auth.updateUserPreferences
      },
      tags: ['user-preferences']
    }
  }
];

module.exports = routes;
