const Joi = require('@hapi/joi');

// Email validation schemas
const emailSchemas = {
  // Send email schema
  sendEmail: Joi.object({
    to: Joi.array().items(Joi.string().email()).min(1).required(),
    cc: Joi.array().items(Joi.string().email()).optional(),
    bcc: Joi.array().items(Joi.string().email()).optional(),
    subject: Joi.string().required().max(200),
    template_id: Joi.string().optional().uuid(),
    template_data: Joi.object().optional(),
    html_content: Joi.string().optional().max(10000),
    text_content: Joi.string().optional().max(10000),
    attachments: Joi.array().items(
      Joi.object({
        filename: Joi.string().required(),
        content: Joi.string().required(),
        content_type: Joi.string().required()
      })
    ).optional(),
    scheduled_at: Joi.date().optional(),
    track_opens: Joi.boolean().default(true),
    track_clicks: Joi.boolean().default(true)
  }),

  // Send bulk email schema
  sendBulkEmail: Joi.object({
    recipients: Joi.array().items(
      Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().optional(),
        data: Joi.object().optional()
      })
    ).min(1).required(),
    subject: Joi.string().required().max(200),
    template_id: Joi.string().required().uuid(),
    template_data: Joi.object().optional(),
    scheduled_at: Joi.date().optional(),
    track_opens: Joi.boolean().default(true),
    track_clicks: Joi.boolean().default(true)
  }),

  // Create email template schema
  createEmailTemplate: Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().optional().max(500),
    subject: Joi.string().required().max(200),
    html_content: Joi.string().required().max(10000),
    text_content: Joi.string().optional().max(10000),
    variables: Joi.array().items(Joi.string()).optional(),
    category: Joi.string().optional().max(50),
    is_active: Joi.boolean().default(true)
  }),

  // Update email template schema
  updateEmailTemplate: Joi.object({
    name: Joi.string().optional().min(3).max(100),
    description: Joi.string().optional().max(500),
    subject: Joi.string().optional().max(200),
    html_content: Joi.string().optional().max(10000),
    text_content: Joi.string().optional().max(10000),
    variables: Joi.array().items(Joi.string()).optional(),
    category: Joi.string().optional().max(50),
    is_active: Joi.boolean().optional()
  }),

  // Get email template by ID schema
  getEmailTemplateById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get email templates schema
  getEmailTemplates: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('name', 'created_at', 'updated_at').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    category: Joi.string().optional(),
    is_active: Joi.boolean().optional()
  }),

  // Delete email template schema
  deleteEmailTemplate: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // === EMAIL TRACKING SCHEMAS ===

  // Get email tracking schema
  getEmailTracking: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('sent_at', 'opened_at', 'clicked_at').default('sent_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    status: Joi.string().valid('sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed').optional(),
    template_id: Joi.string().optional().uuid(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional()
  }),

  // Get email tracking by ID schema
  getEmailTrackingById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // === EMAIL SCHEDULING SCHEMAS ===

  // Create email schedule schema
  createEmailSchedule: Joi.object({
    template_id: Joi.string().required().uuid(),
    recipients: Joi.array().items(Joi.string().email()).min(1).required(),
    subject: Joi.string().required().max(200),
    template_data: Joi.object().optional(),
    scheduled_at: Joi.date().required(),
    timezone: Joi.string().optional().default('UTC'),
    repeat_type: Joi.string().valid('once', 'daily', 'weekly', 'monthly').default('once'),
    repeat_interval: Joi.number().integer().min(1).optional(),
    end_date: Joi.date().optional(),
    is_active: Joi.boolean().default(true)
  }),

  // Update email schedule schema
  updateEmailSchedule: Joi.object({
    template_id: Joi.string().optional().uuid(),
    recipients: Joi.array().items(Joi.string().email()).optional(),
    subject: Joi.string().optional().max(200),
    template_data: Joi.object().optional(),
    scheduled_at: Joi.date().optional(),
    timezone: Joi.string().optional(),
    repeat_type: Joi.string().valid('once', 'daily', 'weekly', 'monthly').optional(),
    repeat_interval: Joi.number().integer().min(1).optional(),
    end_date: Joi.date().optional(),
    is_active: Joi.boolean().optional()
  }),

  // Get email schedule by ID schema
  getEmailScheduleById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get email schedules schema
  getEmailSchedules: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('scheduled_at', 'created_at').default('scheduled_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
    is_active: Joi.boolean().optional(),
    repeat_type: Joi.string().valid('once', 'daily', 'weekly', 'monthly').optional()
  }),

  // Delete email schedule schema
  deleteEmailSchedule: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // === EMAIL STATISTICS SCHEMAS ===

  // Get email statistics schema
  getEmailStatistics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    template_id: Joi.string().optional().uuid(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional()
  }),

  // Get email template statistics schema
  getEmailTemplateStatistics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional()
  }),

  // === EMAIL WEBHOOK SCHEMAS ===

  // Process email webhook schema
  processEmailWebhook: Joi.object({
    event: Joi.string().required(),
    email: Joi.string().email().required(),
    timestamp: Joi.number().required(),
    sg_message_id: Joi.string().optional(),
    sg_event_id: Joi.string().optional(),
    sg_event_type: Joi.string().optional(),
    useragent: Joi.string().optional(),
    ip: Joi.string().optional(),
    url: Joi.string().optional(),
    reason: Joi.string().optional(),
    status: Joi.string().optional(),
    response: Joi.string().optional(),
    attempt: Joi.number().optional(),
    category: Joi.array().items(Joi.string()).optional(),
    marketing_campaign_id: Joi.string().optional(),
    marketing_campaign_name: Joi.string().optional(),
    marketing_campaign_split_id: Joi.string().optional(),
    marketing_campaign_version: Joi.string().optional()
  })
};

module.exports = emailSchemas;
