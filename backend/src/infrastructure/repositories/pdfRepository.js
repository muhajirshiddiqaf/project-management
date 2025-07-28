const { queries } = require('../database/queries');

class PDFRepository {
  constructor(db) {
    this.db = db;
    this.queries = queries.pdf;
  }

  // === PDF RECORDS METHODS ===
  async createPDFRecord(pdfData) {
    const query = this.queries.createPDFRecord;
    const values = [
      pdfData.organization_id,
      pdfData.template_id,
      pdfData.quotation_id,
      pdfData.invoice_id,
      pdfData.content,
      pdfData.options,
      pdfData.file_size,
      pdfData.generated_by
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updatePDFRecord(id, organizationId, updateData) {
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
      UPDATE pdf_records
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND organization_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === PDF TEMPLATES METHODS ===
  async getPDFTemplates(organizationId, filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = pagination;
    const offset = (page - 1) * limit;

    const query = this.queries.getPDFTemplates;
    const values = [organizationId, limit, offset];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countPDFTemplates(organizationId, filters = {}) {
    const query = this.queries.countPDFTemplates;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async getPDFTemplateById(id, organizationId) {
    const query = this.queries.findPDFTemplateById;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async getPDFTemplateByName(name, organizationId) {
    const query = this.queries.findPDFTemplateByName;
    const values = [name, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async getDefaultPDFTemplate(category, organizationId) {
    const query = this.queries.findDefaultPDFTemplate;
    const values = [category, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async createPDFTemplate(templateData) {
    const query = this.queries.createPDFTemplate;
    const values = [
      templateData.organization_id,
      templateData.name,
      templateData.description,
      templateData.category,
      templateData.html_content,
      templateData.css_content,
      templateData.variables,
      templateData.default_options,
      templateData.is_active,
      templateData.created_by
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updatePDFTemplate(id, organizationId, updateData) {
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
      UPDATE pdf_templates
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND organization_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async deletePDFTemplate(id, organizationId) {
    const query = this.queries.deletePDFTemplate;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === QUOTATION & INVOICE METHODS ===
  async getQuotationById(id, organizationId) {
    const query = this.queries.findQuotationById;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async getInvoiceById(id, organizationId) {
    const query = this.queries.findInvoiceById;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === PDF STATISTICS METHODS ===
  async getPDFStatistics(organizationId, filters = {}) {
    const query = this.queries.getPDFStatistics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async getPDFTemplateStatistics(organizationId, filters = {}) {
    const query = this.queries.getPDFTemplateStatistics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }
}

module.exports = PDFRepository;
