// Service CRUD queries
const findAll = `
  SELECT
    s.*,
    sc.name as category_name,
    u.name as created_by_name,
    COALESCE(COUNT(sp.id), 0) as pricing_count
  FROM services s
  LEFT JOIN service_categories sc ON s.category_id = sc.id
  LEFT JOIN users u ON s.created_by = u.id
  LEFT JOIN service_pricing sp ON s.id = sp.service_id
  WHERE s.organization_id = $1
  GROUP BY s.id, sc.name, u.name
  ORDER BY s.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countServices = `
  SELECT COUNT(*) as count
  FROM services
  WHERE organization_id = $1
`;

const findServiceById = `
  SELECT
    s.*,
    sc.name as category_name,
    u.name as created_by_name
  FROM services s
  LEFT JOIN service_categories sc ON s.category_id = sc.id
  LEFT JOIN users u ON s.created_by = u.id
  WHERE s.id = $1 AND s.organization_id = $2
`;

const createService = `
  INSERT INTO services (
    organization_id, name, description, category_id, code, unit_type,
    base_price, currency, is_active, tags, specifications, notes, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
  ) RETURNING *
`;

const deleteService = `
  DELETE FROM services
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

const searchServices = `
  SELECT
    s.*,
    sc.name as category_name,
    u.name as created_by_name
  FROM services s
  LEFT JOIN service_categories sc ON s.category_id = sc.id
  LEFT JOIN users u ON s.created_by = u.id
  WHERE s.organization_id = $1
    AND (s.name ILIKE $2 OR s.description ILIKE $2 OR s.code ILIKE $2)
  ORDER BY s.created_at DESC
  LIMIT $3 OFFSET $4
`;

const countSearchServices = `
  SELECT COUNT(*) as count
  FROM services
  WHERE organization_id = $1
    AND (name ILIKE $2 OR description ILIKE $2 OR code ILIKE $2)
`;

const updateServiceStatus = `
  UPDATE services
  SET is_active = $1, updated_at = NOW()
  WHERE id = $2 AND organization_id = $3
  RETURNING *
`;

// Service categories queries
const getServiceCategories = `
  SELECT
    sc.*,
    parent.name as parent_name,
    u.name as created_by_name,
    COALESCE(COUNT(s.id), 0) as service_count
  FROM service_categories sc
  LEFT JOIN service_categories parent ON sc.parent_id = parent.id
  LEFT JOIN users u ON sc.created_by = u.id
  LEFT JOIN services s ON sc.id = s.category_id
  WHERE sc.organization_id = $1
  GROUP BY sc.id, parent.name, u.name
  ORDER BY sc.name ASC
  LIMIT $2 OFFSET $3
`;

const countServiceCategories = `
  SELECT COUNT(*) as count
  FROM service_categories
  WHERE organization_id = $1
`;

const findServiceCategoryById = `
  SELECT
    sc.*,
    parent.name as parent_name,
    u.name as created_by_name
  FROM service_categories sc
  LEFT JOIN service_categories parent ON sc.parent_id = parent.id
  LEFT JOIN users u ON sc.created_by = u.id
  WHERE sc.id = $1 AND sc.organization_id = $2
`;

const createServiceCategory = `
  INSERT INTO service_categories (
    organization_id, name, description, parent_id, is_active, icon, color, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8
  ) RETURNING *
`;

const deleteServiceCategory = `
  DELETE FROM service_categories
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

// Service pricing queries
const getServicePricing = `
  SELECT
    sp.*,
    s.name as service_name,
    u.name as created_by_name
  FROM service_pricing sp
  LEFT JOIN services s ON sp.service_id = s.id
  LEFT JOIN users u ON sp.created_by = u.id
  WHERE sp.service_id = $1 AND sp.organization_id = $2
  ORDER BY sp.created_at DESC
`;

const countServicePricing = `
  SELECT COUNT(*) as count
  FROM service_pricing sp
  JOIN services s ON sp.service_id = s.id
  WHERE sp.service_id = $1 AND sp.organization_id = $2
`;

const findServicePricingById = `
  SELECT
    sp.*,
    s.name as service_name,
    u.name as created_by_name
  FROM service_pricing sp
  LEFT JOIN services s ON sp.service_id = s.id
  LEFT JOIN users u ON sp.created_by = u.id
  WHERE sp.id = $1 AND sp.organization_id = $2
`;

const createServicePricing = `
  INSERT INTO service_pricing (
    service_id, pricing_type, base_price, currency, min_quantity, max_quantity,
    discount_percentage, is_active, valid_from, valid_until, notes, organization_id, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
  ) RETURNING *
`;

const deleteServicePricing = `
  DELETE FROM service_pricing
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

// Service templates queries
const getServiceTemplates = `
  SELECT
    st.*,
    sc.name as category_name,
    u.name as created_by_name,
    COALESCE(COUNT(sts.id), 0) as service_count
  FROM service_templates st
  LEFT JOIN service_categories sc ON st.category_id = sc.id
  LEFT JOIN users u ON st.created_by = u.id
  LEFT JOIN service_template_services sts ON st.id = sts.template_id
  WHERE st.organization_id = $1
  GROUP BY st.id, sc.name, u.name
  ORDER BY st.name ASC
  LIMIT $2 OFFSET $3
`;

const countServiceTemplates = `
  SELECT COUNT(*) as count
  FROM service_templates
  WHERE organization_id = $1
`;

const findServiceTemplateById = `
  SELECT
    st.*,
    sc.name as category_name,
    u.name as created_by_name
  FROM service_templates st
  LEFT JOIN service_categories sc ON st.category_id = sc.id
  LEFT JOIN users u ON st.created_by = u.id
  WHERE st.id = $1 AND st.organization_id = $2
`;

const createServiceTemplate = `
  INSERT INTO service_templates (
    organization_id, name, description, category_id, is_active, notes, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7
  ) RETURNING *
`;

const deleteServiceTemplate = `
  DELETE FROM service_templates
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

// Service statistics queries
const getServiceStatistics = `
  SELECT
    COUNT(*) as total_services,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_services,
    COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_services,
    COUNT(DISTINCT category_id) as unique_categories,
    COALESCE(AVG(base_price), 0) as average_price,
    COALESCE(MIN(base_price), 0) as min_price,
    COALESCE(MAX(base_price), 0) as max_price,
    COUNT(CASE WHEN unit_type = 'hour' THEN 1 END) as hourly_services,
    COUNT(CASE WHEN unit_type = 'day' THEN 1 END) as daily_services,
    COUNT(CASE WHEN unit_type = 'piece' THEN 1 END) as piece_services
  FROM services
  WHERE organization_id = $1
`;

const getServiceCategoryStatistics = `
  SELECT
    sc.name as category_name,
    COUNT(s.id) as service_count,
    COALESCE(AVG(s.base_price), 0) as average_price,
    COUNT(CASE WHEN s.is_active = true THEN 1 END) as active_services,
    COUNT(CASE WHEN s.is_active = false THEN 1 END) as inactive_services
  FROM service_categories sc
  LEFT JOIN services s ON sc.id = s.category_id
  WHERE sc.organization_id = $1
  GROUP BY sc.id, sc.name
  ORDER BY service_count DESC
`;

module.exports = {
  findAll,
  countServices,
  findServiceById,
  createService,
  deleteService,
  searchServices,
  countSearchServices,
  updateServiceStatus,
  getServiceCategories,
  countServiceCategories,
  findServiceCategoryById,
  createServiceCategory,
  deleteServiceCategory,
  getServicePricing,
  countServicePricing,
  findServicePricingById,
  createServicePricing,
  deleteServicePricing,
  getServiceTemplates,
  countServiceTemplates,
  findServiceTemplateById,
  createServiceTemplate,
  deleteServiceTemplate,
  getServiceStatistics,
  getServiceCategoryStatistics
};
