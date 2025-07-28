const { queries } = require('../database/queries');

class ReportsRepository {
  constructor(db) {
    this.db = db;
    this.queries = queries.reports;
  }

  // === REPORT RECORDS METHODS ===
  async createReportRecord(reportData) {
    const query = this.queries.createReportRecord;
    const values = [
      reportData.organization_id,
      reportData.report_type,
      reportData.format,
      reportData.filters,
      reportData.options,
      reportData.status,
      reportData.generated_by
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updateReportRecord(id, organizationId, updateData) {
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
      UPDATE reports
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND organization_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === SCHEDULED REPORTS METHODS ===
  async getScheduledReports(organizationId, filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = pagination;
    const offset = (page - 1) * limit;

    const query = this.queries.getScheduledReports;
    const values = [organizationId, limit, offset];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countScheduledReports(organizationId, filters = {}) {
    const query = this.queries.countScheduledReports;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async getScheduledReportById(id, organizationId) {
    const query = this.queries.findScheduledReportById;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async createScheduledReport(reportData) {
    const query = this.queries.createScheduledReport;
    const values = [
      reportData.organization_id,
      reportData.name,
      reportData.description,
      reportData.report_type,
      reportData.schedule,
      reportData.format,
      reportData.recipients,
      reportData.filters,
      reportData.options,
      reportData.is_active,
      reportData.created_by
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updateScheduledReport(id, organizationId, updateData) {
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
      UPDATE scheduled_reports
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND organization_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async deleteScheduledReport(id, organizationId) {
    const query = this.queries.deleteScheduledReport;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === REPORT TEMPLATES METHODS ===
  async getReportTemplates(organizationId, filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = pagination;
    const offset = (page - 1) * limit;

    const query = this.queries.getReportTemplates;
    const values = [organizationId, limit, offset];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countReportTemplates(organizationId, filters = {}) {
    const query = this.queries.countReportTemplates;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async getReportTemplateById(id, organizationId) {
    const query = this.queries.findReportTemplateById;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async createReportTemplate(templateData) {
    const query = this.queries.createReportTemplate;
    const values = [
      templateData.organization_id,
      templateData.name,
      templateData.description,
      templateData.report_type,
      templateData.template_data,
      templateData.is_default,
      templateData.is_active,
      templateData.created_by
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updateReportTemplate(id, organizationId, updateData) {
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
      UPDATE report_templates
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND organization_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async deleteReportTemplate(id, organizationId) {
    const query = this.queries.deleteReportTemplate;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === REPORT HISTORY METHODS ===
  async getReportHistory(organizationId, filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = pagination;
    const offset = (page - 1) * limit;

    const query = this.queries.getReportHistory;
    const values = [organizationId, limit, offset];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countReportHistory(organizationId, filters = {}) {
    const query = this.queries.countReportHistory;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async getReportById(id, organizationId) {
    const query = this.queries.findReportById;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === HELPER METHODS ===
  getAnalyticsRepository() {
    // This would be injected in a real implementation
    return null;
  }

  getPDFHandler() {
    // This would be injected in a real implementation
    return null;
  }
}

module.exports = ReportsRepository;
