// Service module database queries
const serviceQueries = {
  // Find service by ID
  findServiceById: `
    SELECT * FROM services
    WHERE id = $1 AND organization_id = $2 AND is_active = true
  `,

  // Find services by organization
  findServicesByOrganization: `
    SELECT * FROM services
    WHERE organization_id = $1 AND is_active = true
    ORDER BY created_at DESC
  `,

  // Create service
  createService: `
    INSERT INTO services (id, organization_id, name, description, category,
                        unit_price, unit_type, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `,

  // Update service
  updateService: `
    UPDATE services
    SET name = COALESCE($1, name),
        description = COALESCE($2, description),
        category = COALESCE($3, category),
        unit_price = COALESCE($4, unit_price),
        unit_type = COALESCE($5, unit_type),
        is_active = COALESCE($6, is_active),
        updated_at = NOW()
    WHERE id = $7 AND organization_id = $8
    RETURNING *
  `,

  // Delete service (soft delete)
  deleteService: `
    UPDATE services
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get service statistics
  getServiceStatistics: `
    SELECT
      COUNT(*) as total_services,
      COUNT(CASE WHEN is_active = true THEN 1 END) as active_services,
      COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_services,
      AVG(unit_price) as avg_unit_price,
      MIN(unit_price) as min_unit_price,
      MAX(unit_price) as max_unit_price
    FROM services
    WHERE organization_id = $1
  `,

  // Search services
  searchServices: `
    SELECT * FROM services
    WHERE organization_id = $1 AND is_active = true
    AND (
      LOWER(name) LIKE LOWER($2) OR
      LOWER(description) LIKE LOWER($2) OR
      LOWER(category) LIKE LOWER($2)
    )
    ORDER BY created_at DESC
  `,

  // Get services by category
  getServicesByCategory: `
    SELECT * FROM services
    WHERE organization_id = $1 AND category = $2 AND is_active = true
    ORDER BY name ASC
  `,

  // Get service categories
  getServiceCategories: `
    SELECT
      category,
      COUNT(*) as service_count,
      AVG(unit_price) as avg_price
    FROM services
    WHERE organization_id = $1 AND is_active = true
    GROUP BY category
    ORDER BY service_count DESC
  `,

  // Get service usage statistics
  getServiceUsageStatistics: `
    SELECT
      s.id,
      s.name,
      s.category,
      s.unit_price,
      COUNT(qi.id) as quotation_usage,
      COUNT(ii.id) as invoice_usage,
      COUNT(oi.id) as order_usage,
      SUM(qi.total_price) as quotation_revenue,
      SUM(ii.total_price) as invoice_revenue,
      SUM(oi.total_price) as order_revenue
    FROM services s
    LEFT JOIN quotation_items qi ON s.id = qi.service_id AND qi.is_active = true
    LEFT JOIN invoice_items ii ON s.id = ii.service_id AND ii.is_active = true
    LEFT JOIN order_items oi ON s.id = oi.service_id AND oi.is_active = true
    WHERE s.organization_id = $1 AND s.is_active = true
    GROUP BY s.id, s.name, s.category, s.unit_price
    ORDER BY (quotation_usage + invoice_usage + order_usage) DESC
  `,

  // Get service dashboard data
  getServiceDashboardData: `
    SELECT
      s.id,
      s.name,
      s.description,
      s.category,
      s.unit_price,
      s.unit_type,
      s.is_active,
      s.created_at,
      COUNT(qi.id) as total_quotations,
      COUNT(ii.id) as total_invoices,
      COUNT(oi.id) as total_orders,
      SUM(qi.total_price) as quotation_revenue,
      SUM(ii.total_price) as invoice_revenue,
      SUM(oi.total_price) as order_revenue
    FROM services s
    LEFT JOIN quotation_items qi ON s.id = qi.service_id AND qi.is_active = true
    LEFT JOIN invoice_items ii ON s.id = ii.service_id AND ii.is_active = true
    LEFT JOIN order_items oi ON s.id = oi.service_id AND oi.is_active = true
    WHERE s.organization_id = $1 AND s.is_active = true
    GROUP BY s.id, s.name, s.description, s.category, s.unit_price, s.unit_type, s.is_active, s.created_at
    ORDER BY s.created_at DESC
  `,

  // Get service pricing history
  getServicePricingHistory: `
    SELECT * FROM service_pricing_history
    WHERE service_id = $1 AND organization_id = $2 AND is_active = true
    ORDER BY created_at DESC
  `,

  // Create service pricing history
  createServicePricingHistory: `
    INSERT INTO service_pricing_history (id, organization_id, service_id, old_price,
                                       new_price, reason, changed_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `,

  // Get service templates
  getServiceTemplates: `
    SELECT * FROM service_templates
    WHERE organization_id = $1 AND is_active = true
    ORDER BY created_at DESC
  `,

  // Create service template
  createServiceTemplate: `
    INSERT INTO service_templates (id, organization_id, name, description,
                                 services, pricing_strategy)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `,

  // Update service template
  updateServiceTemplate: `
    UPDATE service_templates
    SET name = COALESCE($1, name),
        description = COALESCE($2, description),
        services = COALESCE($3, services),
        pricing_strategy = COALESCE($4, pricing_strategy),
        updated_at = NOW()
    WHERE id = $5 AND organization_id = $6
    RETURNING *
  `,

  // Delete service template
  deleteServiceTemplate: `
    UPDATE service_templates
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get service bundles
  getServiceBundles: `
    SELECT * FROM service_bundles
    WHERE organization_id = $1 AND is_active = true
    ORDER BY created_at DESC
  `,

  // Create service bundle
  createServiceBundle: `
    INSERT INTO service_bundles (id, organization_id, name, description,
                               services, bundle_price, discount_percentage)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `,

  // Update service bundle
  updateServiceBundle: `
    UPDATE service_bundles
    SET name = COALESCE($1, name),
        description = COALESCE($2, description),
        services = COALESCE($3, services),
        bundle_price = COALESCE($4, bundle_price),
        discount_percentage = COALESCE($5, discount_percentage),
        updated_at = NOW()
    WHERE id = $6 AND organization_id = $7
    RETURNING *
  `,

  // Delete service bundle
  deleteServiceBundle: `
    UPDATE service_bundles
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get service performance metrics
  getServicePerformanceMetrics: `
    SELECT
      s.id,
      s.name,
      s.category,
      COUNT(qi.id) as quotation_count,
      COUNT(ii.id) as invoice_count,
      COUNT(oi.id) as order_count,
      SUM(qi.total_price) as total_revenue,
      AVG(qi.unit_price) as avg_unit_price,
      AVG(qi.quantity) as avg_quantity
    FROM services s
    LEFT JOIN quotation_items qi ON s.id = qi.service_id AND qi.is_active = true
    LEFT JOIN invoice_items ii ON s.id = ii.service_id AND ii.is_active = true
    LEFT JOIN order_items oi ON s.id = oi.service_id AND oi.is_active = true
    WHERE s.organization_id = $1 AND s.is_active = true
    GROUP BY s.id, s.name, s.category
    ORDER BY total_revenue DESC
  `,

  // Get service revenue by period
  getServiceRevenueByPeriod: `
    SELECT
      s.id,
      s.name,
      DATE_TRUNC('month', qi.created_at) as period,
      COUNT(qi.id) as quotation_count,
      SUM(qi.total_price) as quotation_revenue
    FROM services s
    LEFT JOIN quotation_items qi ON s.id = qi.service_id AND qi.is_active = true
    WHERE s.organization_id = $1 AND s.is_active = true
    AND qi.created_at >= $2 AND qi.created_at <= $3
    GROUP BY s.id, s.name, DATE_TRUNC('month', qi.created_at)
    ORDER BY period DESC, quotation_revenue DESC
  `,

  // Get popular services
  getPopularServices: `
    SELECT
      s.id,
      s.name,
      s.category,
      s.unit_price,
      COUNT(qi.id) + COUNT(ii.id) + COUNT(oi.id) as total_usage,
      SUM(qi.total_price) + SUM(ii.total_price) + SUM(oi.total_price) as total_revenue
    FROM services s
    LEFT JOIN quotation_items qi ON s.id = qi.service_id AND qi.is_active = true
    LEFT JOIN invoice_items ii ON s.id = ii.service_id AND ii.is_active = true
    LEFT JOIN order_items oi ON s.id = oi.service_id AND oi.is_active = true
    WHERE s.organization_id = $1 AND s.is_active = true
    GROUP BY s.id, s.name, s.category, s.unit_price
    ORDER BY total_usage DESC
    LIMIT 10
  `,

  // Get service categories with revenue
  getServiceCategoriesWithRevenue: `
    SELECT
      s.category,
      COUNT(DISTINCT s.id) as service_count,
      AVG(s.unit_price) as avg_price,
      SUM(qi.total_price) + SUM(ii.total_price) + SUM(oi.total_price) as total_revenue
    FROM services s
    LEFT JOIN quotation_items qi ON s.id = qi.service_id AND qi.is_active = true
    LEFT JOIN invoice_items ii ON s.id = ii.service_id AND ii.is_active = true
    LEFT JOIN order_items oi ON s.id = oi.service_id AND oi.is_active = true
    WHERE s.organization_id = $1 AND s.is_active = true
    GROUP BY s.category
    ORDER BY total_revenue DESC
  `,

  // Get service inventory (if applicable)
  getServiceInventory: `
    SELECT
      s.id,
      s.name,
      s.category,
      si.quantity,
      si.min_quantity,
      si.max_quantity,
      si.reorder_point
    FROM services s
    LEFT JOIN service_inventory si ON s.id = si.service_id AND si.is_active = true
    WHERE s.organization_id = $1 AND s.is_active = true
    ORDER BY s.name ASC
  `,

  // Update service inventory
  updateServiceInventory: `
    UPDATE service_inventory
    SET quantity = COALESCE($1, quantity),
        min_quantity = COALESCE($2, min_quantity),
        max_quantity = COALESCE($3, max_quantity),
        reorder_point = COALESCE($4, reorder_point),
        updated_at = NOW()
    WHERE service_id = $5 AND organization_id = $6
    RETURNING *
  `,

  // Create service inventory
  createServiceInventory: `
    INSERT INTO service_inventory (id, organization_id, service_id, quantity,
                                 min_quantity, max_quantity, reorder_point)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `,

  // Get low stock services
  getLowStockServices: `
    SELECT
      s.id,
      s.name,
      s.category,
      si.quantity,
      si.reorder_point
    FROM services s
    JOIN service_inventory si ON s.id = si.service_id AND si.is_active = true
    WHERE s.organization_id = $1 AND s.is_active = true
    AND si.quantity <= si.reorder_point
    ORDER BY si.quantity ASC
  `
};

module.exports = serviceQueries;
