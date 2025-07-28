const routes = (handler, auth) => [
  // === API DOCUMENTATION MANAGEMENT ROUTES ===
  {
    method: 'POST',
    path: '/api-docs',
    handler: handler.createAPIDoc,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['docs:create']) }
      ],
      validate: {
        payload: auth.createAPIDoc
      },
      tags: ['api-docs']
    }
  },
  {
    method: 'GET',
    path: '/api-docs',
    handler: handler.getAPIDocs,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getAPIDocs
      },
      tags: ['api-docs']
    }
  },
  {
    method: 'GET',
    path: '/api-docs/{id}',
    handler: handler.getAPIDocById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getAPIDocById
      },
      tags: ['api-docs']
    }
  },
  {
    method: 'PUT',
    path: '/api-docs/{id}',
    handler: handler.updateAPIDoc,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['docs:update']) }
      ],
      validate: {
        params: auth.getAPIDocById,
        payload: auth.updateAPIDoc
      },
      tags: ['api-docs']
    }
  },
  {
    method: 'DELETE',
    path: '/api-docs/{id}',
    handler: handler.deleteAPIDoc,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['docs:delete']) }
      ],
      validate: {
        params: auth.deleteAPIDoc
      },
      tags: ['api-docs']
    }
  },

  // === API ENDPOINT DOCUMENTATION ROUTES ===
  {
    method: 'POST',
    path: '/endpoint-docs',
    handler: handler.createEndpointDoc,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['docs:create_endpoint']) }
      ],
      validate: {
        payload: auth.createEndpointDoc
      },
      tags: ['endpoint-docs']
    }
  },
  {
    method: 'GET',
    path: '/endpoint-docs',
    handler: handler.getEndpointDocs,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getEndpointDocs
      },
      tags: ['endpoint-docs']
    }
  },
  {
    method: 'GET',
    path: '/endpoint-docs/{id}',
    handler: handler.getEndpointDocById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getEndpointDocById
      },
      tags: ['endpoint-docs']
    }
  },
  {
    method: 'PUT',
    path: '/endpoint-docs/{id}',
    handler: handler.updateEndpointDoc,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['docs:update_endpoint']) }
      ],
      validate: {
        params: auth.getEndpointDocById,
        payload: auth.updateEndpointDoc
      },
      tags: ['endpoint-docs']
    }
  },
  {
    method: 'DELETE',
    path: '/endpoint-docs/{id}',
    handler: handler.deleteEndpointDoc,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['docs:delete_endpoint']) }
      ],
      validate: {
        params: auth.deleteEndpointDoc
      },
      tags: ['endpoint-docs']
    }
  },

  // === API EXPLORER SETTINGS ROUTES ===
  {
    method: 'GET',
    path: '/explorer-settings',
    handler: handler.getExplorerSettings,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      tags: ['explorer-settings']
    }
  },
  {
    method: 'PUT',
    path: '/explorer-settings',
    handler: handler.updateExplorerSettings,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['docs:update_settings']) }
      ],
      validate: {
        payload: auth.updateExplorerSettings
      },
      tags: ['explorer-settings']
    }
  },

  // === SDK GENERATION ROUTES ===
  {
    method: 'POST',
    path: '/sdks/generate',
    handler: handler.generateSDK,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['docs:generate_sdk']) }
      ],
      validate: {
        payload: auth.generateSDK
      },
      tags: ['sdks']
    }
  },
  {
    method: 'GET',
    path: '/sdks',
    handler: handler.getSDKList,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getSDKList
      },
      tags: ['sdks']
    }
  },
  {
    method: 'GET',
    path: '/sdks/{sdk_id}/status',
    handler: handler.getSDKStatus,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getSDKStatus
      },
      tags: ['sdks']
    }
  },
  {
    method: 'GET',
    path: '/sdks/{sdk_id}/download',
    handler: handler.getSDKDownload,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getSDKDownload
      },
      tags: ['sdks']
    }
  },

  // === CODE EXAMPLES ROUTES ===
  {
    method: 'POST',
    path: '/code-examples',
    handler: handler.createCodeExample,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['docs:create_example']) }
      ],
      validate: {
        payload: auth.createCodeExample
      },
      tags: ['code-examples']
    }
  },
  {
    method: 'GET',
    path: '/code-examples',
    handler: handler.getCodeExamples,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getCodeExamples
      },
      tags: ['code-examples']
    }
  },
  {
    method: 'GET',
    path: '/code-examples/{id}',
    handler: handler.getCodeExampleById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getCodeExampleById
      },
      tags: ['code-examples']
    }
  },
  {
    method: 'PUT',
    path: '/code-examples/{id}',
    handler: handler.updateCodeExample,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['docs:update_example']) }
      ],
      validate: {
        params: auth.getCodeExampleById,
        payload: auth.updateCodeExample
      },
      tags: ['code-examples']
    }
  },
  {
    method: 'DELETE',
    path: '/code-examples/{id}',
    handler: handler.deleteCodeExample,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['docs:delete_example']) }
      ],
      validate: {
        params: auth.deleteCodeExample
      },
      tags: ['code-examples']
    }
  },

  // === DOCUMENTATION STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/docs/statistics',
    handler: handler.getDocStatistics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getDocStatistics
      },
      tags: ['docs-statistics']
    }
  },
  {
    method: 'GET',
    path: '/docs/endpoint-usage-stats',
    handler: handler.getEndpointUsageStats,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getEndpointUsageStats
      },
      tags: ['docs-statistics']
    }
  },
  {
    method: 'GET',
    path: '/docs/sdk-download-stats',
    handler: handler.getSDKDownloadStats,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getSDKDownloadStats
      },
      tags: ['docs-statistics']
    }
  }
];

module.exports = routes;
