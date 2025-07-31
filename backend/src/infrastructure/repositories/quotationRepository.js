const { queries } = require('../database/queries');

class QuotationRepository {
  constructor(db) {
    this.db = db;
    this.queries = queries.quotation;
  }

  // === QUOTATION CRUD METHODS ===
  async findAll(organizationId, filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = pagination;
    const offset = (page - 1) * limit;

    const query = this.queries.findAll;
    const values = [organizationId, limit, offset];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countQuotations(organizationId, filters = {}) {
    const query = this.queries.countQuotations;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async findById(id, organizationId) {
    const query = this.queries.findQuotationById;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async create(quotationData) {
    const query = this.queries.createQuotation;
    const values = [
      quotationData.organization_id,
      quotationData.project_id,
      quotationData.client_id,
      quotationData.quotation_number,
      quotationData.subject,
      quotationData.description,
      quotationData.status,
      quotationData.valid_until,
      quotationData.subtotal,
      quotationData.tax_rate,
      quotationData.tax_amount,
      quotationData.discount_rate,
      quotationData.discount_amount,
      quotationData.total_amount,
      quotationData.currency,
      quotationData.notes,
      quotationData.terms_conditions,
      quotationData.approved_by,
      quotationData.approved_at,
      quotationData.created_by
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
      UPDATE quotations
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND organization_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id, organizationId) {
    const query = this.queries.deleteQuotation;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async search(organizationId, searchTerm, filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = pagination;
    const offset = (page - 1) * limit;

    const query = this.queries.searchQuotations;
    const values = [organizationId, `%${searchTerm}%`, limit, offset];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countSearchQuotations(organizationId, searchTerm, filters = {}) {
    const query = this.queries.countSearchQuotations;
    const values = [organizationId, `%${searchTerm}%`];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async updateStatus(id, organizationId, status, approvedBy = null) {
    const query = this.queries.updateQuotationStatus;
    const values = [status, approvedBy, id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async approveQuotation(id, organizationId, approvedBy) {
    const query = this.queries.approveQuotation;
    const values = [approvedBy, id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === QUOTATION ITEMS METHODS ===
  async getQuotationItems(quotationId, organizationId) {
    const query = this.queries.getQuotationItems;
    const values = [quotationId, organizationId];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countQuotationItems(quotationId, organizationId) {
    const query = this.queries.countQuotationItems;
    const values = [quotationId, organizationId];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async getQuotationItemById(itemId, quotationId, organizationId) {
    const query = this.queries.findQuotationItemById;
    const values = [itemId, quotationId, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async createQuotationItem(itemData) {
    const query = this.queries.createQuotationItem;
    const values = [
      itemData.quotation_id,
      itemData.item_name,
      itemData.description,
      itemData.quantity,
      itemData.unit_price,
      itemData.unit_type,
      itemData.total_price,
      itemData.sort_order
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updateQuotationItem(itemId, quotationId, organizationId, updateData) {
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
    values.push(itemId, quotationId, organizationId);

    const query = `
      UPDATE quotation_items
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND quotation_id = $${paramIndex + 1}
      AND quotation_id IN (SELECT id FROM quotations WHERE organization_id = $${paramIndex + 2})
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async deleteQuotationItem(itemId, quotationId, organizationId) {
    const query = this.queries.deleteQuotationItem;
    const values = [itemId, quotationId, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === QUOTATION CALCULATION METHODS ===
  async calculateQuotationTotals(quotationId, organizationId) {
    const query = this.queries.calculateQuotationTotals;
    const values = [quotationId, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async generateQuotationNumber(organizationId) {
    const query = this.queries.generateQuotationNumber;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async generateQuotationFromProject(projectId, organizationId, quotationData) {
    try {
      // Get project details
      const projectQuery = `
        SELECT p.*, c.name as client_name, c.email as client_email
        FROM projects p
        LEFT JOIN clients c ON p.client_id = c.id
        WHERE p.id = $1 AND p.organization_id = $2
      `;
      const projectResult = await this.db.query(projectQuery, [projectId, organizationId]);
      const project = projectResult.rows[0];

      if (!project) {
        throw new Error('Project not found');
      }

      // Generate quotation number
      const quotationNumber = await this.generateQuotationNumber(organizationId);

      // Create quotation using the existing create method
      const newQuotationData = {
        organization_id: organizationId,
        project_id: projectId,
        client_id: project.client_id,
        quotation_number: quotationNumber.quotation_number,
        subject: quotationData.subject || `Quotation for ${project.name}`,
        description: quotationData.description || project.description,
        status: quotationData.status || 'draft',
        valid_until: quotationData.valid_until,
        subtotal: quotationData.subtotal || 0,
        tax_rate: quotationData.tax_rate || 0,
        tax_amount: quotationData.tax_amount || 0,
        discount_rate: quotationData.discount_rate || 0,
        discount_amount: quotationData.discount_amount || 0,
        total_amount: quotationData.total_amount || 0,
        currency: quotationData.currency || project.currency || 'USD',
        notes: quotationData.notes,
        terms_conditions: quotationData.terms_conditions,
        approved_by: quotationData.approved_by,
        approved_at: quotationData.approved_at,
        created_by: quotationData.created_by
      };

      const quotation = await this.create(newQuotationData);

      // Create default quotation items based on project
      const defaultItems = [
        {
          item_name: 'Project Development',
          description: project.description || 'Project development services',
          quantity: 1,
          unit_price: project.budget || 0,
          unit_type: 'project',
          total_price: project.budget || 0,
          sort_order: 1
        }
      ];

      // Add custom items if provided
      if (quotationData.items && Array.isArray(quotationData.items)) {
        for (let i = 0; i < quotationData.items.length; i++) {
          const item = quotationData.items[i];
          defaultItems.push({
            item_name: item.item_name,
            description: item.description,
            quantity: item.quantity || 1,
            unit_price: item.unit_price || 0,
            unit_type: item.unit_type || 'piece',
            total_price: (item.quantity || 1) * (item.unit_price || 0),
            sort_order: i + 2
          });
        }
      }

      // Create quotation items
      for (const item of defaultItems) {
        const itemValues = [
          quotation.id,
          item.item_name,
          item.description,
          item.quantity,
          item.unit_price,
          item.unit_type,
          item.total_price,
          item.sort_order
        ];

        const createItemQuery = `
          INSERT INTO quotation_items (
            quotation_id, item_name, description, quantity, unit_price,
            unit_type, total_price, sort_order
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        `;

        await this.db.query(createItemQuery, itemValues);
      }

      // Calculate totals
      await this.calculateQuotationTotals(quotation.id, organizationId);

      return quotation;
    } catch (error) {
      console.error('Error generating quotation from project:', error);
      throw error;
    }
  }

  // === QUOTATION STATISTICS METHODS ===
  async getQuotationStatistics(organizationId, filters = {}) {
    const query = this.queries.getQuotationStatistics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

    async getQuotationItemsStatistics(organizationId, filters = {}) {
    const query = this.queries.getQuotationItemsStatistics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === QUOTATION TEMPLATES METHODS ===
  async getQuotationTemplates(organizationId, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const query = this.queries.getQuotationTemplates;
    const values = [organizationId, limit, offset];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countQuotationTemplates(organizationId) {
    const query = this.queries.countQuotationTemplates;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async getQuotationTemplateById(id, organizationId) {
    const query = this.queries.findQuotationTemplateById;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async createQuotationTemplate(templateData) {
    const query = this.queries.createQuotationTemplate;
    const values = [
      templateData.organization_id,
      templateData.name,
      templateData.description,
      templateData.content,
      templateData.header_template,
      templateData.footer_template,
      templateData.terms_conditions,
      templateData.is_default,
      templateData.created_by
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updateQuotationTemplate(id, organizationId, updateData) {
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
      UPDATE quotation_templates
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND organization_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async deleteQuotationTemplate(id, organizationId) {
    const query = this.queries.deleteQuotationTemplate;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === QUOTATION APPROVAL WORKFLOW METHODS ===
  async createApprovalRequest(approvalData) {
    const query = this.queries.createApprovalRequest;
    const values = [
      approvalData.quotation_id,
      approvalData.requester_id,
      approvalData.approver_id,
      approvalData.comments,
      approvalData.organization_id
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async getApprovalRequests(organizationId, filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const query = this.queries.getApprovalRequests;
    const values = [organizationId, limit, offset];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countApprovalRequests(organizationId, filters = {}) {
    const query = this.queries.countApprovalRequests;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async processApprovalRequest(requestId, organizationId, status, comments, processedBy) {
    const query = this.queries.processApprovalRequest;
    const values = [status, comments, processedBy, requestId, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }
}

module.exports = QuotationRepository;
