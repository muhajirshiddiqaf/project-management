// === API DOCUMENTATION QUERIES ===

const createAPIDoc = `
  INSERT INTO api_docs (
    organization_id, title, description, version, base_url,
    contact_email, contact_name, license, terms_of_service, is_active, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
  ) RETURNING *
`;

const getAPIDocs = `
  SELECT
    ad.*,
    u.name as created_by_name,
    COALESCE(COUNT(ed.id), 0) as endpoint_count
  FROM api_docs ad
  LEFT JOIN users u ON ad.created_by = u.id
  LEFT JOIN endpoint_docs ed ON ad.id = ed.api_doc_id
  WHERE ad.organization_id = $1
  GROUP BY ad.id, u.name
  ORDER BY ad.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countAPIDocs = `
  SELECT COUNT(*) as count
  FROM api_docs ad
  WHERE ad.organization_id = $1
`;

const findAPIDocById = `
  SELECT
    ad.*,
    u.name as created_by_name
  FROM api_docs ad
  LEFT JOIN users u ON ad.created_by = u.id
  WHERE ad.id = $1 AND ad.organization_id = $2
`;

const updateAPIDoc = `
  UPDATE api_docs
  SET column = $1, updated_at = NOW()
  WHERE id = $2 AND organization_id = $3
  RETURNING *
`;

const deleteAPIDoc = `
  DELETE FROM api_docs
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

// === API ENDPOINT DOCUMENTATION QUERIES ===

const createEndpointDoc = `
  INSERT INTO endpoint_docs (
    organization_id, api_doc_id, path, method, summary, description,
    tags, parameters, request_body, responses, is_deprecated,
    deprecated_since, deprecated_reason, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
  ) RETURNING *
`;

const getEndpointDocs = `
  SELECT
    ed.*,
    ad.title as api_doc_title,
    u.name as created_by_name,
    COALESCE(COUNT(ce.id), 0) as example_count
  FROM endpoint_docs ed
  LEFT JOIN api_docs ad ON ed.api_doc_id = ad.id
  LEFT JOIN users u ON ed.created_by = u.id
  LEFT JOIN code_examples ce ON ed.id = ce.endpoint_doc_id
  WHERE ed.organization_id = $1
  GROUP BY ed.id, ad.title, u.name
  ORDER BY ed.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countEndpointDocs = `
  SELECT COUNT(*) as count
  FROM endpoint_docs ed
  WHERE ed.organization_id = $1
`;

const findEndpointDocById = `
  SELECT
    ed.*,
    ad.title as api_doc_title,
    u.name as created_by_name
  FROM endpoint_docs ed
  LEFT JOIN api_docs ad ON ed.api_doc_id = ad.id
  LEFT JOIN users u ON ed.created_by = u.id
  WHERE ed.id = $1 AND ed.organization_id = $2
`;

const updateEndpointDoc = `
  UPDATE endpoint_docs
  SET column = $1, updated_at = NOW()
  WHERE id = $2 AND organization_id = $3
  RETURNING *
`;

const deleteEndpointDoc = `
  DELETE FROM endpoint_docs
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

// === API EXPLORER SETTINGS QUERIES ===

const findExplorerSettings = `
  SELECT * FROM explorer_settings
  WHERE organization_id = $1
`;

const upsertExplorerSettings = `
  INSERT INTO explorer_settings (
    organization_id, enable_swagger_ui, enable_redoc, enable_postman_collection,
    enable_insomnia_collection, enable_curl_examples, enable_code_samples,
    supported_languages, theme, show_authentication, show_rate_limits,
    show_deprecated_endpoints
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
  )
  ON CONFLICT (organization_id)
  DO UPDATE SET
    enable_swagger_ui = EXCLUDED.enable_swagger_ui,
    enable_redoc = EXCLUDED.enable_redoc,
    enable_postman_collection = EXCLUDED.enable_postman_collection,
    enable_insomnia_collection = EXCLUDED.enable_insomnia_collection,
    enable_curl_examples = EXCLUDED.enable_curl_examples,
    enable_code_samples = EXCLUDED.enable_code_samples,
    supported_languages = EXCLUDED.supported_languages,
    theme = EXCLUDED.theme,
    show_authentication = EXCLUDED.show_authentication,
    show_rate_limits = EXCLUDED.show_rate_limits,
    show_deprecated_endpoints = EXCLUDED.show_deprecated_endpoints,
    updated_at = NOW()
  RETURNING *
`;

// === SDK GENERATION QUERIES ===

const createSDK = `
  INSERT INTO sdks (
    organization_id, language, package_name, version, include_examples,
    include_tests, include_documentation, custom_config, status, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
  ) RETURNING *
`;

const updateSDK = `
  UPDATE sdks
  SET column = $1, updated_at = NOW()
  WHERE id = $2 AND organization_id = $3
  RETURNING *
`;

const findSDKById = `
  SELECT
    s.*,
    u.name as created_by_name
  FROM sdks s
  LEFT JOIN users u ON s.created_by = u.id
  WHERE s.id = $1 AND s.organization_id = $2
`;

const getSDKList = `
  SELECT
    s.*,
    u.name as created_by_name
  FROM sdks s
  LEFT JOIN users u ON s.created_by = u.id
  WHERE s.organization_id = $1
  ORDER BY s.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countSDKList = `
  SELECT COUNT(*) as count
  FROM sdks s
  WHERE s.organization_id = $1
`;

// === CODE EXAMPLES QUERIES ===

const createCodeExample = `
  INSERT INTO code_examples (
    organization_id, endpoint_doc_id, language, title, description,
    code, is_public, tags, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9
  ) RETURNING *
`;

const getCodeExamples = `
  SELECT
    ce.*,
    ed.path as endpoint_path,
    ed.method as endpoint_method,
    u.name as created_by_name
  FROM code_examples ce
  LEFT JOIN endpoint_docs ed ON ce.endpoint_doc_id = ed.id
  LEFT JOIN users u ON ce.created_by = u.id
  WHERE ce.organization_id = $1
  GROUP BY ce.id, ed.path, ed.method, u.name
  ORDER BY ce.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countCodeExamples = `
  SELECT COUNT(*) as count
  FROM code_examples ce
  WHERE ce.organization_id = $1
`;

const findCodeExampleById = `
  SELECT
    ce.*,
    ed.path as endpoint_path,
    ed.method as endpoint_method,
    u.name as created_by_name
  FROM code_examples ce
  LEFT JOIN endpoint_docs ed ON ce.endpoint_doc_id = ed.id
  LEFT JOIN users u ON ce.created_by = u.id
  WHERE ce.id = $1 AND ce.organization_id = $2
`;

const updateCodeExample = `
  UPDATE code_examples
  SET column = $1, updated_at = NOW()
  WHERE id = $2 AND organization_id = $3
  RETURNING *
`;

const deleteCodeExample = `
  DELETE FROM code_examples
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

// === DOCUMENTATION STATISTICS QUERIES ===

const getDocStatistics = `
  SELECT
    DATE_TRUNC('day', ds.date) as period,
    COUNT(DISTINCT ds.api_doc_id) as api_docs_created,
    COUNT(DISTINCT ds.endpoint_doc_id) as endpoints_created,
    COUNT(DISTINCT ds.code_example_id) as examples_created,
    COUNT(DISTINCT ds.sdk_id) as sdks_generated,
    SUM(ds.views) as total_views,
    SUM(ds.downloads) as total_downloads
  FROM doc_statistics ds
  WHERE ds.organization_id = $1
  GROUP BY ds.date
  ORDER BY period DESC
`;

const getEndpointUsageStats = `
  SELECT
    DATE_TRUNC('day', eus.date) as period,
    eus.endpoint_doc_id,
    ed.path,
    ed.method,
    COUNT(eus.request_id) as request_count,
    AVG(eus.response_time) as avg_response_time,
    COUNT(CASE WHEN eus.status_code >= 400 THEN 1 END) as error_count
  FROM endpoint_usage_stats eus
  LEFT JOIN endpoint_docs ed ON eus.endpoint_doc_id = ed.id
  WHERE eus.organization_id = $1
  GROUP BY eus.date, eus.endpoint_doc_id, ed.path, ed.method
  ORDER BY period DESC
`;

const getSDKDownloadStats = `
  SELECT
    DATE_TRUNC('day', sds.date) as period,
    sds.sdk_id,
    s.language,
    s.package_name,
    COUNT(sds.download_id) as download_count,
    COUNT(DISTINCT sds.user_id) as unique_users
  FROM sdk_download_stats sds
  LEFT JOIN sdks s ON sds.sdk_id = s.id
  WHERE sds.organization_id = $1
  GROUP BY sds.date, sds.sdk_id, s.language, s.package_name
  ORDER BY period DESC
`;

module.exports = {
  // API Documentation
  createAPIDoc,
  getAPIDocs,
  countAPIDocs,
  findAPIDocById,
  updateAPIDoc,
  deleteAPIDoc,

  // Endpoint Documentation
  createEndpointDoc,
  getEndpointDocs,
  countEndpointDocs,
  findEndpointDocById,
  updateEndpointDoc,
  deleteEndpointDoc,

  // Explorer Settings
  findExplorerSettings,
  upsertExplorerSettings,

  // SDK Generation
  createSDK,
  updateSDK,
  findSDKById,
  getSDKList,
  countSDKList,

  // Code Examples
  createCodeExample,
  getCodeExamples,
  countCodeExamples,
  findCodeExampleById,
  updateCodeExample,
  deleteCodeExample,

  // Statistics
  getDocStatistics,
  getEndpointUsageStats,
  getSDKDownloadStats
};
