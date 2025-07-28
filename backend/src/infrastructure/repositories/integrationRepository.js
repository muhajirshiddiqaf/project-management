const { v4: uuidv4 } = require('uuid');
const integrationQueries = require('../database/queries/integration');
const { encryptData, decryptData } = require('../utils/encryption');

class IntegrationRepository {
  constructor(db) {
    this.db = db;
  }

  // Create integration
  async createIntegration(integrationData) {
    const id = uuidv4();
    const {
      organizationId,
      name,
      description,
      type,
      provider,
      version,
      category,
      authentication,
      configuration,
      metadata
    } = integrationData;

    // Encrypt sensitive data
    const encryptedCredentials = authentication.credentials ?
      encryptData(JSON.stringify(authentication.credentials)) : null;

    const params = [
      id,
      organizationId,
      name,
      description,
      type,
      provider,
      version,
      category,
      authentication.method,
      encryptedCredentials,
      configuration ? JSON.stringify(configuration) : null,
      true // is_active
    ];

    try {
      const result = await this.db.query(integrationQueries.createIntegration, params);
      const integration = result.rows[0];

      // Decrypt credentials for response
      if (integration.authentication_credentials) {
        integration.authentication_credentials = JSON.parse(decryptData(integration.authentication_credentials));
      }

      return integration;
    } catch (error) {
      throw new Error(`Failed to create integration: ${error.message}`);
    }
  }

  // Get integrations with pagination and filters
  async getIntegrations(filters = {}, pagination = {}, sorting = {}) {
    try {
      const { query, params } = integrationQueries.getIntegrations(filters, pagination, sorting);
      const result = await this.db.query(query, params);

      const integrations = result.rows.map(row => {
        if (row.authentication_credentials) {
          row.authentication_credentials = JSON.parse(decryptData(row.authentication_credentials));
        }
        return row;
      });

      return {
        integrations,
        totalCount: integrations.length > 0 ? integrations[0].total_count : 0,
        page: pagination.page || 1,
        limit: pagination.limit || 10
      };
    } catch (error) {
      throw new Error(`Failed to get integrations: ${error.message}`);
    }
  }

  // Get integration by ID
  async getIntegrationById(id, organizationId) {
    try {
      const result = await this.db.query(integrationQueries.getIntegrationById, [id, organizationId]);

      if (result.rows.length === 0) {
        return null;
      }

      const integration = result.rows[0];

      // Decrypt credentials
      if (integration.authentication_credentials) {
        integration.authentication_credentials = JSON.parse(decryptData(integration.authentication_credentials));
      }

      return integration;
    } catch (error) {
      throw new Error(`Failed to get integration: ${error.message}`);
    }
  }

  // Update integration
  async updateIntegration(id, organizationId, updateData) {
    try {
      const {
        name,
        description,
        type,
        provider,
        version,
        category,
        authentication,
        configuration,
        isActive
      } = updateData;

      // Encrypt credentials if provided
      let encryptedCredentials = null;
      if (authentication && authentication.credentials) {
        encryptedCredentials = encryptData(JSON.stringify(authentication.credentials));
      }

      const params = [
        id,
        organizationId,
        name,
        description,
        type,
        provider,
        version,
        category,
        authentication ? authentication.method : null,
        encryptedCredentials,
        configuration ? JSON.stringify(configuration) : null,
        isActive
      ];

      const result = await this.db.query(integrationQueries.updateIntegration, params);

      if (result.rows.length === 0) {
        return null;
      }

      const integration = result.rows[0];

      // Decrypt credentials for response
      if (integration.authentication_credentials) {
        integration.authentication_credentials = JSON.parse(decryptData(integration.authentication_credentials));
      }

      return integration;
    } catch (error) {
      throw new Error(`Failed to update integration: ${error.message}`);
    }
  }

  // Delete integration
  async deleteIntegration(id, organizationId) {
    try {
      const result = await this.db.query(integrationQueries.deleteIntegration, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to delete integration: ${error.message}`);
    }
  }

  // Test connection
  async testConnection(id, organizationId, testStatus, testResult) {
    try {
      const result = await this.db.query(integrationQueries.testConnection, [
        id, organizationId, testStatus, JSON.stringify(testResult)
      ]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to test connection: ${error.message}`);
    }
  }

  // Sync data
  async syncData(id, organizationId, syncStatus, syncResult) {
    try {
      const result = await this.db.query(integrationQueries.syncData, [
        id, organizationId, syncStatus, JSON.stringify(syncResult)
      ]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to sync data: ${error.message}`);
    }
  }

  // Get integration statistics
  async getIntegrationStats(organizationId) {
    try {
      const result = await this.db.query(integrationQueries.getIntegrationStats, [organizationId]);
      return result.rows[0] || {};
    } catch (error) {
      throw new Error(`Failed to get integration stats: ${error.message}`);
    }
  }

  // Get integrations by type
  async getIntegrationsByType(organizationId, type) {
    try {
      const result = await this.db.query(integrationQueries.getIntegrationsByType, [organizationId, type]);

      return result.rows.map(row => {
        if (row.authentication_credentials) {
          row.authentication_credentials = JSON.parse(decryptData(row.authentication_credentials));
        }
        return row;
      });
    } catch (error) {
      throw new Error(`Failed to get integrations by type: ${error.message}`);
    }
  }

  // Get integrations by category
  async getIntegrationsByCategory(organizationId, category) {
    try {
      const result = await this.db.query(integrationQueries.getIntegrationsByCategory, [organizationId, category]);

      return result.rows.map(row => {
        if (row.authentication_credentials) {
          row.authentication_credentials = JSON.parse(decryptData(row.authentication_credentials));
        }
        return row;
      });
    } catch (error) {
      throw new Error(`Failed to get integrations by category: ${error.message}`);
    }
  }

  // Bulk update integrations
  async bulkUpdateIntegrations(integrationIds, updates) {
    try {
      const { query, params } = integrationQueries.bulkUpdateIntegrations(integrationIds, updates);
      const result = await this.db.query(query, params);

      return result.rows.map(row => {
        if (row.authentication_credentials) {
          row.authentication_credentials = JSON.parse(decryptData(row.authentication_credentials));
        }
        return row;
      });
    } catch (error) {
      throw new Error(`Failed to bulk update integrations: ${error.message}`);
    }
  }

  // Bulk delete integrations
  async bulkDeleteIntegrations(integrationIds, organizationId) {
    try {
      const result = await this.db.query(integrationQueries.bulkDeleteIntegrations, [integrationIds, organizationId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to bulk delete integrations: ${error.message}`);
    }
  }

  // Check integration name uniqueness
  async checkIntegrationNameUnique(organizationId, name, excludeId = null) {
    try {
      const result = await this.db.query(integrationQueries.checkIntegrationNameUnique, [
        organizationId, name, excludeId
      ]);
      return result.rows[0].count === 0;
    } catch (error) {
      throw new Error(`Failed to check integration name uniqueness: ${error.message}`);
    }
  }

  // Get integration logs
  async getIntegrationLogs(filters = {}, pagination = {}) {
    try {
      const { query, params } = integrationQueries.getIntegrationLogs(filters, pagination);
      const result = await this.db.query(query, params);

      return {
        logs: result.rows,
        totalCount: result.rows.length > 0 ? result.rows[0].total_count : 0,
        page: pagination.page || 1,
        limit: pagination.limit || 20
      };
    } catch (error) {
      throw new Error(`Failed to get integration logs: ${error.message}`);
    }
  }

  // Create integration log
  async createIntegrationLog(logData) {
    const id = uuidv4();
    const {
      integrationId,
      level,
      type,
      message,
      details
    } = logData;

    try {
      const result = await this.db.query(integrationQueries.createIntegrationLog, [
        id, integrationId, level, type, message, JSON.stringify(details)
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create integration log: ${error.message}`);
    }
  }

  // Webhook operations
  async createWebhook(webhookData) {
    const id = uuidv4();
    const {
      integrationId,
      event,
      url,
      secret,
      isActive,
      retryCount,
      timeout
    } = webhookData;

    try {
      const result = await this.db.query(integrationQueries.createWebhook, [
        id, integrationId, event, url, secret, isActive, retryCount, timeout
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create webhook: ${error.message}`);
    }
  }

  async getWebhooks(integrationId) {
    try {
      const result = await this.db.query(integrationQueries.getWebhooks, [integrationId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to get webhooks: ${error.message}`);
    }
  }

  async getWebhookById(webhookId, integrationId) {
    try {
      const result = await this.db.query(integrationQueries.getWebhookById, [webhookId, integrationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to get webhook: ${error.message}`);
    }
  }

  async updateWebhook(webhookId, integrationId, updateData) {
    try {
      const {
        event,
        url,
        secret,
        isActive,
        retryCount,
        timeout
      } = updateData;

      const result = await this.db.query(integrationQueries.updateWebhook, [
        webhookId, integrationId, event, url, secret, isActive, retryCount, timeout
      ]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to update webhook: ${error.message}`);
    }
  }

  async deleteWebhook(webhookId, integrationId) {
    try {
      const result = await this.db.query(integrationQueries.deleteWebhook, [webhookId, integrationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to delete webhook: ${error.message}`);
    }
  }

  // OAuth operations
  async createOAuthToken(tokenData) {
    const id = uuidv4();
    const {
      integrationId,
      accessToken,
      refreshToken,
      tokenType,
      expiresAt
    } = tokenData;

    try {
      const result = await this.db.query(integrationQueries.createOAuthToken, [
        id, integrationId, accessToken, refreshToken, tokenType, expiresAt
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create OAuth token: ${error.message}`);
    }
  }

  async getOAuthToken(integrationId) {
    try {
      const result = await this.db.query(integrationQueries.getOAuthToken, [integrationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to get OAuth token: ${error.message}`);
    }
  }

  async updateOAuthToken(integrationId, tokenId, updateData) {
    try {
      const {
        accessToken,
        refreshToken,
        expiresAt
      } = updateData;

      const result = await this.db.query(integrationQueries.updateOAuthToken, [
        integrationId, tokenId, accessToken, refreshToken, expiresAt
      ]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to update OAuth token: ${error.message}`);
    }
  }

  // API Key operations
  async createApiKey(apiKeyData) {
    const id = uuidv4();
    const {
      integrationId,
      keyName,
      keyValue,
      permissions,
      expiresAt
    } = apiKeyData;

    try {
      const result = await this.db.query(integrationQueries.createApiKey, [
        id, integrationId, keyName, keyValue, JSON.stringify(permissions), expiresAt
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create API key: ${error.message}`);
    }
  }

  async getApiKeys(integrationId) {
    try {
      const result = await this.db.query(integrationQueries.getApiKeys, [integrationId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to get API keys: ${error.message}`);
    }
  }

  async revokeApiKey(apiKeyId, integrationId) {
    try {
      const result = await this.db.query(integrationQueries.revokeApiKey, [apiKeyId, integrationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to revoke API key: ${error.message}`);
    }
  }

  // Sync operations
  async createSyncJob(syncJobData) {
    const id = uuidv4();
    const {
      integrationId,
      syncType,
      direction,
      status,
      entities
    } = syncJobData;

    try {
      const result = await this.db.query(integrationQueries.createSyncJob, [
        id, integrationId, syncType, direction, status, JSON.stringify(entities)
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create sync job: ${error.message}`);
    }
  }

  async updateSyncJob(syncJobId, integrationId, status, result) {
    try {
      const syncResult = await this.db.query(integrationQueries.updateSyncJob, [
        syncJobId, integrationId, status, JSON.stringify(result)
      ]);
      return syncResult.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to update sync job: ${error.message}`);
    }
  }

  async getSyncJobs(integrationId, limit = 10) {
    try {
      const result = await this.db.query(integrationQueries.getSyncJobs, [integrationId, limit]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to get sync jobs: ${error.message}`);
    }
  }

  // Export/Import operations
  async getIntegrationsForExport(filters = {}) {
    try {
      const { query, params } = integrationQueries.getIntegrationsForExport(filters);
      const result = await this.db.query(query, params);

      return result.rows.map(row => {
        if (row.authentication_credentials) {
          row.authentication_credentials = JSON.parse(decryptData(row.authentication_credentials));
        }
        return row;
      });
    } catch (error) {
      throw new Error(`Failed to get integrations for export: ${error.message}`);
    }
  }

  // Cleanup operations
  async cleanupOldLogs() {
    try {
      const result = await this.db.query(integrationQueries.cleanupOldLogs);
      return result.rowCount;
    } catch (error) {
      throw new Error(`Failed to cleanup old logs: ${error.message}`);
    }
  }

  async cleanupOldSyncJobs() {
    try {
      const result = await this.db.query(integrationQueries.cleanupOldSyncJobs);
      return result.rowCount;
    } catch (error) {
      throw new Error(`Failed to cleanup old sync jobs: ${error.message}`);
    }
  }

  // Health check
  async getIntegrationHealth(organizationId) {
    try {
      const result = await this.db.query(integrationQueries.getIntegrationHealth, [organizationId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to get integration health: ${error.message}`);
    }
  }
}

module.exports = IntegrationRepository;
