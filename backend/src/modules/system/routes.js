const systemHandler = require('./handler');
const systemValidator = require('./validator');
const { roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // === GENERAL SYSTEM SETTINGS ROUTES ===
  {
    method: 'GET',
    path: '/system/settings/general',
    handler: systemHandler.getGeneralSettings,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['system:read']) }
      ],
      validate: {
        query: systemValidator.getGeneralSettings
      },
      tags: ['system', 'settings']
    }
  },
  {
    method: 'PUT',
    path: '/system/settings/general',
    handler: systemHandler.updateGeneralSettings,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['system:update']) }
      ],
      validate: {
        payload: systemValidator.updateGeneralSettings
      },
      tags: ['system', 'settings']
    }
  },

  // === NOTIFICATION SETTINGS ROUTES ===
  {
    method: 'GET',
    path: '/system/settings/notifications',
    handler: systemHandler.getNotificationSettings,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['system:read']) }
      ],
      validate: {
        query: systemValidator.getNotificationSettings
      },
      tags: ['system', 'settings']
    }
  },
  {
    method: 'PUT',
    path: '/system/settings/notifications',
    handler: systemHandler.updateNotificationSettings,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['system:update']) }
      ],
      validate: {
        payload: systemValidator.updateNotificationSettings
      },
      tags: ['system', 'settings']
    }
  },

  // === INTEGRATION SETTINGS ROUTES ===
  {
    method: 'GET',
    path: '/system/settings/integrations',
    handler: systemHandler.getIntegrationSettings,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['system:read']) }
      ],
      validate: {
        query: systemValidator.getIntegrationSettings
      },
      tags: ['system', 'settings']
    }
  },
  {
    method: 'PUT',
    path: '/system/settings/integrations',
    handler: systemHandler.updateIntegrationSettings,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['system:update']) }
      ],
      validate: {
        payload: systemValidator.updateIntegrationSettings
      },
      tags: ['system', 'settings']
    }
  },

  // === AUDIT LOGS ROUTES ===
  {
    method: 'GET',
    path: '/system/audit-logs',
    handler: systemHandler.getAuditLogs,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['audit:read']) }
      ],
      validate: {
        query: systemValidator.getAuditLogs
      },
      tags: ['system', 'audit']
    }
  },
  {
    method: 'GET',
    path: '/system/audit-logs/{id}',
    handler: systemHandler.getAuditLogById,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['audit:read']) }
      ],
      validate: {
        params: systemValidator.getAuditLogById
      },
      tags: ['system', 'audit']
    }
  },
  {
    method: 'GET',
    path: '/system/audit-logs/export',
    handler: systemHandler.exportAuditLogs,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['audit:export']) }
      ],
      validate: {
        query: systemValidator.exportAuditLogs
      },
      tags: ['system', 'audit']
    }
  },

  // === SYSTEM HEALTH ROUTES ===
  {
    method: 'GET',
    path: '/system/health',
    handler: systemHandler.getSystemHealth,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['system:read']) }
      ],
      validate: {
        query: systemValidator.getSystemHealth
      },
      tags: ['system', 'health']
    }
  },
  {
    method: 'GET',
    path: '/system/metrics',
    handler: systemHandler.getSystemMetrics,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['system:read']) }
      ],
      validate: {
        query: systemValidator.getSystemMetrics
      },
      tags: ['system', 'metrics']
    }
  },

  // === BACKUP & RESTORE ROUTES ===
  {
    method: 'POST',
    path: '/system/backups',
    handler: systemHandler.createBackup,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['backup:create']) }
      ],
      validate: {
        payload: systemValidator.createBackup
      },
      tags: ['system', 'backup']
    }
  },
  {
    method: 'GET',
    path: '/system/backups',
    handler: systemHandler.getBackups,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['backup:read']) }
      ],
      validate: {
        query: systemValidator.getBackups
      },
      tags: ['system', 'backup']
    }
  },
  {
    method: 'GET',
    path: '/system/backups/{id}',
    handler: systemHandler.getBackupById,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['backup:read']) }
      ],
      validate: {
        params: systemValidator.getBackupById
      },
      tags: ['system', 'backup']
    }
  },
  {
    method: 'GET',
    path: '/system/backups/{id}/download',
    handler: systemHandler.downloadBackup,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['backup:download']) }
      ],
      validate: {
        params: systemValidator.downloadBackup
      },
      tags: ['system', 'backup']
    }
  },
  {
    method: 'DELETE',
    path: '/system/backups/{id}',
    handler: systemHandler.deleteBackup,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['backup:delete']) }
      ],
      validate: {
        params: systemValidator.deleteBackup
      },
      tags: ['system', 'backup']
    }
  },
  {
    method: 'POST',
    path: '/system/backups/{id}/restore',
    handler: systemHandler.restoreBackup,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['backup:restore']) }
      ],
      validate: {
        params: systemValidator.getBackupById,
        payload: systemValidator.restoreBackup
      },
      tags: ['system', 'backup']
    }
  },

  // === SYSTEM MAINTENANCE ROUTES ===
  {
    method: 'POST',
    path: '/system/maintenance/start',
    handler: systemHandler.startMaintenance,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['maintenance:manage']) }
      ],
      validate: {
        payload: systemValidator.startMaintenance
      },
      tags: ['system', 'maintenance']
    }
  },
  {
    method: 'POST',
    path: '/system/maintenance/end',
    handler: systemHandler.endMaintenance,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['maintenance:manage']) }
      ],
      validate: {
        payload: systemValidator.endMaintenance
      },
      tags: ['system', 'maintenance']
    }
  },
  {
    method: 'GET',
    path: '/system/maintenance/status',
    handler: systemHandler.getMaintenanceStatus,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['maintenance:read']) }
      ],
      validate: {
        query: systemValidator.getMaintenanceStatus
      },
      tags: ['system', 'maintenance']
    }
  },

  // === SYSTEM UPDATES ROUTES ===
  {
    method: 'GET',
    path: '/system/updates/check',
    handler: systemHandler.checkForUpdates,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['updates:read']) }
      ],
      validate: {
        query: systemValidator.checkForUpdates
      },
      tags: ['system', 'updates']
    }
  },
  {
    method: 'GET',
    path: '/system/updates/history',
    handler: systemHandler.getUpdateHistory,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['updates:read']) }
      ],
      validate: {
        query: systemValidator.getUpdateHistory
      },
      tags: ['system', 'updates']
    }
  },
  {
    method: 'POST',
    path: '/system/updates/install',
    handler: systemHandler.installUpdate,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['updates:install']) }
      ],
      validate: {
        payload: systemValidator.installUpdate
      },
      tags: ['system', 'updates']
    }
  },

  // === SYSTEM CONFIGURATION ROUTES ===
  {
    method: 'GET',
    path: '/system/configuration',
    handler: systemHandler.getSystemConfiguration,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['system:read']) }
      ],
      validate: {
        query: systemValidator.getSystemConfiguration
      },
      tags: ['system', 'configuration']
    }
  },
  {
    method: 'PUT',
    path: '/system/configuration',
    handler: systemHandler.updateSystemConfiguration,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['system:update']) }
      ],
      validate: {
        payload: systemValidator.updateSystemConfiguration
      },
      tags: ['system', 'configuration']
    }
  },
  {
    method: 'POST',
    path: '/system/configuration/reset',
    handler: systemHandler.resetSystemConfiguration,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['system:reset']) }
      ],
      validate: {
        payload: systemValidator.resetSystemConfiguration
      },
      tags: ['system', 'configuration']
    }
  },

  // === SYSTEM STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/system/statistics',
    handler: systemHandler.getSystemStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['system:read']) }
      ],
      validate: {
        query: systemValidator.getSystemStatistics
      },
      tags: ['system', 'statistics']
    }
  },

  // === SYSTEM DIAGNOSTICS ROUTES ===
  {
    method: 'POST',
    path: '/system/diagnostics/run',
    handler: systemHandler.runSystemDiagnostics,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['diagnostics:run']) }
      ],
      validate: {
        payload: systemValidator.runSystemDiagnostics
      },
      tags: ['system', 'diagnostics']
    }
  },
  {
    method: 'GET',
    path: '/system/diagnostics/reports/{id}',
    handler: systemHandler.getDiagnosticReport,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['diagnostics:read']) }
      ],
      validate: {
        params: systemValidator.getDiagnosticReport
      },
      tags: ['system', 'diagnostics']
    }
  }
];

module.exports = routes;
