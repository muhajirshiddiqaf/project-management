const Boom = require('@hapi/boom');
const sgMail = require('@sendgrid/mail');

class EmailHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.sendGridApiKey = process.env.SENDGRID_API_KEY;

    // Initialize SendGrid
    if (this.sendGridApiKey) {
      sgMail.setApiKey(this.sendGridApiKey);
    }

    // Bind all methods to preserve 'this' context
    this.sendEmail = this.sendEmail.bind(this);
    this.sendBulkEmail = this.sendBulkEmail.bind(this);
    this.getEmailTemplates = this.getEmailTemplates.bind(this);
    this.getEmailTemplateById = this.getEmailTemplateById.bind(this);
    this.createEmailTemplate = this.createEmailTemplate.bind(this);
    this.updateEmailTemplate = this.updateEmailTemplate.bind(this);
    this.deleteEmailTemplate = this.deleteEmailTemplate.bind(this);
    this.getEmailTracking = this.getEmailTracking.bind(this);
    this.getEmailTrackingById = this.getEmailTrackingById.bind(this);
    this.getEmailSchedules = this.getEmailSchedules.bind(this);
    this.getEmailScheduleById = this.getEmailScheduleById.bind(this);
    this.createEmailSchedule = this.createEmailSchedule.bind(this);
    this.updateEmailSchedule = this.updateEmailSchedule.bind(this);
    this.deleteEmailSchedule = this.deleteEmailSchedule.bind(this);
    this.getEmailStatistics = this.getEmailStatistics.bind(this);
    this.getEmailTemplateStatistics = this.getEmailTemplateStatistics.bind(this);
    this.processEmailWebhook = this.processEmailWebhook.bind(this);
  }

  // === EMAIL SENDING METHODS ===
  async sendEmail(request, h) {
    try {
      const emailData = {
        ...request.payload,
        organization_id: request.auth.credentials.organization_id,
        sent_by: request.auth.credentials.user_id,
        sent_at: new Date()
      };

      // If template_id is provided, get template and merge data
      if (emailData.template_id) {
        const template = await this._service.getEmailTemplateById(emailData.template_id, emailData.organization_id);
        if (!template) {
          throw Boom.notFound('Email template not found');
        }

        // Merge template with data
        emailData.subject = emailData.subject || template.subject;
        emailData.html_content = this.mergeTemplate(template.html_content, emailData.template_data || {});
        emailData.text_content = template.text_content ? this.mergeTemplate(template.text_content, emailData.template_data || {}) : null;
      }

      // Send email via SendGrid
      const sendGridResult = await this.sendViaSendGrid(emailData);

      // Store email record
      const emailRecord = await this._service.createEmailRecord({
        ...emailData,
        sendgrid_message_id: sendGridResult.messageId,
        status: 'sent'
      });

      return h.response({
        success: true,
        message: 'Email sent successfully',
        data: {
          email_id: emailRecord.id,
          message_id: sendGridResult.messageId,
          status: 'sent'
        }
      }).code(200);
    } catch (error) {
      console.error('Error sending email:', error);
      throw Boom.internal('Failed to send email');
    }
  }

  async sendBulkEmail(request, h) {
    try {
      const { recipients, subject, template_id, template_data, scheduled_at, track_opens, track_clicks } = request.payload;
      const organizationId = request.auth.credentials.organization_id;
      const sentBy = request.auth.credentials.user_id;

      // Get template
      const template = await this._service.getEmailTemplateById(template_id, organizationId);
      if (!template) {
        throw Boom.notFound('Email template not found');
      }

      const results = [];
      const batchSize = 100; // SendGrid batch limit

      // Process recipients in batches
      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        const batchResults = await this.processBulkEmailBatch(batch, subject, template, template_data, organizationId, sentBy, track_opens, track_clicks);
        results.push(...batchResults);
      }

      return h.response({
        success: true,
        message: `Bulk email sent successfully to ${results.length} recipients`,
        data: {
          total_recipients: recipients.length,
          successful_sends: results.filter(r => r.status === 'sent').length,
          failed_sends: results.filter(r => r.status === 'failed').length,
          results
        }
      }).code(200);
    } catch (error) {
      console.error('Error sending bulk email:', error);
      throw Boom.internal('Failed to send bulk email');
    }
  }

  // === EMAIL TEMPLATES METHODS ===
  async getEmailTemplates(request, h) {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC', category, is_active } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { category, is_active };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sortBy, sortOrder };

      const templates = await this._service.getEmailTemplates(organizationId, filters, pagination);
      const total = await this._service.countEmailTemplates(organizationId, filters);

      return h.response({
        success: true,
        data: templates,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      }).code(200);
    } catch (error) {
      console.error('Error getting email templates:', error);
      throw Boom.internal('Failed to get email templates');
    }
  }

  async getEmailTemplateById(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const template = await this._service.getEmailTemplateById(id, organizationId);
      if (!template) {
        throw Boom.notFound('Email template not found');
      }

      return h.response({
        success: true,
        data: template
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error getting email template:', error);
      throw Boom.internal('Failed to get email template');
    }
  }

  async createEmailTemplate(request, h) {
    try {
      const templateData = {
        ...request.payload,
        organization_id: request.auth.credentials.organization_id,
        created_by: request.auth.credentials.user_id
      };

      const template = await this._service.createEmailTemplate(templateData);

      return h.response({
        success: true,
        message: 'Email template created successfully',
        data: template
      }).code(201);
    } catch (error) {
      console.error('Error creating email template:', error);
      throw Boom.internal('Failed to create email template');
    }
  }

  async updateEmailTemplate(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;
      const updateData = request.payload;

      const template = await this._service.updateEmailTemplate(id, organizationId, updateData);
      if (!template) {
        throw Boom.notFound('Email template not found');
      }

      return h.response({
        success: true,
        message: 'Email template updated successfully',
        data: template
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error updating email template:', error);
      throw Boom.internal('Failed to update email template');
    }
  }

  async deleteEmailTemplate(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const template = await this._service.deleteEmailTemplate(id, organizationId);
      if (!template) {
        throw Boom.notFound('Email template not found');
      }

      return h.response({
        success: true,
        message: 'Email template deleted successfully'
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error deleting email template:', error);
      throw Boom.internal('Failed to delete email template');
    }
  }

  // === EMAIL TRACKING METHODS ===
  async getEmailTracking(request, h) {
    try {
      const { page = 1, limit = 10, sortBy = 'sent_at', sortOrder = 'DESC', status, template_id, start_date, end_date } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { status, template_id, start_date, end_date };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sortBy, sortOrder };

      const tracking = await this._service.getEmailTracking(organizationId, filters, pagination);
      const total = await this._service.countEmailTracking(organizationId, filters);

      return h.response({
        success: true,
        data: tracking,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      }).code(200);
    } catch (error) {
      console.error('Error getting email tracking:', error);
      throw Boom.internal('Failed to get email tracking');
    }
  }

  async getEmailTrackingById(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const tracking = await this._service.getEmailTrackingById(id, organizationId);
      if (!tracking) {
        throw Boom.notFound('Email tracking record not found');
      }

      return h.response({
        success: true,
        data: tracking
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error getting email tracking:', error);
      throw Boom.internal('Failed to get email tracking');
    }
  }

  // === EMAIL SCHEDULING METHODS ===
  async getEmailSchedules(request, h) {
    try {
      const { page = 1, limit = 10, sortBy = 'scheduled_at', sortOrder = 'ASC', is_active, repeat_type } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { is_active, repeat_type };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sortBy, sortOrder };

      const schedules = await this._service.getEmailSchedules(organizationId, filters, pagination);
      const total = await this._service.countEmailSchedules(organizationId, filters);

      return h.response({
        success: true,
        data: schedules,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      }).code(200);
    } catch (error) {
      console.error('Error getting email schedules:', error);
      throw Boom.internal('Failed to get email schedules');
    }
  }

  async getEmailScheduleById(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const schedule = await this._service.getEmailScheduleById(id, organizationId);
      if (!schedule) {
        throw Boom.notFound('Email schedule not found');
      }

      return h.response({
        success: true,
        data: schedule
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error getting email schedule:', error);
      throw Boom.internal('Failed to get email schedule');
    }
  }

  async createEmailSchedule(request, h) {
    try {
      const scheduleData = {
        ...request.payload,
        organization_id: request.auth.credentials.organization_id,
        created_by: request.auth.credentials.user_id
      };

      const schedule = await this._service.createEmailSchedule(scheduleData);

      return h.response({
        success: true,
        message: 'Email schedule created successfully',
        data: schedule
      }).code(201);
    } catch (error) {
      console.error('Error creating email schedule:', error);
      throw Boom.internal('Failed to create email schedule');
    }
  }

  async updateEmailSchedule(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;
      const updateData = request.payload;

      const schedule = await this._service.updateEmailSchedule(id, organizationId, updateData);
      if (!schedule) {
        throw Boom.notFound('Email schedule not found');
      }

      return h.response({
        success: true,
        message: 'Email schedule updated successfully',
        data: schedule
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error updating email schedule:', error);
      throw Boom.internal('Failed to update email schedule');
    }
  }

  async deleteEmailSchedule(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const schedule = await this._service.deleteEmailSchedule(id, organizationId);
      if (!schedule) {
        throw Boom.notFound('Email schedule not found');
      }

      return h.response({
        success: true,
        message: 'Email schedule deleted successfully'
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error deleting email schedule:', error);
      throw Boom.internal('Failed to delete email schedule');
    }
  }

  // === EMAIL STATISTICS METHODS ===
  async getEmailStatistics(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { period = 'month', template_id, start_date, end_date } = request.query;

      const statistics = await this._service.getEmailStatistics(organizationId, { period, template_id, start_date, end_date });

      return h.response({
        success: true,
        data: statistics
      }).code(200);
    } catch (error) {
      console.error('Error getting email statistics:', error);
      throw Boom.internal('Failed to get email statistics');
    }
  }

  async getEmailTemplateStatistics(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { period = 'month', start_date, end_date } = request.query;

      const statistics = await this._service.getEmailTemplateStatistics(organizationId, { period, start_date, end_date });

      return h.response({
        success: true,
        data: statistics
      }).code(200);
    } catch (error) {
      console.error('Error getting email template statistics:', error);
      throw Boom.internal('Failed to get email template statistics');
    }
  }

  // === EMAIL WEBHOOK METHODS ===
  async processEmailWebhook(request, h) {
    try {
      const webhookData = request.payload;
      const organizationId = request.auth.credentials.organization_id;

      // Process webhook event
      await this._service.processEmailWebhook(webhookData, organizationId);

      return h.response({
        success: true,
        message: 'Webhook processed successfully'
      }).code(200);
    } catch (error) {
      console.error('Error processing email webhook:', error);
      throw Boom.internal('Failed to process email webhook');
    }
  }

  // === HELPER METHODS ===
  async sendViaSendGrid(emailData) {
    if (!this.sendGridApiKey) {
      throw new Error('SendGrid API key not configured');
    }

    const msg = {
      to: emailData.to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourcompany.com',
      subject: emailData.subject,
      html: emailData.html_content,
      text: emailData.text_content,
      trackingSettings: {
        clickTracking: {
          enable: emailData.track_clicks,
          enableText: emailData.track_clicks
        },
        openTracking: {
          enable: emailData.track_opens
        }
      }
    };

    if (emailData.cc) msg.cc = emailData.cc;
    if (emailData.bcc) msg.bcc = emailData.bcc;
    if (emailData.attachments) msg.attachments = emailData.attachments;

    const result = await sgMail.send(msg);
    return {
      messageId: result[0].headers['x-message-id']
    };
  }

  async processBulkEmailBatch(recipients, subject, template, templateData, organizationId, sentBy, trackOpens, trackClicks) {
    const results = [];

    for (const recipient of recipients) {
      try {
        // Merge template with recipient-specific data
        const mergedData = { ...templateData, ...recipient.data };
        const htmlContent = this.mergeTemplate(template.html_content, mergedData);
        const textContent = template.text_content ? this.mergeTemplate(template.text_content, mergedData) : null;

        const emailData = {
          to: [recipient.email],
          subject: subject,
          html_content: htmlContent,
          text_content: textContent,
          track_opens: trackOpens,
          track_clicks: trackClicks,
          organization_id: organizationId,
          sent_by: sentBy,
          template_id: template.id
        };

        const sendGridResult = await this.sendViaSendGrid(emailData);

        const emailRecord = await this._service.createEmailRecord({
          ...emailData,
          sendgrid_message_id: sendGridResult.messageId,
          status: 'sent'
        });

        results.push({
          email: recipient.email,
          status: 'sent',
          message_id: sendGridResult.messageId,
          email_id: emailRecord.id
        });
      } catch (error) {
        console.error(`Error sending email to ${recipient.email}:`, error);
        results.push({
          email: recipient.email,
          status: 'failed',
          error: error.message
        });
      }
    }

    return results;
  }

  mergeTemplate(template, data) {
    let merged = template;

    // Replace variables in template with data
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      merged = merged.replace(regex, data[key]);
    });

    return merged;
  }
}

module.exports = EmailHandler;
