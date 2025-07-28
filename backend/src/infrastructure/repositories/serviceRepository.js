const { queries } = require('../database/queries');

class ServiceRepository {
  constructor(db) {
    this.db = db;
    this.queries = queries.service;
  }

  // === SERVICE CRUD METHODS ===
  async findAll(organizationId, filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = pagination;
    const offset = (page - 1) * limit;

    const query = this.queries.findAll;
    const values = [organizationId, limit, offset];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countServices(organizationId, filters = {}) {
    const query = this.queries.countServices;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async findById(id, organizationId) {
    const query = this.queries.findServiceById;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async create(serviceData) {
    const query = this.queries.createService;
    const values = [
      serviceData.organization_id,
      serviceData.name,
      serviceData.description,
      serviceData.category_id,
      serviceData.code,
      serviceData.unit_type,
      serviceData.base_price,
      serviceData.currency,
      serviceData.is_active,
      serviceData.tags,
      serviceData.specifications,
      serviceData.notes,
      serviceData.created_by
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async update(id, organizationId, updateData) {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    // Build dynamic update query
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        setClause.push(`${key} = $${paramIndex}`);
        values.push(updateData[key]);
        paramIndex++;
      }
    });

    if (setClause.length === 0) {
      throw new Error('No fields to update');
    }

    setClause.push(`updated_at = NOW()`);
    values.push(id, organizationId);

    const query = `
      UPDATE services
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND organization_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id, organizationId) {
    const query = this.queries.deleteService;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async search(organizationId, searchTerm, filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = pagination;
    const offset = (page - 1) * limit;

    const query = this.queries.searchServices;
    const values = [organizationId, `%${searchTerm}%`, limit, offset];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countSearchServices(organizationId, searchTerm, filters = {}) {
    const query = this.queries.countSearchServices;
    const values = [organizationId, `%${searchTerm}%`];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async updateStatus(id, organizationId, isActive) {
    const query = this.queries.updateServiceStatus;
    const values = [isActive, id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === SERVICE CATEGORIES METHODS ===
  async getCategories(organizationId, filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC' } = pagination;
    const offset = (page - 1) * limit;

    const query = this.queries.getServiceCategories;
    const values = [organizationId, limit, offset];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countCategories(organizationId, filters = {}) {
    const query = this.queries.countServiceCategories;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async getCategoryById(id, organizationId) {
    const query = this.queries.findServiceCategoryById;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async createCategory(categoryData) {
    const query = this.queries.createServiceCategory;
    const values = [
      categoryData.organization_id,
      categoryData.name,
      categoryData.description,
      categoryData.parent_id,
      categoryData.is_active,
      categoryData.icon,
      categoryData.color,
      categoryData.created_by
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updateCategory(id, organizationId, updateData) {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    // Build dynamic update query
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        setClause.push(`${key} = $${paramIndex}`);
        values.push(updateData[key]);
        paramIndex++;
      }
    });

    if (setClause.length === 0) {
      throw new Error('No fields to update');
    }

    setClause.push(`updated_at = NOW()`);
    values.push(id, organizationId);

    const query = `
      UPDATE service_categories
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND organization_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async deleteCategory(id, organizationId) {
    const query = this.queries.deleteServiceCategory;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === SERVICE PRICING METHODS ===
  async getServicePricing(serviceId, organizationId) {
    const query = this.queries.getServicePricing;
    const values = [serviceId, organizationId];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countServicePricing(serviceId, organizationId) {
    const query = this.queries.countServicePricing;
    const values = [serviceId, organizationId];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async getServicePricingById(id, organizationId) {
    const query = this.queries.findServicePricingById;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async createServicePricing(pricingData) {
    const query = this.queries.createServicePricing;
    const values = [
      pricingData.service_id,
      pricingData.pricing_type,
      pricingData.base_price,
      pricingData.currency,
      pricingData.min_quantity,
      pricingData.max_quantity,
      pricingData.discount_percentage,
      pricingData.is_active,
      pricingData.valid_from,
      pricingData.valid_until,
      pricingData.notes,
      pricingData.organization_id,
      pricingData.created_by
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updateServicePricing(id, organizationId, updateData) {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    // Build dynamic update query
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        setClause.push(`${key} = $${paramIndex}`);
        values.push(updateData[key]);
        paramIndex++;
      }
    });

    if (setClause.length === 0) {
      throw new Error('No fields to update');
    }

    setClause.push(`updated_at = NOW()`);
    values.push(id, organizationId);

    const query = `
      UPDATE service_pricing
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND organization_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async deleteServicePricing(id, organizationId) {
    const query = this.queries.deleteServicePricing;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === SERVICE TEMPLATES METHODS ===
  async getServiceTemplates(organizationId, filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC' } = pagination;
    const offset = (page - 1) * limit;

    const query = this.queries.getServiceTemplates;
    const values = [organizationId, limit, offset];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countServiceTemplates(organizationId, filters = {}) {
    const query = this.queries.countServiceTemplates;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async getServiceTemplateById(id, organizationId) {
    const query = this.queries.findServiceTemplateById;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async createServiceTemplate(templateData) {
    const query = this.queries.createServiceTemplate;
    const values = [
      templateData.organization_id,
      templateData.name,
      templateData.description,
      templateData.category_id,
      templateData.is_active,
      templateData.notes,
      templateData.created_by
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updateServiceTemplate(id, organizationId, updateData) {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    // Build dynamic update query
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        setClause.push(`${key} = $${paramIndex}`);
        values.push(updateData[key]);
        paramIndex++;
      }
    });

    if (setClause.length === 0) {
      throw new Error('No fields to update');
    }

    setClause.push(`updated_at = NOW()`);
    values.push(id, organizationId);

    const query = `
      UPDATE service_templates
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND organization_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async deleteServiceTemplate(id, organizationId) {
    const query = this.queries.deleteServiceTemplate;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === SERVICE STATISTICS METHODS ===
  async getServiceStatistics(organizationId, filters = {}) {
    const query = this.queries.getServiceStatistics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async getServiceCategoryStatistics(organizationId, filters = {}) {
    const query = this.queries.getServiceCategoryStatistics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }
}

module.exports = ServiceRepository;
