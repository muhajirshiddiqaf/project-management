const Joi = require('@hapi/joi');

const docsSchemas = {
  // === API DOCUMENTATION MANAGEMENT ===
  createAPIDoc: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(1000).optional(),
    version: Joi.string().pattern(/^\d+\.\d+\.\d+$/).required(),
    base_url: Joi.string().uri().required(),
    contact_email: Joi.string().email().optional(),
    contact_name: Joi.string().max(100).optional(),
    license: Joi.string().max(100).optional(),
    terms_of_service: Joi.string().uri().optional(),
    is_active: Joi.boolean().default(true)
  }),

  updateAPIDoc: Joi.object({
    title: Joi.string().min(3).max(200).optional(),
    description: Joi.string().max(1000).optional(),
    version: Joi.string().pattern(/^\d+\.\d+\.\d+$/).optional(),
    base_url: Joi.string().uri().optional(),
    contact_email: Joi.string().email().optional(),
    contact_name: Joi.string().max(100).optional(),
    license: Joi.string().max(100).optional(),
    terms_of_service: Joi.string().uri().optional(),
    is_active: Joi.boolean().optional()
  }),

  getAPIDocById: Joi.object({
    id: Joi.string().uuid().required()
  }),

  getAPIDocs: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).optional(),
    version: Joi.string().optional(),
    is_active: Joi.boolean().optional(),
    sort_by: Joi.string().valid('created_at', 'updated_at', 'title', 'version').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  deleteAPIDoc: Joi.object({
    id: Joi.string().uuid().required()
  }),

  // === API ENDPOINT DOCUMENTATION ===
  createEndpointDoc: Joi.object({
    api_doc_id: Joi.string().uuid().required(),
    path: Joi.string().required(),
    method: Joi.string().valid('GET', 'POST', 'PUT', 'DELETE', 'PATCH').required(),
    summary: Joi.string().max(200).required(),
    description: Joi.string().max(1000).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    parameters: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      in: Joi.string().valid('query', 'path', 'header', 'body').required(),
      description: Joi.string().optional(),
      required: Joi.boolean().default(false),
      type: Joi.string().valid('string', 'number', 'boolean', 'array', 'object').required(),
      format: Joi.string().optional(),
      example: Joi.any().optional()
    })).optional(),
    request_body: Joi.object({
      description: Joi.string().optional(),
      required: Joi.boolean().default(false),
      content: Joi.object().optional()
    }).optional(),
    responses: Joi.array().items(Joi.object({
      code: Joi.number().integer().min(100).max(599).required(),
      description: Joi.string().required(),
      schema: Joi.object().optional(),
      examples: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        value: Joi.any().required()
      })).optional()
    })).optional(),
    is_deprecated: Joi.boolean().default(false),
    deprecated_since: Joi.date().optional(),
    deprecated_reason: Joi.string().optional()
  }),

  updateEndpointDoc: Joi.object({
    path: Joi.string().optional(),
    method: Joi.string().valid('GET', 'POST', 'PUT', 'DELETE', 'PATCH').optional(),
    summary: Joi.string().max(200).optional(),
    description: Joi.string().max(1000).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    parameters: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      in: Joi.string().valid('query', 'path', 'header', 'body').required(),
      description: Joi.string().optional(),
      required: Joi.boolean().default(false),
      type: Joi.string().valid('string', 'number', 'boolean', 'array', 'object').required(),
      format: Joi.string().optional(),
      example: Joi.any().optional()
    })).optional(),
    request_body: Joi.object({
      description: Joi.string().optional(),
      required: Joi.boolean().default(false),
      content: Joi.object().optional()
    }).optional(),
    responses: Joi.array().items(Joi.object({
      code: Joi.number().integer().min(100).max(599).required(),
      description: Joi.string().required(),
      schema: Joi.object().optional(),
      examples: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        value: Joi.any().required()
      })).optional()
    })).optional(),
    is_deprecated: Joi.boolean().optional(),
    deprecated_since: Joi.date().optional(),
    deprecated_reason: Joi.string().optional()
  }),

  getEndpointDocById: Joi.object({
    id: Joi.string().uuid().required()
  }),

  getEndpointDocs: Joi.object({
    api_doc_id: Joi.string().uuid().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).optional(),
    method: Joi.string().valid('GET', 'POST', 'PUT', 'DELETE', 'PATCH').optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    is_deprecated: Joi.boolean().optional(),
    sort_by: Joi.string().valid('created_at', 'updated_at', 'path', 'method').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  deleteEndpointDoc: Joi.object({
    id: Joi.string().uuid().required()
  }),

  // === API EXPLORER SETTINGS ===
  updateExplorerSettings: Joi.object({
    enable_swagger_ui: Joi.boolean().default(true),
    enable_redoc: Joi.boolean().default(true),
    enable_postman_collection: Joi.boolean().default(true),
    enable_insomnia_collection: Joi.boolean().default(false),
    enable_curl_examples: Joi.boolean().default(true),
    enable_code_samples: Joi.boolean().default(true),
    supported_languages: Joi.array().items(Joi.string().valid('javascript', 'python', 'php', 'java', 'csharp', 'ruby', 'go', 'swift', 'kotlin')).default(['javascript', 'python', 'php']),
    theme: Joi.string().valid('light', 'dark', 'auto').default('light'),
    show_authentication: Joi.boolean().default(true),
    show_rate_limits: Joi.boolean().default(true),
    show_deprecated_endpoints: Joi.boolean().default(false)
  }),

  getExplorerSettings: Joi.object({
    // No payload required for getting explorer settings
  }),

  // === SDK GENERATION ===
  generateSDK: Joi.object({
    language: Joi.string().valid('javascript', 'python', 'php', 'java', 'csharp', 'ruby', 'go', 'swift', 'kotlin').required(),
    package_name: Joi.string().pattern(/^[a-z][a-z0-9_-]*$/).optional(),
    version: Joi.string().pattern(/^\d+\.\d+\.\d+$/).optional(),
    include_examples: Joi.boolean().default(true),
    include_tests: Joi.boolean().default(false),
    include_documentation: Joi.boolean().default(true),
    custom_config: Joi.object().optional()
  }),

  getSDKStatus: Joi.object({
    sdk_id: Joi.string().uuid().required()
  }),

  getSDKDownload: Joi.object({
    sdk_id: Joi.string().uuid().required()
  }),

  getSDKList: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    language: Joi.string().valid('javascript', 'python', 'php', 'java', 'csharp', 'ruby', 'go', 'swift', 'kotlin').optional(),
    status: Joi.string().valid('pending', 'generating', 'completed', 'failed').optional(),
    sort_by: Joi.string().valid('created_at', 'updated_at', 'language').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // === CODE EXAMPLES ===
  createCodeExample: Joi.object({
    endpoint_doc_id: Joi.string().uuid().required(),
    language: Joi.string().valid('javascript', 'python', 'php', 'java', 'csharp', 'ruby', 'go', 'swift', 'kotlin').required(),
    title: Joi.string().max(200).required(),
    description: Joi.string().max(500).optional(),
    code: Joi.string().required(),
    is_public: Joi.boolean().default(true),
    tags: Joi.array().items(Joi.string()).optional()
  }),

  updateCodeExample: Joi.object({
    title: Joi.string().max(200).optional(),
    description: Joi.string().max(500).optional(),
    code: Joi.string().optional(),
    is_public: Joi.boolean().optional(),
    tags: Joi.array().items(Joi.string()).optional()
  }),

  getCodeExampleById: Joi.object({
    id: Joi.string().uuid().required()
  }),

  getCodeExamples: Joi.object({
    endpoint_doc_id: Joi.string().uuid().optional(),
    language: Joi.string().valid('javascript', 'python', 'php', 'java', 'csharp', 'ruby', 'go', 'swift', 'kotlin').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    is_public: Joi.boolean().optional(),
    sort_by: Joi.string().valid('created_at', 'updated_at', 'title', 'language').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  }),

  deleteCodeExample: Joi.object({
    id: Joi.string().uuid().required()
  }),

  // === DOCUMENTATION STATISTICS ===
  getDocStatistics: Joi.object({
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    group_by: Joi.string().valid('day', 'week', 'month').default('day')
  }),

  getEndpointUsageStats: Joi.object({
    endpoint_doc_id: Joi.string().uuid().optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    group_by: Joi.string().valid('day', 'week', 'month').default('day')
  }),

  getSDKDownloadStats: Joi.object({
    sdk_id: Joi.string().uuid().optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    group_by: Joi.string().valid('day', 'week', 'month').default('day')
  })
};

module.exports = docsSchemas;
