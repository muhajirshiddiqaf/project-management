const docsHandler = require('./handler');
const docsValidator = require('./validator');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // === API DOCUMENTATION MANAGEMENT ROUTES ===
  {
    method: 'POST',
    path: '/api-docs',
    handler: docsHandler.createAPIDoc,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['docs:create']) }
      ],
      validate: {
        payload: docsValidator.createAPIDoc
      },
      tags: ['api-docs']
    }
  },
  {
    method: 'GET',
    path: '/api-docs',
    handler: docsHandler.getAPIDocs,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: docsValidator.getAPIDocs
      },
      tags: ['api-docs']
    }
  },
  {
    method: 'GET',
    path: '/api-docs/{id}',
    handler: docsHandler.getAPIDocById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: docsValidator.getAPIDocById
      },
      tags: ['api-docs']
    }
  },
  {
    method: 'PUT',
    path: '/api-docs/{id}',
    handler: docsHandler.updateAPIDoc,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['docs:update']) }
      ],
      validate: {
        params: docsValidator.getAPIDocById,
        payload: docsValidator.updateAPIDoc
      },
      tags: ['api-docs']
    }
  },
  {
    method: 'DELETE',
    path: '/api-docs/{id}',
    handler: docsHandler.deleteAPIDoc,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['docs:delete']) }
      ],
      validate: {
        params: docsValidator.deleteAPIDoc
      },
      tags: ['api-docs']
    }
  },

  // === API ENDPOINT DOCUMENTATION ROUTES ===
  {
    method: 'POST',
    path: '/endpoint-docs',
    handler: docsHandler.createEndpointDoc,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['docs:create_endpoint']) }
      ],
      validate: {
        payload: docsValidator.createEndpointDoc
      },
      tags: ['endpoint-docs']
    }
  },
  {
    method: 'GET',
    path: '/endpoint-docs',
    handler: docsHandler.getEndpointDocs,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: docsValidator.getEndpointDocs
      },
      tags: ['endpoint-docs']
    }
  },
  {
    method: 'GET',
    path: '/endpoint-docs/{id}',
    handler: docsHandler.getEndpointDocById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: docsValidator.getEndpointDocById
      },
      tags: ['endpoint-docs']
    }
  },
  {
    method: 'PUT',
    path: '/endpoint-docs/{id}',
    handler: docsHandler.updateEndpointDoc,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['docs:update_endpoint']) }
      ],
      validate: {
        params: docsValidator.getEndpointDocById,
        payload: docsValidator.updateEndpointDoc
      },
      tags: ['endpoint-docs']
    }
  },
  {
    method: 'DELETE',
    path: '/endpoint-docs/{id}',
    handler: docsHandler.deleteEndpointDoc,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['docs:delete_endpoint']) }
      ],
      validate: {
        params: docsValidator.deleteEndpointDoc
      },
      tags: ['endpoint-docs']
    }
  },

  // === API EXPLORER SETTINGS ROUTES ===
  {
    method: 'GET',
    path: '/explorer-settings',
    handler: docsHandler.getExplorerSettings,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        payload: docsValidator.getExplorerSettings
      },
      tags: ['explorer-settings']
    }
  },
  {
    method: 'PUT',
    path: '/explorer-settings',
    handler: docsHandler.updateExplorerSettings,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['docs:update_settings']) }
      ],
      validate: {
        payload: docsValidator.updateExplorerSettings
      },
      tags: ['explorer-settings']
    }
  },

  // === SDK GENERATION ROUTES ===
  {
    method: 'POST',
    path: '/sdks/generate',
    handler: docsHandler.generateSDK,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['docs:generate_sdk']) }
      ],
      validate: {
        payload: docsValidator.generateSDK
      },
      tags: ['sdks']
    }
  },
  {
    method: 'GET',
    path: '/sdks',
    handler: docsHandler.getSDKList,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: docsValidator.getSDKList
      },
      tags: ['sdks']
    }
  },
  {
    method: 'GET',
    path: '/sdks/{sdk_id}/status',
    handler: docsHandler.getSDKStatus,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: docsValidator.getSDKStatus
      },
      tags: ['sdks']
    }
  },
  {
    method: 'GET',
    path: '/sdks/{sdk_id}/download',
    handler: docsHandler.getSDKDownload,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: docsValidator.getSDKDownload
      },
      tags: ['sdks']
    }
  },

  // === CODE EXAMPLES ROUTES ===
  {
    method: 'POST',
    path: '/code-examples',
    handler: docsHandler.createCodeExample,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['docs:create_example']) }
      ],
      validate: {
        payload: docsValidator.createCodeExample
      },
      tags: ['code-examples']
    }
  },
  {
    method: 'GET',
    path: '/code-examples',
    handler: docsHandler.getCodeExamples,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: docsValidator.getCodeExamples
      },
      tags: ['code-examples']
    }
  },
  {
    method: 'GET',
    path: '/code-examples/{id}',
    handler: docsHandler.getCodeExampleById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: docsValidator.getCodeExampleById
      },
      tags: ['code-examples']
    }
  },
  {
    method: 'PUT',
    path: '/code-examples/{id}',
    handler: docsHandler.updateCodeExample,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['docs:update_example']) }
      ],
      validate: {
        params: docsValidator.getCodeExampleById,
        payload: docsValidator.updateCodeExample
      },
      tags: ['code-examples']
    }
  },
  {
    method: 'DELETE',
    path: '/code-examples/{id}',
    handler: docsHandler.deleteCodeExample,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['docs:delete_example']) }
      ],
      validate: {
        params: docsValidator.deleteCodeExample
      },
      tags: ['code-examples']
    }
  },

  // === DOCUMENTATION STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/docs/statistics',
    handler: docsHandler.getDocStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: docsValidator.getDocStatistics
      },
      tags: ['docs-statistics']
    }
  },
  {
    method: 'GET',
    path: '/docs/endpoint-usage-stats',
    handler: docsHandler.getEndpointUsageStats,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: docsValidator.getEndpointUsageStats
      },
      tags: ['docs-statistics']
    }
  },
  {
    method: 'GET',
    path: '/docs/sdk-download-stats',
    handler: docsHandler.getSDKDownloadStats,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: docsValidator.getSDKDownloadStats
      },
      tags: ['docs-statistics']
    }
  }
];

module.exports = routes;
