const { queries } = require('../database/queries');

class DocsRepository {
  constructor(db) {
    this.db = db;
    this.queries = queries.docs;
  }

  // === API DOCUMENTATION METHODS ===

  async createAPIDoc(docData) {
    const { rows } = await this.db.query(this.queries.createAPIDoc, [
      docData.organization_id,
      docData.title,
      docData.description,
      docData.version,
      docData.base_url,
      docData.contact_email,
      docData.contact_name,
      docData.license,
      docData.terms_of_service,
      docData.is_active,
      docData.created_by
    ]);
    return rows[0];
  }

  async getAPIDocs(organizationId, filters = {}, pagination = {}) {
    const { search, version, is_active } = filters;
    const { page, limit, sort_by, sort_order } = pagination;
    const offset = (page - 1) * limit;

    let query = this.queries.getAPIDocs;
    let params = [organizationId, limit, offset];

    // Add search filter
    if (search) {
      query = query.replace('WHERE ad.organization_id = $1', 'WHERE ad.organization_id = $1 AND (ad.title ILIKE $4 OR ad.description ILIKE $4)');
      params.push(`%${search}%`);
    }

    // Add version filter
    if (version) {
      const versionCondition = 'AND ad.version = $' + (params.length + 1);
      query = query.replace('WHERE ad.organization_id = $1', 'WHERE ad.organization_id = $1 ' + versionCondition);
      params.push(version);
    }

    // Add is_active filter
    if (is_active !== undefined) {
      const activeCondition = 'AND ad.is_active = $' + (params.length + 1);
      query = query.replace('WHERE ad.organization_id = $1', 'WHERE ad.organization_id = $1 ' + activeCondition);
      params.push(is_active);
    }

    // Add sorting
    query = query.replace('ORDER BY ad.created_at DESC', `ORDER BY ad.${sort_by} ${sort_order.toUpperCase()}`);

    const { rows } = await this.db.query(query, params);
    return rows;
  }

  async countAPIDocs(organizationId, filters = {}) {
    const { search, version, is_active } = filters;

    let query = this.queries.countAPIDocs;
    let params = [organizationId];

    // Add search filter
    if (search) {
      query = query.replace('WHERE ad.organization_id = $1', 'WHERE ad.organization_id = $1 AND (ad.title ILIKE $2 OR ad.description ILIKE $2)');
      params.push(`%${search}%`);
    }

    // Add version filter
    if (version) {
      const versionCondition = 'AND ad.version = $' + (params.length + 1);
      query = query.replace('WHERE ad.organization_id = $1', 'WHERE ad.organization_id = $1 ' + versionCondition);
      params.push(version);
    }

    // Add is_active filter
    if (is_active !== undefined) {
      const activeCondition = 'AND ad.is_active = $' + (params.length + 1);
      query = query.replace('WHERE ad.organization_id = $1', 'WHERE ad.organization_id = $1 ' + activeCondition);
      params.push(is_active);
    }

    const { rows } = await this.db.query(query, params);
    return parseInt(rows[0].count, 10);
  }

  async getAPIDocById(id, organizationId) {
    const { rows } = await this.db.query(this.queries.findAPIDocById, [id, organizationId]);
    return rows[0];
  }

  async updateAPIDoc(id, organizationId, updateData) {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        setClause.push(`${key} = $${paramIndex}`);
        values.push(updateData[key]);
        paramIndex++;
      }
    });

    if (setClause.length === 0) {
      return null;
    }

    values.push(id, organizationId);
    const query = this.queries.updateAPIDoc.replace('SET column = $1', `SET ${setClause.join(', ')}`);

    const { rows } = await this.db.query(query, values);
    return rows[0];
  }

  async deleteAPIDoc(id, organizationId) {
    const { rows } = await this.db.query(this.queries.deleteAPIDoc, [id, organizationId]);
    return rows[0];
  }

  // === API ENDPOINT DOCUMENTATION METHODS ===

  async createEndpointDoc(docData) {
    const { rows } = await this.db.query(this.queries.createEndpointDoc, [
      docData.organization_id,
      docData.api_doc_id,
      docData.path,
      docData.method,
      docData.summary,
      docData.description,
      docData.tags,
      docData.parameters,
      docData.request_body,
      docData.responses,
      docData.is_deprecated,
      docData.deprecated_since,
      docData.deprecated_reason,
      docData.created_by
    ]);
    return rows[0];
  }

  async getEndpointDocs(organizationId, filters = {}, pagination = {}) {
    const { api_doc_id, search, method, tags, is_deprecated } = filters;
    const { page, limit, sort_by, sort_order } = pagination;
    const offset = (page - 1) * limit;

    let query = this.queries.getEndpointDocs;
    let params = [organizationId, limit, offset];

    // Add api_doc_id filter
    if (api_doc_id) {
      query = query.replace('WHERE ed.organization_id = $1', 'WHERE ed.organization_id = $1 AND ed.api_doc_id = $4');
      params.push(api_doc_id);
    }

    // Add search filter
    if (search) {
      const searchCondition = 'AND (ed.path ILIKE $' + (params.length + 1) + ' OR ed.summary ILIKE $' + (params.length + 1) + ')';
      query = query.replace('WHERE ed.organization_id = $1', 'WHERE ed.organization_id = $1 ' + searchCondition);
      params.push(`%${search}%`);
    }

    // Add method filter
    if (method) {
      const methodCondition = 'AND ed.method = $' + (params.length + 1);
      query = query.replace('WHERE ed.organization_id = $1', 'WHERE ed.organization_id = $1 ' + methodCondition);
      params.push(method);
    }

    // Add tags filter
    if (tags && tags.length > 0) {
      const tagsCondition = 'AND ed.tags && $' + (params.length + 1);
      query = query.replace('WHERE ed.organization_id = $1', 'WHERE ed.organization_id = $1 ' + tagsCondition);
      params.push(tags);
    }

    // Add is_deprecated filter
    if (is_deprecated !== undefined) {
      const deprecatedCondition = 'AND ed.is_deprecated = $' + (params.length + 1);
      query = query.replace('WHERE ed.organization_id = $1', 'WHERE ed.organization_id = $1 ' + deprecatedCondition);
      params.push(is_deprecated);
    }

    // Add sorting
    query = query.replace('ORDER BY ed.created_at DESC', `ORDER BY ed.${sort_by} ${sort_order.toUpperCase()}`);

    const { rows } = await this.db.query(query, params);
    return rows;
  }

  async countEndpointDocs(organizationId, filters = {}) {
    const { api_doc_id, search, method, tags, is_deprecated } = filters;

    let query = this.queries.countEndpointDocs;
    let params = [organizationId];

    // Add api_doc_id filter
    if (api_doc_id) {
      query = query.replace('WHERE ed.organization_id = $1', 'WHERE ed.organization_id = $1 AND ed.api_doc_id = $2');
      params.push(api_doc_id);
    }

    // Add search filter
    if (search) {
      const searchCondition = 'AND (ed.path ILIKE $' + (params.length + 1) + ' OR ed.summary ILIKE $' + (params.length + 1) + ')';
      query = query.replace('WHERE ed.organization_id = $1', 'WHERE ed.organization_id = $1 ' + searchCondition);
      params.push(`%${search}%`);
    }

    // Add method filter
    if (method) {
      const methodCondition = 'AND ed.method = $' + (params.length + 1);
      query = query.replace('WHERE ed.organization_id = $1', 'WHERE ed.organization_id = $1 ' + methodCondition);
      params.push(method);
    }

    // Add tags filter
    if (tags && tags.length > 0) {
      const tagsCondition = 'AND ed.tags && $' + (params.length + 1);
      query = query.replace('WHERE ed.organization_id = $1', 'WHERE ed.organization_id = $1 ' + tagsCondition);
      params.push(tags);
    }

    // Add is_deprecated filter
    if (is_deprecated !== undefined) {
      const deprecatedCondition = 'AND ed.is_deprecated = $' + (params.length + 1);
      query = query.replace('WHERE ed.organization_id = $1', 'WHERE ed.organization_id = $1 ' + deprecatedCondition);
      params.push(is_deprecated);
    }

    const { rows } = await this.db.query(query, params);
    return parseInt(rows[0].count, 10);
  }

  async getEndpointDocById(id, organizationId) {
    const { rows } = await this.db.query(this.queries.findEndpointDocById, [id, organizationId]);
    return rows[0];
  }

  async updateEndpointDoc(id, organizationId, updateData) {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        setClause.push(`${key} = $${paramIndex}`);
        values.push(updateData[key]);
        paramIndex++;
      }
    });

    if (setClause.length === 0) {
      return null;
    }

    values.push(id, organizationId);
    const query = this.queries.updateEndpointDoc.replace('SET column = $1', `SET ${setClause.join(', ')}`);

    const { rows } = await this.db.query(query, values);
    return rows[0];
  }

  async deleteEndpointDoc(id, organizationId) {
    const { rows } = await this.db.query(this.queries.deleteEndpointDoc, [id, organizationId]);
    return rows[0];
  }

  // === API EXPLORER SETTINGS METHODS ===

  async getExplorerSettings(organizationId) {
    const { rows } = await this.db.query(this.queries.findExplorerSettings, [organizationId]);
    return rows[0] || this.getDefaultExplorerSettings();
  }

  async updateExplorerSettings(organizationId, updateData) {
    const { rows } = await this.db.query(this.queries.upsertExplorerSettings, [
      organizationId,
      updateData.enable_swagger_ui,
      updateData.enable_redoc,
      updateData.enable_postman_collection,
      updateData.enable_insomnia_collection,
      updateData.enable_curl_examples,
      updateData.enable_code_samples,
      updateData.supported_languages,
      updateData.theme,
      updateData.show_authentication,
      updateData.show_rate_limits,
      updateData.show_deprecated_endpoints
    ]);
    return rows[0];
  }

  getDefaultExplorerSettings() {
    return {
      enable_swagger_ui: true,
      enable_redoc: true,
      enable_postman_collection: true,
      enable_insomnia_collection: false,
      enable_curl_examples: true,
      enable_code_samples: true,
      supported_languages: ['javascript', 'python', 'php'],
      theme: 'light',
      show_authentication: true,
      show_rate_limits: true,
      show_deprecated_endpoints: false
    };
  }

  // === SDK GENERATION METHODS ===

  async createSDK(sdkData) {
    const { rows } = await this.db.query(this.queries.createSDK, [
      sdkData.organization_id,
      sdkData.language,
      sdkData.package_name,
      sdkData.version,
      sdkData.include_examples,
      sdkData.include_tests,
      sdkData.include_documentation,
      sdkData.custom_config,
      sdkData.status,
      sdkData.created_by
    ]);
    return rows[0];
  }

  async updateSDK(id, organizationId, updateData) {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        setClause.push(`${key} = $${paramIndex}`);
        values.push(updateData[key]);
        paramIndex++;
      }
    });

    if (setClause.length === 0) {
      return null;
    }

    values.push(id, organizationId);
    const query = this.queries.updateSDK.replace('SET column = $1', `SET ${setClause.join(', ')}`);

    const { rows } = await this.db.query(query, values);
    return rows[0];
  }

  async getSDKById(id, organizationId) {
    const { rows } = await this.db.query(this.queries.findSDKById, [id, organizationId]);
    return rows[0];
  }

  async getSDKList(organizationId, filters = {}, pagination = {}) {
    const { language, status } = filters;
    const { page, limit, sort_by, sort_order } = pagination;
    const offset = (page - 1) * limit;

    let query = this.queries.getSDKList;
    let params = [organizationId, limit, offset];

    // Add language filter
    if (language) {
      query = query.replace('WHERE s.organization_id = $1', 'WHERE s.organization_id = $1 AND s.language = $4');
      params.push(language);
    }

    // Add status filter
    if (status) {
      const statusCondition = 'AND s.status = $' + (params.length + 1);
      query = query.replace('WHERE s.organization_id = $1', 'WHERE s.organization_id = $1 ' + statusCondition);
      params.push(status);
    }

    // Add sorting
    query = query.replace('ORDER BY s.created_at DESC', `ORDER BY s.${sort_by} ${sort_order.toUpperCase()}`);

    const { rows } = await this.db.query(query, params);
    return rows;
  }

  async countSDKList(organizationId, filters = {}) {
    const { language, status } = filters;

    let query = this.queries.countSDKList;
    let params = [organizationId];

    // Add language filter
    if (language) {
      query = query.replace('WHERE s.organization_id = $1', 'WHERE s.organization_id = $1 AND s.language = $2');
      params.push(language);
    }

    // Add status filter
    if (status) {
      const statusCondition = 'AND s.status = $' + (params.length + 1);
      query = query.replace('WHERE s.organization_id = $1', 'WHERE s.organization_id = $1 ' + statusCondition);
      params.push(status);
    }

    const { rows } = await this.db.query(query, params);
    return parseInt(rows[0].count, 10);
  }

  // === CODE EXAMPLES METHODS ===

  async createCodeExample(exampleData) {
    const { rows } = await this.db.query(this.queries.createCodeExample, [
      exampleData.organization_id,
      exampleData.endpoint_doc_id,
      exampleData.language,
      exampleData.title,
      exampleData.description,
      exampleData.code,
      exampleData.is_public,
      exampleData.tags,
      exampleData.created_by
    ]);
    return rows[0];
  }

  async getCodeExamples(organizationId, filters = {}, pagination = {}) {
    const { endpoint_doc_id, language, search, tags, is_public } = filters;
    const { page, limit, sort_by, sort_order } = pagination;
    const offset = (page - 1) * limit;

    let query = this.queries.getCodeExamples;
    let params = [organizationId, limit, offset];

    // Add endpoint_doc_id filter
    if (endpoint_doc_id) {
      query = query.replace('WHERE ce.organization_id = $1', 'WHERE ce.organization_id = $1 AND ce.endpoint_doc_id = $4');
      params.push(endpoint_doc_id);
    }

    // Add language filter
    if (language) {
      const languageCondition = 'AND ce.language = $' + (params.length + 1);
      query = query.replace('WHERE ce.organization_id = $1', 'WHERE ce.organization_id = $1 ' + languageCondition);
      params.push(language);
    }

    // Add search filter
    if (search) {
      const searchCondition = 'AND (ce.title ILIKE $' + (params.length + 1) + ' OR ce.description ILIKE $' + (params.length + 1) + ')';
      query = query.replace('WHERE ce.organization_id = $1', 'WHERE ce.organization_id = $1 ' + searchCondition);
      params.push(`%${search}%`);
    }

    // Add tags filter
    if (tags && tags.length > 0) {
      const tagsCondition = 'AND ce.tags && $' + (params.length + 1);
      query = query.replace('WHERE ce.organization_id = $1', 'WHERE ce.organization_id = $1 ' + tagsCondition);
      params.push(tags);
    }

    // Add is_public filter
    if (is_public !== undefined) {
      const publicCondition = 'AND ce.is_public = $' + (params.length + 1);
      query = query.replace('WHERE ce.organization_id = $1', 'WHERE ce.organization_id = $1 ' + publicCondition);
      params.push(is_public);
    }

    // Add sorting
    query = query.replace('ORDER BY ce.created_at DESC', `ORDER BY ce.${sort_by} ${sort_order.toUpperCase()}`);

    const { rows } = await this.db.query(query, params);
    return rows;
  }

  async countCodeExamples(organizationId, filters = {}) {
    const { endpoint_doc_id, language, search, tags, is_public } = filters;

    let query = this.queries.countCodeExamples;
    let params = [organizationId];

    // Add endpoint_doc_id filter
    if (endpoint_doc_id) {
      query = query.replace('WHERE ce.organization_id = $1', 'WHERE ce.organization_id = $1 AND ce.endpoint_doc_id = $2');
      params.push(endpoint_doc_id);
    }

    // Add language filter
    if (language) {
      const languageCondition = 'AND ce.language = $' + (params.length + 1);
      query = query.replace('WHERE ce.organization_id = $1', 'WHERE ce.organization_id = $1 ' + languageCondition);
      params.push(language);
    }

    // Add search filter
    if (search) {
      const searchCondition = 'AND (ce.title ILIKE $' + (params.length + 1) + ' OR ce.description ILIKE $' + (params.length + 1) + ')';
      query = query.replace('WHERE ce.organization_id = $1', 'WHERE ce.organization_id = $1 ' + searchCondition);
      params.push(`%${search}%`);
    }

    // Add tags filter
    if (tags && tags.length > 0) {
      const tagsCondition = 'AND ce.tags && $' + (params.length + 1);
      query = query.replace('WHERE ce.organization_id = $1', 'WHERE ce.organization_id = $1 ' + tagsCondition);
      params.push(tags);
    }

    // Add is_public filter
    if (is_public !== undefined) {
      const publicCondition = 'AND ce.is_public = $' + (params.length + 1);
      query = query.replace('WHERE ce.organization_id = $1', 'WHERE ce.organization_id = $1 ' + publicCondition);
      params.push(is_public);
    }

    const { rows } = await this.db.query(query, params);
    return parseInt(rows[0].count, 10);
  }

  async getCodeExampleById(id, organizationId) {
    const { rows } = await this.db.query(this.queries.findCodeExampleById, [id, organizationId]);
    return rows[0];
  }

  async updateCodeExample(id, organizationId, updateData) {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        setClause.push(`${key} = $${paramIndex}`);
        values.push(updateData[key]);
        paramIndex++;
      }
    });

    if (setClause.length === 0) {
      return null;
    }

    values.push(id, organizationId);
    const query = this.queries.updateCodeExample.replace('SET column = $1', `SET ${setClause.join(', ')}`);

    const { rows } = await this.db.query(query, values);
    return rows[0];
  }

  async deleteCodeExample(id, organizationId) {
    const { rows } = await this.db.query(this.queries.deleteCodeExample, [id, organizationId]);
    return rows[0];
  }

  // === DOCUMENTATION STATISTICS METHODS ===

  async getDocStatistics(organizationId, filters = {}) {
    const { start_date, end_date, group_by } = filters;

    let query = this.queries.getDocStatistics;
    let params = [organizationId];

    if (start_date) {
      query = query.replace('WHERE ds.organization_id = $1', 'WHERE ds.organization_id = $1 AND ds.date >= $2');
      params.push(start_date);
    }

    if (end_date) {
      const endDateCondition = 'AND ds.date <= $' + (params.length + 1);
      query = query.replace('WHERE ds.organization_id = $1', 'WHERE ds.organization_id = $1 ' + endDateCondition);
      params.push(end_date);
    }

    // Add group by
    if (group_by) {
      query = query.replace('GROUP BY ds.date', `GROUP BY ds.${group_by}`);
    }

    const { rows } = await this.db.query(query, params);
    return rows;
  }

  async getEndpointUsageStats(organizationId, filters = {}) {
    const { endpoint_doc_id, start_date, end_date, group_by } = filters;

    let query = this.queries.getEndpointUsageStats;
    let params = [organizationId];

    if (endpoint_doc_id) {
      query = query.replace('WHERE eus.organization_id = $1', 'WHERE eus.organization_id = $1 AND eus.endpoint_doc_id = $2');
      params.push(endpoint_doc_id);
    }

    if (start_date) {
      const startDateCondition = 'AND eus.date >= $' + (params.length + 1);
      query = query.replace('WHERE eus.organization_id = $1', 'WHERE eus.organization_id = $1 ' + startDateCondition);
      params.push(start_date);
    }

    if (end_date) {
      const endDateCondition = 'AND eus.date <= $' + (params.length + 1);
      query = query.replace('WHERE eus.organization_id = $1', 'WHERE eus.organization_id = $1 ' + endDateCondition);
      params.push(end_date);
    }

    // Add group by
    if (group_by) {
      query = query.replace('GROUP BY eus.date', `GROUP BY eus.${group_by}`);
    }

    const { rows } = await this.db.query(query, params);
    return rows;
  }

  async getSDKDownloadStats(organizationId, filters = {}) {
    const { sdk_id, start_date, end_date, group_by } = filters;

    let query = this.queries.getSDKDownloadStats;
    let params = [organizationId];

    if (sdk_id) {
      query = query.replace('WHERE sds.organization_id = $1', 'WHERE sds.organization_id = $1 AND sds.sdk_id = $2');
      params.push(sdk_id);
    }

    if (start_date) {
      const startDateCondition = 'AND sds.date >= $' + (params.length + 1);
      query = query.replace('WHERE sds.organization_id = $1', 'WHERE sds.organization_id = $1 ' + startDateCondition);
      params.push(start_date);
    }

    if (end_date) {
      const endDateCondition = 'AND sds.date <= $' + (params.length + 1);
      query = query.replace('WHERE sds.organization_id = $1', 'WHERE sds.organization_id = $1 ' + endDateCondition);
      params.push(end_date);
    }

    // Add group by
    if (group_by) {
      query = query.replace('GROUP BY sds.date', `GROUP BY sds.${group_by}`);
    }

    const { rows } = await this.db.query(query, params);
    return rows;
  }
}

module.exports = DocsRepository;
