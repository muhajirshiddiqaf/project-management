// const { buildWhereClause, buildOrderClause, buildPaginationClause } = require('../../queryBuilder');

// Integration queries
const integrationQueries = {
  // Create integration
  createIntegration: `
    INSERT INTO integrations (
      id, organization_id, name, description, type, provider, version, category,
      authentication_method, authentication_credentials, configuration_settings,
      is_active, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()
    ) RETURNING *
  `,

  // Get integrations with pagination and filters
  getIntegrations: (filters = {}, pagination = {}, sorting = {}) => {
    let query = `
      SELECT
        i.*,
        COUNT(*) OVER() as total_count
      FROM integrations i
      WHERE i.organization_id = $1
    `;

    const params = [filters.organizationId];
    let paramIndex = 2;

    // Add filters
    if (filters.search) {
      query += ` AND (i.name ILIKE $${paramIndex} OR i.description ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters.type) {
      query += ` AND i.type = $${paramIndex}`;
      params.push(filters.type);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND i.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.isActive !== undefined) {
      query += ` AND i.is_active = $${paramIndex}`;
      params.push(filters.isActive);
      paramIndex++;
    }

    // Add sorting
    const sortBy = sorting.sortBy || 'created_at';
    const sortOrder = sorting.sortOrder || 'DESC';
    query += ` ORDER BY i.${sortBy} ${sortOrder}`;

    // Add pagination
    if (pagination.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(pagination.limit);
      paramIndex++;
    }

    if (pagination.offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(pagination.offset);
    }

    return { query, params };
  },

  // Get integration by ID
  getIntegrationById: `
    SELECT * FROM integrations
    WHERE id = $1 AND organization_id = $2
  `,

  // Update integration
  updateIntegration: `
    UPDATE integrations
    SET
      name = COALESCE($3, name),
      description = COALESCE($4, description),
      type = COALESCE($5, type),
      provider = COALESCE($6, provider),
      version = COALESCE($7, version),
      category = COALESCE($8, category),
      authentication_method = COALESCE($9, authentication_method),
      authentication_credentials = COALESCE($10, authentication_credentials),
      configuration_settings = COALESCE($11, configuration_settings),
      is_active = COALESCE($12, is_active),
      updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
    RETURNING *
  `,

  // Delete integration
  deleteIntegration: `
    DELETE FROM integrations
    WHERE id = $1 AND organization_id = $2
    RETURNING *
  `,

  // Test connection
  testConnection: `
    UPDATE integrations
    SET
      last_test_at = NOW(),
      test_status = $3,
      test_result = $4
    WHERE id = $1 AND organization_id = $2
    RETURNING *
  `,

  // Sync data
  syncData: `
    UPDATE integrations
    SET
      last_sync_at = NOW(),
      sync_status = $3,
      sync_result = $4
    WHERE id = $1 AND organization_id = $2
    RETURNING *
  `,

  // Get integration statistics
  getIntegrationStats: `
    SELECT
      COUNT(*) as total_integrations,
      COUNT(CASE WHEN is_active = true THEN 1 END) as active_integrations,
      COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_integrations,
      COUNT(CASE WHEN last_test_at IS NOT NULL THEN 1 END) as tested_integrations,
      COUNT(CASE WHEN last_sync_at IS NOT NULL THEN 1 END) as synced_integrations
    FROM integrations
    WHERE organization_id = $1
  `,

  // Get integrations by type
  getIntegrationsByType: `
    SELECT * FROM integrations
    WHERE organization_id = $1 AND type = $2 AND is_active = true
    ORDER BY created_at DESC
  `,

  // Get integrations by category
  getIntegrationsByCategory: `
    SELECT * FROM integrations
    WHERE organization_id = $1 AND category = $2 AND is_active = true
    ORDER BY created_at DESC
  `,

  // Bulk update integrations
  bulkUpdateIntegrations: (integrationIds, updates) => {
    const setClauses = [];
    const params = [];
    let paramIndex = 1;

    Object.keys(updates).forEach(key => {
      setClauses.push(`${key} = $${paramIndex}`);
      params.push(updates[key]);
      paramIndex++;
    });

    setClauses.push('updated_at = NOW()');

    const query = `
      UPDATE integrations
      SET ${setClauses.join(', ')}
      WHERE id = ANY($${paramIndex}) AND organization_id = $${paramIndex + 1}
      RETURNING *
    `;

    params.push(integrationIds, updates.organizationId);
    return { query, params };
  },

  // Bulk delete integrations
  bulkDeleteIntegrations: `
    DELETE FROM integrations
    WHERE id = ANY($1) AND organization_id = $2
    RETURNING *
  `,

  // Check integration name uniqueness
  checkIntegrationNameUnique: `
    SELECT COUNT(*) as count
    FROM integrations
    WHERE organization_id = $1 AND name = $2 AND id != $3
  `,

  // Get integration logs
  getIntegrationLogs: (filters = {}, pagination = {}) => {
    let query = `
      SELECT
        il.*,
        COUNT(*) OVER() as total_count
      FROM integration_logs il
      WHERE il.integration_id = $1
    `;

    const params = [filters.integrationId];
    let paramIndex = 2;

    if (filters.level) {
      query += ` AND il.level = $${paramIndex}`;
      params.push(filters.level);
      paramIndex++;
    }

    if (filters.type) {
      query += ` AND il.type = $${paramIndex}`;
      params.push(filters.type);
      paramIndex++;
    }

    if (filters.startDate) {
      query += ` AND il.timestamp >= $${paramIndex}`;
      params.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate) {
      query += ` AND il.timestamp <= $${paramIndex}`;
      params.push(filters.endDate);
      paramIndex++;
    }

    const sortBy = filters.sortBy || 'timestamp';
    const sortOrder = filters.sortOrder || 'DESC';
    query += ` ORDER BY il.${sortBy} ${sortOrder}`;

    if (pagination.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(pagination.limit);
      paramIndex++;
    }

    if (pagination.offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(pagination.offset);
    }

    return { query, params };
  },

  // Create integration log
  createIntegrationLog: `
    INSERT INTO integration_logs (
      id, integration_id, level, type, message, details, timestamp
    ) VALUES (
      $1, $2, $3, $4, $5, $6, NOW()
    ) RETURNING *
  `,

  // Webhook queries
  createWebhook: `
    INSERT INTO integration_webhooks (
      id, integration_id, event, url, secret, is_active, retry_count, timeout
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    ) RETURNING *
  `,

  getWebhooks: `
    SELECT * FROM integration_webhooks
    WHERE integration_id = $1
    ORDER BY created_at DESC
  `,

  getWebhookById: `
    SELECT * FROM integration_webhooks
    WHERE id = $1 AND integration_id = $2
  `,

  updateWebhook: `
    UPDATE integration_webhooks
    SET
      event = COALESCE($3, event),
      url = COALESCE($4, url),
      secret = COALESCE($5, secret),
      is_active = COALESCE($6, is_active),
      retry_count = COALESCE($7, retry_count),
      timeout = COALESCE($8, timeout),
      updated_at = NOW()
    WHERE id = $1 AND integration_id = $2
    RETURNING *
  `,

  deleteWebhook: `
    DELETE FROM integration_webhooks
    WHERE id = $1 AND integration_id = $2
    RETURNING *
  `,

  // OAuth queries
  createOAuthToken: `
    INSERT INTO oauth_tokens (
      id, integration_id, access_token, refresh_token, token_type, expires_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6
    ) RETURNING *
  `,

  getOAuthToken: `
    SELECT * FROM oauth_tokens
    WHERE integration_id = $1
    ORDER BY created_at DESC
    LIMIT 1
  `,

  updateOAuthToken: `
    UPDATE oauth_tokens
    SET
      access_token = $3,
      refresh_token = $4,
      expires_at = $5,
      updated_at = NOW()
    WHERE integration_id = $1 AND id = $2
    RETURNING *
  `,

  // API Key queries
  createApiKey: `
    INSERT INTO api_keys (
      id, integration_id, key_name, key_value, permissions, expires_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6
    ) RETURNING *
  `,

  getApiKeys: `
    SELECT * FROM api_keys
    WHERE integration_id = $1 AND is_active = true
    ORDER BY created_at DESC
  `,

  revokeApiKey: `
    UPDATE api_keys
    SET is_active = false, revoked_at = NOW()
    WHERE id = $1 AND integration_id = $2
    RETURNING *
  `,

  // Sync queries
  createSyncJob: `
    INSERT INTO sync_jobs (
      id, integration_id, sync_type, direction, status, entities, started_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, NOW()
    ) RETURNING *
  `,

  updateSyncJob: `
    UPDATE sync_jobs
    SET
      status = $3,
      completed_at = CASE WHEN $3 = 'completed' THEN NOW() ELSE completed_at END,
      result = $4
    WHERE id = $1 AND integration_id = $2
    RETURNING *
  `,

  getSyncJobs: `
    SELECT * FROM sync_jobs
    WHERE integration_id = $1
    ORDER BY started_at DESC
    LIMIT $2
  `,

  // Export/Import queries
  getIntegrationsForExport: (filters = {}) => {
    let query = `
      SELECT
        id, name, description, type, provider, version, category,
        authentication_method, configuration_settings, is_active,
        created_at, updated_at
      FROM integrations
      WHERE organization_id = $1
    `;

    const params = [filters.organizationId];
    let paramIndex = 2;

    if (filters.type) {
      query += ` AND type = $${paramIndex}`;
      params.push(filters.type);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.isActive !== undefined) {
      query += ` AND is_active = $${paramIndex}`;
      params.push(filters.isActive);
    }

    query += ` ORDER BY created_at DESC`;

    return { query, params };
  },

  // Cleanup queries
  cleanupOldLogs: `
    DELETE FROM integration_logs
    WHERE timestamp < NOW() - INTERVAL '90 days'
  `,

  cleanupOldSyncJobs: `
    DELETE FROM sync_jobs
    WHERE started_at < NOW() - INTERVAL '30 days'
  `,

  // Health check queries
  getIntegrationHealth: `
    SELECT
      id, name, type, provider, is_active, last_test_at, test_status,
      last_sync_at, sync_status
    FROM integrations
    WHERE organization_id = $1
    ORDER BY last_test_at DESC NULLS LAST
  `
};

module.exports = integrationQueries;
