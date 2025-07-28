const Joi = require('joi');
const {
  validateCreateIntegration,
  validateUpdateIntegration,
  validateGetIntegrations,
  validateGetIntegrationById,
  validateDeleteIntegration,
  validateTestConnection,
  validateSyncData,
  validateCreateWebhook,
  validateUpdateWebhook,
  validateDeleteWebhook,
  validateOauthCallback,
  validateRotateApiKey,
  validateGetIntegrationLogs,
  validateBulkOperation,
  validateExportIntegrations,
  validateImportIntegrations
} = require('./validator');

const createRoutes = (handler) => [
  // Integration CRUD routes
  {
    method: 'POST',
    path: '/integrations',
    handler: handler.createIntegration.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin', 'user']
      },
      validate: {
        payload: validateCreateIntegration,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation error',
            errors: err.details
          }).code(400);
        }
      },
      description: 'Create a new integration',
      tags: ['integrations'],
      notes: 'Create a new integration with authentication and configuration settings'
    }
  },
  {
    method: 'GET',
    path: '/integrations',
    handler: handler.getIntegrations.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin', 'user']
      },
      validate: {
        query: validateGetIntegrations,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation error',
            errors: err.details
          }).code(400);
        }
      },
      description: 'Get all integrations with pagination and filters',
      tags: ['integrations'],
      notes: 'Retrieve integrations with optional filtering, sorting, and pagination'
    }
  },
  {
    method: 'GET',
    path: '/integrations/{id}',
    handler: handler.getIntegrationById.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin', 'user']
      },
      validate: {
        params: validateGetIntegrationById,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation error',
            errors: err.details
          }).code(400);
        }
      },
      description: 'Get integration by ID',
      tags: ['integrations'],
      notes: 'Retrieve a specific integration by its ID'
    }
  },
  {
    method: 'PUT',
    path: '/integrations/{id}',
    handler: handler.updateIntegration.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin', 'user']
      },
      validate: {
        params: validateGetIntegrationById,
        payload: validateUpdateIntegration,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation error',
            errors: err.details
          }).code(400);
        }
      },
      description: 'Update integration',
      tags: ['integrations'],
      notes: 'Update an existing integration with new settings'
    }
  },
  {
    method: 'DELETE',
    path: '/integrations/{id}',
    handler: handler.deleteIntegration.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin']
      },
      validate: {
        params: validateDeleteIntegration,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation error',
            errors: err.details
          }).code(400);
        }
      },
      description: 'Delete integration',
      tags: ['integrations'],
      notes: 'Permanently delete an integration'
    }
  },

  // Integration testing and sync routes
  {
    method: 'POST',
    path: '/integrations/{id}/test',
    handler: handler.testConnection.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin', 'user']
      },
      validate: {
        params: validateGetIntegrationById,
        payload: validateTestConnection,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation error',
            errors: err.details
          }).code(400);
        }
      },
      description: 'Test integration connection',
      tags: ['integrations'],
      notes: 'Test the connection to an external service'
    }
  },
  {
    method: 'POST',
    path: '/integrations/{id}/sync',
    handler: handler.syncData.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin', 'user']
      },
      validate: {
        params: validateGetIntegrationById,
        payload: validateSyncData,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation error',
            errors: err.details
          }).code(400);
        }
      },
      description: 'Sync data with external service',
      tags: ['integrations'],
      notes: 'Synchronize data with the connected external service'
    }
  },

  // Integration statistics and logs
  {
    method: 'GET',
    path: '/integrations/stats',
    handler: handler.getIntegrationStats.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin', 'user']
      },
      description: 'Get integration statistics',
      tags: ['integrations'],
      notes: 'Retrieve statistics about integrations'
    }
  },
  {
    method: 'GET',
    path: '/integrations/{id}/logs',
    handler: handler.getIntegrationLogs.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin', 'user']
      },
      validate: {
        params: validateGetIntegrationById,
        query: validateGetIntegrationLogs,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation error',
            errors: err.details
          }).code(400);
        }
      },
      description: 'Get integration logs',
      tags: ['integrations'],
      notes: 'Retrieve logs for a specific integration'
    }
  },

  // Webhook management routes
  {
    method: 'POST',
    path: '/integrations/{integrationId}/webhooks',
    handler: handler.createWebhook.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin', 'user']
      },
      validate: {
        params: Joi.object({
          integrationId: Joi.string().uuid().required()
        }),
        payload: validateCreateWebhook,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation error',
            errors: err.details
          }).code(400);
        }
      },
      description: 'Create webhook for integration',
      tags: ['integrations', 'webhooks'],
      notes: 'Create a new webhook for an integration'
    }
  },
  {
    method: 'GET',
    path: '/integrations/{integrationId}/webhooks',
    handler: handler.getWebhooks.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin', 'user']
      },
      validate: {
        params: Joi.object({
          integrationId: Joi.string().uuid().required()
        }),
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation error',
            errors: err.details
          }).code(400);
        }
      },
      description: 'Get webhooks for integration',
      tags: ['integrations', 'webhooks'],
      notes: 'Retrieve all webhooks for a specific integration'
    }
  },
  {
    method: 'PUT',
    path: '/integrations/{integrationId}/webhooks/{webhookId}',
    handler: handler.updateWebhook.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin', 'user']
      },
      validate: {
        params: validateDeleteWebhook,
        payload: validateUpdateWebhook,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation error',
            errors: err.details
          }).code(400);
        }
      },
      description: 'Update webhook',
      tags: ['integrations', 'webhooks'],
      notes: 'Update an existing webhook'
    }
  },
  {
    method: 'DELETE',
    path: '/integrations/{integrationId}/webhooks/{webhookId}',
    handler: handler.deleteWebhook.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin']
      },
      validate: {
        params: validateDeleteWebhook,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation error',
            errors: err.details
          }).code(400);
        }
      },
      description: 'Delete webhook',
      tags: ['integrations', 'webhooks'],
      notes: 'Delete a webhook'
    }
  },

  // Bulk operations
  {
    method: 'POST',
    path: '/integrations/bulk',
    handler: handler.bulkOperation.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin']
      },
      validate: {
        payload: validateBulkOperation,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation error',
            errors: err.details
          }).code(400);
        }
      },
      description: 'Perform bulk operations on integrations',
      tags: ['integrations'],
      notes: 'Perform bulk operations like activate, deactivate, delete, sync, or test on multiple integrations'
    }
  },

  // Export/Import routes
  {
    method: 'GET',
    path: '/integrations/export',
    handler: handler.exportIntegrations.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin', 'user']
      },
      validate: {
        query: validateExportIntegrations,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation error',
            errors: err.details
          }).code(400);
        }
      },
      description: 'Export integrations',
      tags: ['integrations'],
      notes: 'Export integrations in various formats (JSON, CSV, XML)'
    }
  },
  {
    method: 'POST',
    path: '/integrations/import',
    handler: handler.importIntegrations.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin']
      },
      validate: {
        payload: validateImportIntegrations,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation error',
            errors: err.details
          }).code(400);
        }
      },
      description: 'Import integrations',
      tags: ['integrations'],
      notes: 'Import integrations from various formats (JSON, CSV, XML)'
    }
  },

  // OAuth callback route
  {
    method: 'GET',
    path: '/integrations/oauth/callback',
    handler: handler.oauthCallback.bind(handler),
    options: {
      auth: false, // No auth required for OAuth callback
      validate: {
        query: validateOauthCallback,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation error',
            errors: err.details
          }).code(400);
        }
      },
      description: 'OAuth callback endpoint',
      tags: ['integrations', 'oauth'],
      notes: 'Handle OAuth callback from external services'
    }
  },

  // API key management
  {
    method: 'POST',
    path: '/integrations/{id}/rotate-api-key',
    handler: handler.rotateApiKey.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin']
      },
      validate: {
        params: validateGetIntegrationById,
        payload: validateRotateApiKey,
        failAction: (request, h, err) => {
          return h.response({
            success: false,
            message: 'Validation error',
            errors: err.details
          }).code(400);
        }
      },
      description: 'Rotate API key',
      tags: ['integrations'],
      notes: 'Rotate the API key for an integration'
    }
  },

  // Health check route
  {
    method: 'GET',
    path: '/integrations/health',
    handler: handler.getIntegrationHealth.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin', 'user']
      },
      description: 'Get integration health status',
      tags: ['integrations'],
      notes: 'Retrieve health status of all integrations'
    }
  },

  // Cleanup routes
  {
    method: 'POST',
    path: '/integrations/cleanup/logs',
    handler: handler.cleanupLogs.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin']
      },
      description: 'Cleanup old integration logs',
      tags: ['integrations'],
      notes: 'Remove old integration logs to free up space'
    }
  },
  {
    method: 'POST',
    path: '/integrations/cleanup/sync-jobs',
    handler: handler.cleanupSyncJobs.bind(handler),
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin']
      },
      description: 'Cleanup old sync jobs',
      tags: ['integrations'],
      notes: 'Remove old sync jobs to free up space'
    }
  }
];

module.exports = createRoutes;
