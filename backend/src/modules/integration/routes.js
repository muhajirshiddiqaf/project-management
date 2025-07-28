const integrationValidator = require('./validator');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const createRoutes = (integrationHandler) => [
  // Integration CRUD routes
  {
    method: 'POST',
    path: '/integrations',
    handler: integrationHandler.createIntegration,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['integration:create']) }
      ],
      validate: {
        payload: integrationValidator.createIntegration
      },
      tags: ['integrations']
    }
  },
  {
    method: 'GET',
    path: '/integrations',
    handler: integrationHandler.getIntegrations,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: integrationValidator.getIntegrations
      },
      tags: ['integrations']
    }
  },
  {
    method: 'GET',
    path: '/integrations/{id}',
    handler: integrationHandler.getIntegrationById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: integrationValidator.getIntegrationById
      },
      tags: ['integrations']
    }
  },
  {
    method: 'PUT',
    path: '/integrations/{id}',
    handler: integrationHandler.updateIntegration,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['integration:update']) }
      ],
      validate: {
        params: integrationValidator.getIntegrationById,
        payload: integrationValidator.updateIntegration
      },
      tags: ['integrations']
    }
  },
  {
    method: 'DELETE',
    path: '/integrations/{id}',
    handler: integrationHandler.deleteIntegration,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['integration:delete']) }
      ],
      validate: {
        params: integrationValidator.deleteIntegration
      },
      tags: ['integrations']
    }
  },

  // Integration testing and sync routes
  {
    method: 'POST',
    path: '/integrations/{id}/test',
    handler: integrationHandler.testConnection,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: integrationValidator.getIntegrationById
      },
      tags: ['integrations']
    }
  },
  {
    method: 'POST',
    path: '/integrations/{id}/sync',
    handler: integrationHandler.syncData,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: integrationValidator.getIntegrationById,
        payload: integrationValidator.syncData
      },
      tags: ['integrations']
    }
  },

  // Webhook management routes
  {
    method: 'GET',
    path: '/integrations/{id}/webhooks',
    handler: integrationHandler.getWebhooks,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: integrationValidator.getIntegrationById
      },
      tags: ['integrations', 'webhooks']
    }
  },
  {
    method: 'POST',
    path: '/integrations/{id}/webhooks',
    handler: integrationHandler.createWebhook,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: integrationValidator.getIntegrationById,
        payload: integrationValidator.createWebhook
      },
      tags: ['integrations', 'webhooks']
    }
  },
  {
    method: 'PUT',
    path: '/integrations/{id}/webhooks/{webhookId}',
    handler: integrationHandler.updateWebhook,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: integrationValidator.updateWebhook,
        payload: integrationValidator.updateWebhook
      },
      tags: ['integrations', 'webhooks']
    }
  },
  {
    method: 'DELETE',
    path: '/integrations/{id}/webhooks/{webhookId}',
    handler: integrationHandler.deleteWebhook,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin']) }
      ],
      validate: {
        params: integrationValidator.deleteWebhook
      },
      tags: ['integrations', 'webhooks']
    }
  },

  // Bulk operations
  {
    method: 'POST',
    path: '/integrations/bulk',
    handler: integrationHandler.bulkOperation,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin']) }
      ],
      validate: {
        payload: integrationValidator.bulkOperation
      },
      tags: ['integrations']
    }
  },

  // Export/Import routes
  {
    method: 'GET',
    path: '/integrations/export',
    handler: integrationHandler.exportIntegrations,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: integrationValidator.exportIntegrations
      },
      tags: ['integrations']
    }
  },
  {
    method: 'POST',
    path: '/integrations/import',
    handler: integrationHandler.importIntegrations,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin']) }
      ],
      validate: {
        payload: integrationValidator.importIntegrations
      },
      tags: ['integrations']
    }
  },

  // OAuth callback route
  {
    method: 'GET',
    path: '/integrations/{id}/oauth/callback',
    handler: integrationHandler.oauthCallback,
    options: {
      auth: false,
      validate: {
        params: integrationValidator.getIntegrationById,
        query: integrationValidator.oauthCallback
      },
      tags: ['integrations', 'oauth']
    }
  },

  // API key management
  {
    method: 'POST',
    path: '/integrations/{id}/rotate-api-key',
    handler: integrationHandler.rotateApiKey,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: integrationValidator.getIntegrationById
      },
      tags: ['integrations']
    }
  },

  // Integration logs
  {
    method: 'GET',
    path: '/integrations/{id}/logs',
    handler: integrationHandler.getIntegrationLogs,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: integrationValidator.getIntegrationById,
        query: integrationValidator.getIntegrationLogs
      },
      tags: ['integrations', 'logs']
    }
  },

  // Health check
  {
    method: 'GET',
    path: '/integrations/{id}/health',
    handler: integrationHandler.healthCheck,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: integrationValidator.getIntegrationById
      },
      tags: ['integrations']
    }
  },

  // Cleanup old logs
  {
    method: 'POST',
    path: '/integrations/cleanup-logs',
    handler: integrationHandler.cleanupLogs,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin']) }
      ],
      validate: {
        payload: integrationValidator.cleanupLogs
      },
      tags: ['integrations']
    }
  }
];

module.exports = createRoutes;
