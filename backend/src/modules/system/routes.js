const routes = (handler, auth) => [
  // === GENERAL SYSTEM SETTINGS ROUTES ===
  {
    method: 'GET',
    path: '/system/settings/general',
    handler: handler.getGeneralSettings,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['system:read']) }
      ],
      validate: {
        query: auth.getGeneralSettings
      },
      tags: ['system', 'settings']
    }
  },
  {
    method: 'PUT',
    path: '/system/settings/general',
    handler: handler.updateGeneralSettings,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['system:update']) }
      ],
      validate: {
        payload: auth.updateGeneralSettings
      },
      tags: ['system', 'settings']
    }
  },

  // === NOTIFICATION SETTINGS ROUTES ===
  {
    method: 'GET',
    path: '/system/settings/notifications',
    handler: handler.getNotificationSettings,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['system:read']) }
      ],
      validate: {
        query: auth.getNotificationSettings
      },
      tags: ['system', 'settings']
    }
  },
  {
    method: 'PUT',
    path: '/system/settings/notifications',
    handler: handler.updateNotificationSettings,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['system:update']) }
      ],
      validate: {
        payload: auth.updateNotificationSettings
      },
      tags: ['system', 'settings']
    }
  },

  // === INTEGRATION SETTINGS ROUTES ===
  {
    method: 'GET',
    path: '/system/settings/integrations',
    handler: handler.getIntegrationSettings,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['system:read']) }
      ],
      validate: {
        query: auth.getIntegrationSettings
      },
      tags: ['system', 'settings']
    }
  },
  {
    method: 'PUT',
    path: '/system/settings/integrations',
    handler: handler.updateIntegrationSettings,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['system:update']) }
      ],
      validate: {
        payload: auth.updateIntegrationSettings
      },
      tags: ['system', 'settings']
    }
  },

  // === AUDIT LOGS ROUTES ===
  {
    method: 'GET',
    path: '/system/audit-logs',
    handler: handler.getAuditLogs,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['audit:read']) }
      ],
      validate: {
        query: auth.getAuditLogs
      },
      tags: ['system', 'audit']
    }
  },
  {
    method: 'GET',
    path: '/system/audit-logs/{id}',
    handler: handler.getAuditLogById,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['audit:read']) }
      ],
      validate: {
        params: auth.getAuditLogById
      },
      tags: ['system', 'audit']
    }
  },
  {
    method: 'GET',
    path: '/system/audit-logs/export',
    handler: handler.exportAuditLogs,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['audit:export']) }
      ],
      validate: {
        query: auth.exportAuditLogs
      },
      tags: ['system', 'audit']
    }
  },

  // === SYSTEM HEALTH ROUTES ===
  {
    method: 'GET',
    path: '/system/health',
    handler: handler.getSystemHealth,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['system:read']) }
      ],
      validate: {
        query: auth.getSystemHealth
      },
      tags: ['system', 'health']
    }
  },
  {
    method: 'GET',
    path: '/system/metrics',
    handler: handler.getSystemMetrics,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['system:read']) }
      ],
      validate: {
        query: auth.getSystemMetrics
      },
      tags: ['system', 'metrics']
    }
  },

  // === BACKUP & RESTORE ROUTES ===
  {
    method: 'POST',
    path: '/system/backups',
    handler: handler.createBackup,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['backup:create']) }
      ],
      validate: {
        payload: auth.createBackup
      },
      tags: ['system', 'backup']
    }
  },
  {
    method: 'GET',
    path: '/system/backups',
    handler: handler.getBackups,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['backup:read']) }
      ],
      validate: {
        query: auth.getBackups
      },
      tags: ['system', 'backup']
    }
  },
  {
    method: 'GET',
    path: '/system/backups/{id}',
    handler: handler.getBackupById,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['backup:read']) }
      ],
      validate: {
        params: auth.getBackupById
      },
      tags: ['system', 'backup']
    }
  },
  {
    method: 'GET',
    path: '/system/backups/{id}/download',
    handler: handler.downloadBackup,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['backup:download']) }
      ],
      validate: {
        params: auth.downloadBackup
      },
      tags: ['system', 'backup']
    }
  },
  {
    method: 'DELETE',
    path: '/system/backups/{id}',
    handler: handler.deleteBackup,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['backup:delete']) }
      ],
      validate: {
        params: auth.deleteBackup
      },
      tags: ['system', 'backup']
    }
  },
  {
    method: 'POST',
    path: '/system/backups/{id}/restore',
    handler: handler.restoreBackup,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['backup:restore']) }
      ],
      validate: {
        params: auth.getBackupById,
        payload: auth.restoreBackup
      },
      tags: ['system', 'backup']
    }
  },

  // === SYSTEM MAINTENANCE ROUTES ===
  {
    method: 'POST',
    path: '/system/maintenance/start',
    handler: handler.startMaintenance,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['maintenance:manage']) }
      ],
      validate: {
        payload: auth.startMaintenance
      },
      tags: ['system', 'maintenance']
    }
  },
  {
    method: 'POST',
    path: '/system/maintenance/end',
    handler: handler.endMaintenance,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['maintenance:manage']) }
      ],
      validate: {
        payload: auth.endMaintenance
      },
      tags: ['system', 'maintenance']
    }
  },
  {
    method: 'GET',
    path: '/system/maintenance/status',
    handler: handler.getMaintenanceStatus,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['maintenance:read']) }
      ],
      validate: {
        query: auth.getMaintenanceStatus
      },
      tags: ['system', 'maintenance']
    }
  },

  // === SYSTEM UPDATES ROUTES ===
  {
    method: 'GET',
    path: '/system/updates/check',
    handler: handler.checkForUpdates,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['updates:read']) }
      ],
      validate: {
        query: auth.checkForUpdates
      },
      tags: ['system', 'updates']
    }
  },
  {
    method: 'GET',
    path: '/system/updates/history',
    handler: handler.getUpdateHistory,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['updates:read']) }
      ],
      validate: {
        query: auth.getUpdateHistory
      },
      tags: ['system', 'updates']
    }
  },
  {
    method: 'POST',
    path: '/system/updates/install',
    handler: handler.installUpdate,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['updates:install']) }
      ],
      validate: {
        payload: auth.installUpdate
      },
      tags: ['system', 'updates']
    }
  },

  // === SYSTEM CONFIGURATION ROUTES ===
  {
    method: 'GET',
    path: '/system/configuration',
    handler: handler.getSystemConfiguration,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['system:read']) }
      ],
      validate: {
        query: auth.getSystemConfiguration
      },
      tags: ['system', 'configuration']
    }
  },
  {
    method: 'PUT',
    path: '/system/configuration',
    handler: handler.updateSystemConfiguration,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['system:update']) }
      ],
      validate: {
        payload: auth.updateSystemConfiguration
      },
      tags: ['system', 'configuration']
    }
  },
  {
    method: 'POST',
    path: '/system/configuration/reset',
    handler: handler.resetSystemConfiguration,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['system:reset']) }
      ],
      validate: {
        payload: auth.resetSystemConfiguration
      },
      tags: ['system', 'configuration']
    }
  },

  // === SYSTEM STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/system/statistics',
    handler: handler.getSystemStatistics,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['system:read']) }
      ],
      validate: {
        query: auth.getSystemStatistics
      },
      tags: ['system', 'statistics']
    }
  },

  // === SYSTEM DIAGNOSTICS ROUTES ===
  {
    method: 'POST',
    path: '/system/diagnostics/run',
    handler: handler.runSystemDiagnostics,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['diagnostics:run']) }
      ],
      validate: {
        payload: auth.runSystemDiagnostics
      },
      tags: ['system', 'diagnostics']
    }
  },
  {
    method: 'GET',
    path: '/system/diagnostics/reports/{id}',
    handler: handler.getDiagnosticReport,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['diagnostics:read']) }
      ],
      validate: {
        params: auth.getDiagnosticReport
      },
      tags: ['system', 'diagnostics']
    }
  }
];

module.exports = routes;
