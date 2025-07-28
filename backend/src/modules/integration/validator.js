const Joi = require('joi');

// Base validation schemas
const baseFields = {
  id: Joi.string().uuid().optional(),
  organizationId: Joi.string().uuid().required(),
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).optional(),
  isActive: Joi.boolean().default(true),
  createdAt: Joi.date().iso().optional(),
  updatedAt: Joi.date().iso().optional()
};

// Integration type fields (not schema object)
const type = Joi.string().valid('github', 'gitlab', 'bitbucket', 'slack', 'discord', 'trello', 'asana', 'jira', 'stripe', 'sendgrid', 'aws', 'google', 'microsoft', 'custom').required();
const provider = Joi.string().min(1).max(100).required();
const version = Joi.string().max(20).optional();
const category = Joi.string().valid('version-control', 'communication', 'project-management', 'payment', 'email', 'cloud-storage', 'analytics', 'custom').required();

// Authentication validation
const authenticationSchema = Joi.object({
  method: Joi.string().valid('oauth', 'api-key', 'username-password', 'token', 'webhook').required(),
  credentials: Joi.object({
    clientId: Joi.string().when('method', {
      is: 'oauth',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    clientSecret: Joi.string().when('method', {
      is: 'oauth',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    apiKey: Joi.string().when('method', {
      is: 'api-key',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    username: Joi.string().when('method', {
      is: 'username-password',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    password: Joi.string().when('method', {
      is: 'username-password',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    token: Joi.string().when('method', {
      is: 'token',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    webhookUrl: Joi.string().uri().when('method', {
      is: 'webhook',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
  }).required(),
  scopes: Joi.array().items(Joi.string()).optional(),
  redirectUri: Joi.string().uri().optional(),
  refreshToken: Joi.string().optional(),
  expiresAt: Joi.date().iso().optional()
});

// Configuration validation
const configurationSchema = Joi.object({
  settings: Joi.object().optional(),
  webhooks: Joi.array().items(Joi.object({
    event: Joi.string().required(),
    url: Joi.string().uri().required(),
    secret: Joi.string().optional(),
    isActive: Joi.boolean().default(true)
  })).optional(),
  mappings: Joi.object().optional(),
  syncSettings: Joi.object({
    autoSync: Joi.boolean().default(false),
    syncInterval: Joi.number().integer().min(1).max(1440).optional(), // minutes
    lastSyncAt: Joi.date().iso().optional(),
    syncDirection: Joi.string().valid('inbound', 'outbound', 'bidirectional').default('inbound')
  }).optional()
});

// Validation schemas for different operations
const createIntegrationSchema = Joi.object({
  ...baseFields,
  type,
  provider,
  version,
  category,
  authentication: authenticationSchema.required(),
  configuration: configurationSchema.optional(),
  metadata: Joi.object().optional()
});

const updateIntegrationSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  description: Joi.string().max(1000).optional(),
  isActive: Joi.boolean().optional(),
  authentication: authenticationSchema.optional(),
  configuration: configurationSchema.optional(),
  metadata: Joi.object().optional()
});

const getIntegrationsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().max(255).optional(),
  type: type.optional(),
  category: category.optional(),
  isActive: Joi.boolean().optional(),
  sortBy: Joi.string().valid('name', 'type', 'provider', 'createdAt', 'updatedAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

const getIntegrationByIdSchema = Joi.object({
  id: Joi.string().uuid().required()
});

const deleteIntegrationSchema = Joi.object({
  id: Joi.string().uuid().required()
});

// Test connection schema
const testConnectionSchema = Joi.object({
  id: Joi.string().uuid().required(),
  testType: Joi.string().valid('auth', 'api', 'webhook', 'sync').default('auth')
});

// Sync data schema
const syncDataSchema = Joi.object({
  id: Joi.string().uuid().required(),
  syncType: Joi.string().valid('full', 'incremental', 'manual').default('incremental'),
  direction: Joi.string().valid('inbound', 'outbound', 'bidirectional').default('inbound'),
  entities: Joi.array().items(Joi.string()).optional(), // specific entities to sync
  forceSync: Joi.boolean().default(false)
});

// Webhook management schemas
const createWebhookSchema = Joi.object({
  integrationId: Joi.string().uuid().required(),
  event: Joi.string().required(),
  url: Joi.string().uri().required(),
  secret: Joi.string().optional(),
  isActive: Joi.boolean().default(true),
  retryCount: Joi.number().integer().min(0).max(10).default(3),
  timeout: Joi.number().integer().min(1000).max(30000).default(5000) // milliseconds
});

const updateWebhookSchema = Joi.object({
  event: Joi.string().optional(),
  url: Joi.string().uri().optional(),
  secret: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  retryCount: Joi.number().integer().min(0).max(10).optional(),
  timeout: Joi.number().integer().min(1000).max(30000).optional()
});

const deleteWebhookSchema = Joi.object({
  integrationId: Joi.string().uuid().required(),
  webhookId: Joi.string().uuid().required()
});

// OAuth callback schema
const oauthCallbackSchema = Joi.object({
  integrationId: Joi.string().uuid().required(),
  code: Joi.string().required(),
  state: Joi.string().optional(),
  error: Joi.string().optional(),
  errorDescription: Joi.string().optional()
});

// API key management schema
const rotateApiKeySchema = Joi.object({
  id: Joi.string().uuid().required(),
  generateNewKey: Joi.boolean().default(true),
  revokeOldKey: Joi.boolean().default(true)
});

// Integration logs schema
const getIntegrationLogsSchema = Joi.object({
  integrationId: Joi.string().uuid().required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  level: Joi.string().valid('info', 'warning', 'error', 'debug').optional(),
  type: Joi.string().valid('auth', 'api', 'webhook', 'sync', 'error').optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  sortBy: Joi.string().valid('timestamp', 'level', 'type').default('timestamp'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

// Bulk operations schema
const bulkOperationSchema = Joi.object({
  operation: Joi.string().valid('activate', 'deactivate', 'delete', 'sync', 'test').required(),
  integrationIds: Joi.array().items(Joi.string().uuid()).min(1).max(50).required(),
  options: Joi.object().optional()
});

// Export/Import schemas
const exportIntegrationsSchema = Joi.object({
  format: Joi.string().valid('json', 'csv', 'xml').default('json'),
  includeSecrets: Joi.boolean().default(false),
  filters: Joi.object({
    type: Joi.string().optional(),
    category: Joi.string().optional(),
    isActive: Joi.boolean().optional()
  }).optional()
});

const importIntegrationsSchema = Joi.object({
  file: Joi.object().required(), // File upload
  format: Joi.string().valid('json', 'csv', 'xml').default('json'),
  overwrite: Joi.boolean().default(false),
  validateOnly: Joi.boolean().default(false)
});

// Validation functions
const validateCreateIntegration = (data) => {
  return createIntegrationSchema.validate(data, { abortEarly: false });
};

const validateUpdateIntegration = (data) => {
  return updateIntegrationSchema.validate(data, { abortEarly: false });
};

const validateGetIntegrations = (data) => {
  return getIntegrationsSchema.validate(data, { abortEarly: false });
};

const validateGetIntegrationById = (data) => {
  return getIntegrationByIdSchema.validate(data, { abortEarly: false });
};

const validateDeleteIntegration = (data) => {
  return deleteIntegrationSchema.validate(data, { abortEarly: false });
};

const validateTestConnection = (data) => {
  return testConnectionSchema.validate(data, { abortEarly: false });
};

const validateSyncData = (data) => {
  return syncDataSchema.validate(data, { abortEarly: false });
};

const validateCreateWebhook = (data) => {
  return createWebhookSchema.validate(data, { abortEarly: false });
};

const validateUpdateWebhook = (data) => {
  return updateWebhookSchema.validate(data, { abortEarly: false });
};

const validateDeleteWebhook = (data) => {
  return deleteWebhookSchema.validate(data, { abortEarly: false });
};

const validateOauthCallback = (data) => {
  return oauthCallbackSchema.validate(data, { abortEarly: false });
};

const validateRotateApiKey = (data) => {
  return rotateApiKeySchema.validate(data, { abortEarly: false });
};

const validateGetIntegrationLogs = (data) => {
  return getIntegrationLogsSchema.validate(data, { abortEarly: false });
};

const validateBulkOperation = (data) => {
  return bulkOperationSchema.validate(data, { abortEarly: false });
};

const validateExportIntegrations = (data) => {
  return exportIntegrationsSchema.validate(data, { abortEarly: false });
};

const validateImportIntegrations = (data) => {
  return importIntegrationsSchema.validate(data, { abortEarly: false });
};

module.exports = {
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
};
