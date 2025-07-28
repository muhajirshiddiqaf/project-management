// Email records queries
const createEmailRecord = `
  INSERT INTO email_records (
    organization_id, to_emails, cc_emails, bcc_emails, subject,
    html_content, text_content, template_id, sendgrid_message_id, status, sent_by, sent_at
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
  ) RETURNING *
`;

// Email templates queries
const getEmailTemplates = `
  SELECT
    et.*,
    u.name as created_by_name,
    COALESCE(COUNT(er.id), 0) as usage_count
  FROM email_templates et
  LEFT JOIN users u ON et.created_by = u.id
  LEFT JOIN email_records er ON et.id = er.template_id
  WHERE et.organization_id = $1
  GROUP BY et.id, u.name
  ORDER BY et.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countEmailTemplates = `
  SELECT COUNT(*) as count
  FROM email_templates
  WHERE organization_id = $1
`;

const findEmailTemplateById = `
  SELECT
    et.*,
    u.name as created_by_name
  FROM email_templates et
  LEFT JOIN users u ON et.created_by = u.id
  WHERE et.id = $1 AND et.organization_id = $2
`;

const createEmailTemplate = `
  INSERT INTO email_templates (
    organization_id, name, description, subject, html_content,
    text_content, variables, category, is_active, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
  ) RETURNING *
`;

const deleteEmailTemplate = `
  DELETE FROM email_templates
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

// Email tracking queries
const getEmailTracking = `
  SELECT
    et.*,
    er.subject,
    er.to_emails,
    er.sendgrid_message_id,
    et.name as template_name,
    u.name as sent_by_name
  FROM email_tracking et
  LEFT JOIN email_records er ON et.email_record_id = er.id
  LEFT JOIN email_templates et ON er.template_id = et.id
  LEFT JOIN users u ON er.sent_by = u.id
  WHERE et.organization_id = $1
  ORDER BY et.sent_at DESC
  LIMIT $2 OFFSET $3
`;

const countEmailTracking = `
  SELECT COUNT(*) as count
  FROM email_tracking
  WHERE organization_id = $1
`;

const findEmailTrackingById = `
  SELECT
    et.*,
    er.subject,
    er.to_emails,
    er.sendgrid_message_id,
    et.name as template_name,
    u.name as sent_by_name
  FROM email_tracking et
  LEFT JOIN email_records er ON et.email_record_id = er.id
  LEFT JOIN email_templates et ON er.template_id = et.id
  LEFT JOIN users u ON er.sent_by = u.id
  WHERE et.id = $1 AND et.organization_id = $2
`;

// Email scheduling queries
const getEmailSchedules = `
  SELECT
    es.*,
    et.name as template_name,
    u.name as created_by_name
  FROM email_schedules es
  LEFT JOIN email_templates et ON es.template_id = et.id
  LEFT JOIN users u ON es.created_by = u.id
  WHERE es.organization_id = $1
  ORDER BY es.scheduled_at ASC
  LIMIT $2 OFFSET $3
`;

const countEmailSchedules = `
  SELECT COUNT(*) as count
  FROM email_schedules
  WHERE organization_id = $1
`;

const findEmailScheduleById = `
  SELECT
    es.*,
    et.name as template_name,
    u.name as created_by_name
  FROM email_schedules es
  LEFT JOIN email_templates et ON es.template_id = et.id
  LEFT JOIN users u ON es.created_by = u.id
  WHERE es.id = $1 AND es.organization_id = $2
`;

const createEmailSchedule = `
  INSERT INTO email_schedules (
    organization_id, template_id, recipients, subject, template_data,
    scheduled_at, timezone, repeat_type, repeat_interval, end_date, is_active, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
  ) RETURNING *
`;

const deleteEmailSchedule = `
  DELETE FROM email_schedules
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

// Email statistics queries
const getEmailStatistics = `
  SELECT
    COUNT(*) as total_emails,
    COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_emails,
    COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_emails,
    COUNT(CASE WHEN status = 'opened' THEN 1 END) as opened_emails,
    COUNT(CASE WHEN status = 'clicked' THEN 1 END) as clicked_emails,
    COUNT(CASE WHEN status = 'bounced' THEN 1 END) as bounced_emails,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_emails,
    COALESCE(AVG(CASE WHEN opened_at IS NOT NULL THEN EXTRACT(EPOCH FROM (opened_at - sent_at)) END), 0) as avg_open_time_seconds,
    COUNT(DISTINCT template_id) as unique_templates_used,
    COUNT(DISTINCT sent_by) as unique_senders
  FROM email_records
  WHERE organization_id = $1
`;

const getEmailTemplateStatistics = `
  SELECT
    et.name as template_name,
    et.category,
    COUNT(er.id) as total_sends,
    COUNT(CASE WHEN er.status = 'sent' THEN 1 END) as sent_count,
    COUNT(CASE WHEN er.status = 'delivered' THEN 1 END) as delivered_count,
    COUNT(CASE WHEN er.status = 'opened' THEN 1 END) as opened_count,
    COUNT(CASE WHEN er.status = 'clicked' THEN 1 END) as clicked_count,
    COUNT(CASE WHEN er.status = 'bounced' THEN 1 END) as bounced_count,
    COUNT(CASE WHEN er.status = 'failed' THEN 1 END) as failed_count,
    COALESCE(AVG(CASE WHEN er.opened_at IS NOT NULL THEN EXTRACT(EPOCH FROM (er.opened_at - er.sent_at)) END), 0) as avg_open_time_seconds
  FROM email_templates et
  LEFT JOIN email_records er ON et.id = er.template_id
  WHERE et.organization_id = $1
  GROUP BY et.id, et.name, et.category
  ORDER BY total_sends DESC
`;

// Email webhook queries
const processEmailWebhook = `
  INSERT INTO email_webhook_events (
    event_type, email, timestamp, sg_message_id, sg_event_id, sg_event_type,
    useragent, ip_address, url, reason, status, response, attempt,
    category, marketing_campaign_id, marketing_campaign_name,
    marketing_campaign_split_id, marketing_campaign_version, organization_id
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
  ) RETURNING *
`;

module.exports = {
  createEmailRecord,
  getEmailTemplates,
  countEmailTemplates,
  findEmailTemplateById,
  createEmailTemplate,
  deleteEmailTemplate,
  getEmailTracking,
  countEmailTracking,
  findEmailTrackingById,
  getEmailSchedules,
  countEmailSchedules,
  findEmailScheduleById,
  createEmailSchedule,
  deleteEmailSchedule,
  getEmailStatistics,
  getEmailTemplateStatistics,
  processEmailWebhook
};
