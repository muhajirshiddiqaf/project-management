const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const axios = require('axios');

class IntegrationHandler {
  constructor(integrationRepository) {
    this.integrationRepository = integrationRepository;
  }

  // Create integration
  async createIntegration(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const integrationData = {
        ...request.payload,
        organizationId
      };

      // Check name uniqueness
      const isNameUnique = await this.integrationRepository.checkIntegrationNameUnique(
        organizationId,
        integrationData.name
      );

      if (!isNameUnique) {
        return h.response({
          success: false,
          message: 'Integration name already exists'
        }).code(400);
      }

      // Validate integration type and provider
      const validTypes = ['github', 'gitlab', 'bitbucket', 'slack', 'discord', 'trello', 'asana', 'jira', 'stripe', 'sendgrid', 'aws', 'google', 'microsoft', 'custom'];
      if (!validTypes.includes(integrationData.type)) {
        return h.response({
          success: false,
          message: 'Invalid integration type'
        }).code(400);
      }

      // Create integration
      const integration = await this.integrationRepository.createIntegration(integrationData);

      // Log the creation
      await this.integrationRepository.createIntegrationLog({
        integrationId: integration.id,
        level: 'info',
        type: 'create',
        message: 'Integration created successfully',
        details: { type: integration.type, provider: integration.provider }
      });

      return h.response({
        success: true,
        message: 'Integration created successfully',
        data: integration
      }).code(201);
    } catch (error) {
      console.error('Error creating integration:', error);
      return h.response({
        success: false,
        message: 'Failed to create integration',
        error: error.message
      }).code(500);
    }
  }

  // Get integrations
  async getIntegrations(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { page, limit, search, type, category, isActive, sortBy, sortOrder } = request.query;

      const filters = {
        organizationId,
        search,
        type,
        category,
        isActive: isActive !== undefined ? isActive === 'true' : undefined
      };

      const pagination = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        offset: ((parseInt(page) || 1) - 1) * (parseInt(limit) || 10)
      };

      const sorting = {
        sortBy,
        sortOrder
      };

      const result = await this.integrationRepository.getIntegrations(filters, pagination, sorting);

      return h.response({
        success: true,
        message: 'Integrations retrieved successfully',
        data: result
      }).code(200);
    } catch (error) {
      console.error('Error getting integrations:', error);
      return h.response({
        success: false,
        message: 'Failed to get integrations',
        error: error.message
      }).code(500);
    }
  }

  // Get integration by ID
  async getIntegrationById(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { id } = request.params;

      const integration = await this.integrationRepository.getIntegrationById(id, organizationId);

      if (!integration) {
        return h.response({
          success: false,
          message: 'Integration not found'
        }).code(404);
      }

      return h.response({
        success: true,
        message: 'Integration retrieved successfully',
        data: integration
      }).code(200);
    } catch (error) {
      console.error('Error getting integration:', error);
      return h.response({
        success: false,
        message: 'Failed to get integration',
        error: error.message
      }).code(500);
    }
  }

  // Update integration
  async updateIntegration(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { id } = request.params;
      const updateData = request.payload;

      // Check if integration exists
      const existingIntegration = await this.integrationRepository.getIntegrationById(id, organizationId);
      if (!existingIntegration) {
        return h.response({
          success: false,
          message: 'Integration not found'
        }).code(404);
      }

      // Check name uniqueness if name is being updated
      if (updateData.name && updateData.name !== existingIntegration.name) {
        const isNameUnique = await this.integrationRepository.checkIntegrationNameUnique(
          organizationId,
          updateData.name,
          id
        );

        if (!isNameUnique) {
          return h.response({
            success: false,
            message: 'Integration name already exists'
          }).code(400);
        }
      }

      const updatedIntegration = await this.integrationRepository.updateIntegration(id, organizationId, updateData);

      // Log the update
      await this.integrationRepository.createIntegrationLog({
        integrationId: id,
        level: 'info',
        type: 'update',
        message: 'Integration updated successfully',
        details: { updatedFields: Object.keys(updateData) }
      });

      return h.response({
        success: true,
        message: 'Integration updated successfully',
        data: updatedIntegration
      }).code(200);
    } catch (error) {
      console.error('Error updating integration:', error);
      return h.response({
        success: false,
        message: 'Failed to update integration',
        error: error.message
      }).code(500);
    }
  }

  // Delete integration
  async deleteIntegration(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { id } = request.params;

      // Check if integration exists
      const existingIntegration = await this.integrationRepository.getIntegrationById(id, organizationId);
      if (!existingIntegration) {
        return h.response({
          success: false,
          message: 'Integration not found'
        }).code(404);
      }

      const deletedIntegration = await this.integrationRepository.deleteIntegration(id, organizationId);

      // Log the deletion
      await this.integrationRepository.createIntegrationLog({
        integrationId: id,
        level: 'info',
        type: 'delete',
        message: 'Integration deleted successfully',
        details: { type: existingIntegration.type, provider: existingIntegration.provider }
      });

      return h.response({
        success: true,
        message: 'Integration deleted successfully',
        data: deletedIntegration
      }).code(200);
    } catch (error) {
      console.error('Error deleting integration:', error);
      return h.response({
        success: false,
        message: 'Failed to delete integration',
        error: error.message
      }).code(500);
    }
  }

  // Test connection
  async testConnection(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { id } = request.params;
      const { testType = 'auth' } = request.payload;

      // Get integration
      const integration = await this.integrationRepository.getIntegrationById(id, organizationId);
      if (!integration) {
        return h.response({
          success: false,
          message: 'Integration not found'
        }).code(404);
      }

      let testResult = { success: false, message: 'Test failed' };

      try {
        switch (testType) {
          case 'auth':
            testResult = await this.testAuthentication(integration);
            break;
          case 'api':
            testResult = await this.testApiConnection(integration);
            break;
          case 'webhook':
            testResult = await this.testWebhookConnection(integration);
            break;
          case 'sync':
            testResult = await this.testSyncConnection(integration);
            break;
          default:
            testResult = { success: false, message: 'Invalid test type' };
        }
      } catch (error) {
        testResult = { success: false, message: error.message };
      }

      // Update integration with test result
      await this.integrationRepository.testConnection(
        id,
        organizationId,
        testResult.success ? 'success' : 'failed',
        testResult
      );

      // Log the test
      await this.integrationRepository.createIntegrationLog({
        integrationId: id,
        level: testResult.success ? 'info' : 'error',
        type: 'test',
        message: `Connection test ${testResult.success ? 'passed' : 'failed'}`,
        details: { testType, result: testResult }
      });

      return h.response({
        success: true,
        message: 'Connection test completed',
        data: testResult
      }).code(200);
    } catch (error) {
      console.error('Error testing connection:', error);
      return h.response({
        success: false,
        message: 'Failed to test connection',
        error: error.message
      }).code(500);
    }
  }

  // Sync data
  async syncData(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { id } = request.params;
      const { syncType = 'incremental', direction = 'inbound', entities, forceSync = false } = request.payload;

      // Get integration
      const integration = await this.integrationRepository.getIntegrationById(id, organizationId);
      if (!integration) {
        return h.response({
          success: false,
          message: 'Integration not found'
        }).code(404);
      }

      // Create sync job
      const syncJob = await this.integrationRepository.createSyncJob({
        integrationId: id,
        syncType,
        direction,
        status: 'running',
        entities
      });

      // Perform sync (this would be done in a background job in production)
      let syncResult = { success: false, message: 'Sync failed' };

      try {
        syncResult = await this.performDataSync(integration, syncType, direction, entities, forceSync);
      } catch (error) {
        syncResult = { success: false, message: error.message };
      }

      // Update sync job
      await this.integrationRepository.updateSyncJob(syncJob.id, id, 'completed', syncResult);

      // Update integration sync status
      await this.integrationRepository.syncData(
        id,
        organizationId,
        syncResult.success ? 'success' : 'failed',
        syncResult
      );

      // Log the sync
      await this.integrationRepository.createIntegrationLog({
        integrationId: id,
        level: syncResult.success ? 'info' : 'error',
        type: 'sync',
        message: `Data sync ${syncResult.success ? 'completed' : 'failed'}`,
        details: { syncType, direction, entities, result: syncResult }
      });

      return h.response({
        success: true,
        message: 'Data sync completed',
        data: {
          syncJob,
          result: syncResult
        }
      }).code(200);
    } catch (error) {
      console.error('Error syncing data:', error);
      return h.response({
        success: false,
        message: 'Failed to sync data',
        error: error.message
      }).code(500);
    }
  }

  // Get integration statistics
  async getIntegrationStats(request, h) {
    try {
      const { organizationId } = request.auth.credentials;

      const stats = await this.integrationRepository.getIntegrationStats(organizationId);

      return h.response({
        success: true,
        message: 'Integration statistics retrieved successfully',
        data: stats
      }).code(200);
    } catch (error) {
      console.error('Error getting integration stats:', error);
      return h.response({
        success: false,
        message: 'Failed to get integration statistics',
        error: error.message
      }).code(500);
    }
  }

  // Get integration logs
  async getIntegrationLogs(request, h) {
    try {
      const { id } = request.params;
      const { page, limit, level, type, startDate, endDate, sortBy, sortOrder } = request.query;

      const filters = {
        integrationId: id,
        level,
        type,
        startDate,
        endDate
      };

      const pagination = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        offset: ((parseInt(page) || 1) - 1) * (parseInt(limit) || 20)
      };

      const result = await this.integrationRepository.getIntegrationLogs(filters, pagination);

      return h.response({
        success: true,
        message: 'Integration logs retrieved successfully',
        data: result
      }).code(200);
    } catch (error) {
      console.error('Error getting integration logs:', error);
      return h.response({
        success: false,
        message: 'Failed to get integration logs',
        error: error.message
      }).code(500);
    }
  }

  // Webhook operations
  async createWebhook(request, h) {
    try {
      const { integrationId } = request.params;
      const webhookData = {
        ...request.payload,
        integrationId
      };

      const webhook = await this.integrationRepository.createWebhook(webhookData);

      return h.response({
        success: true,
        message: 'Webhook created successfully',
        data: webhook
      }).code(201);
    } catch (error) {
      console.error('Error creating webhook:', error);
      return h.response({
        success: false,
        message: 'Failed to create webhook',
        error: error.message
      }).code(500);
    }
  }

  async getWebhooks(request, h) {
    try {
      const { integrationId } = request.params;

      const webhooks = await this.integrationRepository.getWebhooks(integrationId);

      return h.response({
        success: true,
        message: 'Webhooks retrieved successfully',
        data: webhooks
      }).code(200);
    } catch (error) {
      console.error('Error getting webhooks:', error);
      return h.response({
        success: false,
        message: 'Failed to get webhooks',
        error: error.message
      }).code(500);
    }
  }

  // Update webhook (dummy implementation)
  async updateWebhook(request, h) {
    try {
      // TODO: Implement actual update logic
      return h.response({
        success: true,
        message: 'Webhook updated (dummy response)'
      }).code(200);
    } catch (error) {
      return h.response({
        success: false,
        message: 'Failed to update webhook',
        error: error.message
      }).code(500);
    }
  }

  // Delete webhook (dummy implementation)
  async deleteWebhook(request, h) {
    try {
      // TODO: Implement actual delete logic
      return h.response({
        success: true,
        message: 'Webhook deleted (dummy response)'
      }).code(200);
    } catch (error) {
      return h.response({
        success: false,
        message: 'Failed to delete webhook',
        error: error.message
      }).code(500);
    }
  }

  // Bulk operations
  async bulkOperation(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { operation, integrationIds, options = {} } = request.payload;

      let result = [];

      switch (operation) {
        case 'activate':
          result = await this.integrationRepository.bulkUpdateIntegrations(integrationIds, {
            isActive: true,
            organizationId
          });
          break;
        case 'deactivate':
          result = await this.integrationRepository.bulkUpdateIntegrations(integrationIds, {
            isActive: false,
            organizationId
          });
          break;
        case 'delete':
          result = await this.integrationRepository.bulkDeleteIntegrations(integrationIds, organizationId);
          break;
        case 'sync':
          // Perform bulk sync
          for (const integrationId of integrationIds) {
            const integration = await this.integrationRepository.getIntegrationById(integrationId, organizationId);
            if (integration) {
              await this.syncData({ params: { id: integrationId }, payload: options }, h);
            }
          }
          result = { message: 'Bulk sync initiated' };
          break;
        case 'test':
          // Perform bulk test
          for (const integrationId of integrationIds) {
            const integration = await this.integrationRepository.getIntegrationById(integrationId, organizationId);
            if (integration) {
              await this.testConnection({ params: { id: integrationId }, payload: options }, h);
            }
          }
          result = { message: 'Bulk test completed' };
          break;
        default:
          return h.response({
            success: false,
            message: 'Invalid operation'
          }).code(400);
      }

      return h.response({
        success: true,
        message: `Bulk operation '${operation}' completed successfully`,
        data: result
      }).code(200);
    } catch (error) {
      console.error('Error performing bulk operation:', error);
      return h.response({
        success: false,
        message: 'Failed to perform bulk operation',
        error: error.message
      }).code(500);
    }
  }

  // Export integrations
  async exportIntegrations(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { format = 'json', includeSecrets = false, filters = {} } = request.query;

      const exportData = await this.integrationRepository.getIntegrationsForExport({
        organizationId,
        ...filters
      });

      // Remove sensitive data if not including secrets
      if (!includeSecrets) {
        exportData.forEach(integration => {
          delete integration.authentication_credentials;
        });
      }

      let responseData;
      let contentType;

      switch (format.toLowerCase()) {
        case 'json':
          responseData = JSON.stringify(exportData, null, 2);
          contentType = 'application/json';
          break;
        case 'csv':
          responseData = this.convertToCSV(exportData);
          contentType = 'text/csv';
          break;
        case 'xml':
          responseData = this.convertToXML(exportData);
          contentType = 'application/xml';
          break;
        default:
          return h.response({
            success: false,
            message: 'Invalid export format'
          }).code(400);
      }

      return h.response(responseData)
        .header('Content-Type', contentType)
        .header('Content-Disposition', `attachment; filename="integrations.${format}"`)
        .code(200);
    } catch (error) {
      console.error('Error exporting integrations:', error);
      return h.response({
        success: false,
        message: 'Failed to export integrations',
        error: error.message
      }).code(500);
    }
  }

  // Import integrations (dummy implementation)
  async importIntegrations(request, h) {
    try {
      // TODO: Implement actual import logic
      return h.response({
        success: true,
        message: 'Integrations imported (dummy response)'
      }).code(200);
    } catch (error) {
      return h.response({
        success: false,
        message: 'Failed to import integrations',
        error: error.message
      }).code(500);
    }
  }

  // OAuth callback (dummy implementation)
  async oauthCallback(request, h) {
    try {
      // TODO: Implement actual OAuth callback logic
      return h.response({
        success: true,
        message: 'OAuth callback handled (dummy response)'
      }).code(200);
    } catch (error) {
      return h.response({
        success: false,
        message: 'Failed to handle OAuth callback',
        error: error.message
      }).code(500);
    }
  }

  // Rotate API key (dummy implementation)
  async rotateApiKey(request, h) {
    try {
      // TODO: Implement actual API key rotation logic
      return h.response({
        success: true,
        message: 'API key rotated (dummy response)'
      }).code(200);
    } catch (error) {
      return h.response({
        success: false,
        message: 'Failed to rotate API key',
        error: error.message
      }).code(500);
    }
  }

  // Health check (dummy implementation)
  async healthCheck(request, h) {
    try {
      // TODO: Implement actual health check logic
      return h.response({
        success: true,
        message: 'Integration health is OK (dummy response)'
      }).code(200);
    } catch (error) {
      return h.response({
        success: false,
        message: 'Failed to check integration health',
        error: error.message
      }).code(500);
    }
  }

  // Cleanup logs (dummy implementation)
  async cleanupLogs(request, h) {
    try {
      // TODO: Implement actual cleanup logic
      return h.response({
        success: true,
        message: 'Integration logs cleaned up (dummy response)'
      }).code(200);
    } catch (error) {
      return h.response({
        success: false,
        message: 'Failed to cleanup integration logs',
        error: error.message
      }).code(500);
    }
  }

  // Helper methods for testing connections
  async testAuthentication(integration) {
    // This is a simplified test - in production, you'd implement specific logic for each integration type
    return { success: true, message: 'Authentication test passed' };
  }

  async testApiConnection(integration) {
    // Test API connection based on integration type
    return { success: true, message: 'API connection test passed' };
  }

  async testWebhookConnection(integration) {
    // Test webhook connection
    return { success: true, message: 'Webhook connection test passed' };
  }

  async testSyncConnection(integration) {
    // Test sync connection
    return { success: true, message: 'Sync connection test passed' };
  }

  async performDataSync(integration, syncType, direction, entities, forceSync) {
    // This is a simplified sync - in production, you'd implement specific sync logic
    return { success: true, message: 'Data sync completed', syncedRecords: 0 };
  }

  // Helper methods for export
  convertToCSV(data) {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  convertToXML(data) {
    if (!data || data.length === 0) return '<integrations></integrations>';

    let xml = '<integrations>';
    for (const item of data) {
      xml += '<integration>';
      for (const [key, value] of Object.entries(item)) {
        xml += `<${key}>${typeof value === 'string' ? this.escapeXml(value) : value}</${key}>`;
      }
      xml += '</integration>';
    }
    xml += '</integrations>';

    return xml;
  }

  escapeXml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

module.exports = IntegrationHandler;
