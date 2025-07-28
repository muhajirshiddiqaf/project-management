const { queries } = require('../database/queries');

class EmailRepository {
  constructor(db) {
    this.db = db;
    this.queries = queries.email;
  }

  // === EMAIL RECORDS METHODS ===
  async createEmailRecord(emailData) {
    const query = this.queries.createEmailRecord;
    const values = [
      emailData.organization_id,
      emailData.to,
      emailData.cc,
      emailData.bcc,
      emailData.subject,
      emailData.html_content,
      emailData.text_content,
      emailData.template_id,
      emailData.sendgrid_message_id,
      emailData.status,
      emailData.sent_by,
      emailData.sent_at
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updateEmailRecord(id, organizationId, updateData) {
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
      UPDATE email_records
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND organization_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === EMAIL TEMPLATES METHODS ===
  async getEmailTemplates(organizationId, filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = pagination;
    const offset = (page - 1) * limit;

    const query = this.queries.getEmailTemplates;
    const values = [organizationId, limit, offset];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countEmailTemplates(organizationId, filters = {}) {
    const query = this.queries.countEmailTemplates;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async getEmailTemplateById(id, organizationId) {
    const query = this.queries.findEmailTemplateById;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async createEmailTemplate(templateData) {
    const query = this.queries.createEmailTemplate;
    const values = [
      templateData.organization_id,
      templateData.name,
      templateData.description,
      templateData.subject,
      templateData.html_content,
      templateData.text_content,
      templateData.variables,
      templateData.category,
      templateData.is_active,
      templateData.created_by
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updateEmailTemplate(id, organizationId, updateData) {
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
      UPDATE email_templates
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND organization_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async deleteEmailTemplate(id, organizationId) {
    const query = this.queries.deleteEmailTemplate;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === EMAIL TRACKING METHODS ===
  async getEmailTracking(organizationId, filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sortBy = 'sent_at', sortOrder = 'DESC' } = pagination;
    const offset = (page - 1) * limit;

    const query = this.queries.getEmailTracking;
    const values = [organizationId, limit, offset];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countEmailTracking(organizationId, filters = {}) {
    const query = this.queries.countEmailTracking;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async getEmailTrackingById(id, organizationId) {
    const query = this.queries.findEmailTrackingById;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async updateEmailTracking(id, organizationId, updateData) {
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
      UPDATE email_tracking
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND organization_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === EMAIL SCHEDULING METHODS ===
  async getEmailSchedules(organizationId, filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sortBy = 'scheduled_at', sortOrder = 'ASC' } = pagination;
    const offset = (page - 1) * limit;

    const query = this.queries.getEmailSchedules;
    const values = [organizationId, limit, offset];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countEmailSchedules(organizationId, filters = {}) {
    const query = this.queries.countEmailSchedules;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async getEmailScheduleById(id, organizationId) {
    const query = this.queries.findEmailScheduleById;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async createEmailSchedule(scheduleData) {
    const query = this.queries.createEmailSchedule;
    const values = [
      scheduleData.organization_id,
      scheduleData.template_id,
      scheduleData.recipients,
      scheduleData.subject,
      scheduleData.template_data,
      scheduleData.scheduled_at,
      scheduleData.timezone,
      scheduleData.repeat_type,
      scheduleData.repeat_interval,
      scheduleData.end_date,
      scheduleData.is_active,
      scheduleData.created_by
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updateEmailSchedule(id, organizationId, updateData) {
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
      UPDATE email_schedules
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND organization_id = $${paramIndex + 1}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async deleteEmailSchedule(id, organizationId) {
    const query = this.queries.deleteEmailSchedule;
    const values = [id, organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === EMAIL STATISTICS METHODS ===
  async getEmailStatistics(organizationId, filters = {}) {
    const query = this.queries.getEmailStatistics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async getEmailTemplateStatistics(organizationId, filters = {}) {
    const query = this.queries.getEmailTemplateStatistics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === EMAIL WEBHOOK METHODS ===
  async processEmailWebhook(webhookData, organizationId) {
    const query = this.queries.processEmailWebhook;
    const values = [
      webhookData.event,
      webhookData.email,
      webhookData.timestamp,
      webhookData.sg_message_id,
      webhookData.sg_event_id,
      webhookData.sg_event_type,
      webhookData.useragent,
      webhookData.ip,
      webhookData.url,
      webhookData.reason,
      webhookData.status,
      webhookData.response,
      webhookData.attempt,
      webhookData.category,
      webhookData.marketing_campaign_id,
      webhookData.marketing_campaign_name,
      webhookData.marketing_campaign_split_id,
      webhookData.marketing_campaign_version,
      organizationId
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }
}

module.exports = EmailRepository;
