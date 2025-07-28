// Report records queries
const createReportRecord = `
  INSERT INTO reports (
    organization_id, report_type, format, filters, options, status, generated_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7
  ) RETURNING *
`;

// Scheduled reports queries
const getScheduledReports = `
  SELECT
    sr.*,
    u.name as created_by_name,
    COUNT(r.id) as total_generated
  FROM scheduled_reports sr
  LEFT JOIN users u ON sr.created_by = u.id
  LEFT JOIN reports r ON sr.id = r.scheduled_report_id
  WHERE sr.organization_id = $1
  GROUP BY sr.id, u.name
  ORDER BY sr.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countScheduledReports = `
  SELECT COUNT(*) as count
  FROM scheduled_reports
  WHERE organization_id = $1
`;

const findScheduledReportById = `
  SELECT
    sr.*,
    u.name as created_by_name
  FROM scheduled_reports sr
  LEFT JOIN users u ON sr.created_by = u.id
  WHERE sr.id = $1 AND sr.organization_id = $2
`;

const createScheduledReport = `
  INSERT INTO scheduled_reports (
    organization_id, name, description, report_type, schedule, format,
    recipients, filters, options, is_active, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
  ) RETURNING *
`;

const deleteScheduledReport = `
  DELETE FROM scheduled_reports
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

// Report templates queries
const getReportTemplates = `
  SELECT
    rt.*,
    u.name as created_by_name,
    COUNT(r.id) as usage_count
  FROM report_templates rt
  LEFT JOIN users u ON rt.created_by = u.id
  LEFT JOIN reports r ON rt.id = r.template_id
  WHERE rt.organization_id = $1
  GROUP BY rt.id, u.name
  ORDER BY rt.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countReportTemplates = `
  SELECT COUNT(*) as count
  FROM report_templates
  WHERE organization_id = $1
`;

const findReportTemplateById = `
  SELECT
    rt.*,
    u.name as created_by_name
  FROM report_templates rt
  LEFT JOIN users u ON rt.created_by = u.id
  WHERE rt.id = $1 AND rt.organization_id = $2
`;

const createReportTemplate = `
  INSERT INTO report_templates (
    organization_id, name, description, report_type, template_data,
    is_default, is_active, created_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8
  ) RETURNING *
`;

const deleteReportTemplate = `
  DELETE FROM report_templates
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

// Report history queries
const getReportHistory = `
  SELECT
    r.*,
    u.name as generated_by_name,
    sr.name as scheduled_report_name
  FROM reports r
  LEFT JOIN users u ON r.generated_by = u.id
  LEFT JOIN scheduled_reports sr ON r.scheduled_report_id = sr.id
  WHERE r.organization_id = $1
  ORDER BY r.created_at DESC
  LIMIT $2 OFFSET $3
`;

const countReportHistory = `
  SELECT COUNT(*) as count
  FROM reports
  WHERE organization_id = $1
`;

const findReportById = `
  SELECT
    r.*,
    u.name as generated_by_name,
    sr.name as scheduled_report_name,
    rt.name as template_name
  FROM reports r
  LEFT JOIN users u ON r.generated_by = u.id
  LEFT JOIN scheduled_reports sr ON r.scheduled_report_id = sr.id
  LEFT JOIN report_templates rt ON r.template_id = rt.id
  WHERE r.id = $1 AND r.organization_id = $2
`;

// Report statistics queries
const getReportStatistics = `
  SELECT
    COUNT(*) as total_reports,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_reports,
    COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_reports,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_reports,
    COUNT(DISTINCT report_type) as unique_report_types,
    COUNT(DISTINCT format) as unique_formats,
    COUNT(DISTINCT generated_by) as unique_generators,
    COALESCE(AVG(file_size), 0) as average_file_size,
    COALESCE(SUM(file_size), 0) as total_file_size,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '1 day' THEN 1 END) as reports_today,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '1 week' THEN 1 END) as reports_this_week,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '1 month' THEN 1 END) as reports_this_month
  FROM reports
  WHERE organization_id = $1
`;

const getScheduledReportStatistics = `
  SELECT
    COUNT(*) as total_scheduled_reports,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_scheduled_reports,
    COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_scheduled_reports,
    COUNT(DISTINCT report_type) as unique_report_types,
    COUNT(DISTINCT frequency) as unique_frequencies,
    COUNT(CASE WHEN next_run <= NOW() THEN 1 END) as overdue_reports,
    COUNT(CASE WHEN next_run BETWEEN NOW() AND NOW() + INTERVAL '1 day' THEN 1 END) as due_today,
    COUNT(CASE WHEN next_run BETWEEN NOW() AND NOW() + INTERVAL '1 week' THEN 1 END) as due_this_week
  FROM scheduled_reports
  WHERE organization_id = $1
`;

const getReportTemplateStatistics = `
  SELECT
    rt.name as template_name,
    rt.report_type,
    COUNT(r.id) as total_usage,
    COUNT(CASE WHEN r.created_at >= NOW() - INTERVAL '1 day' THEN 1 END) as used_today,
    COUNT(CASE WHEN r.created_at >= NOW() - INTERVAL '1 week' THEN 1 END) as used_this_week,
    COUNT(CASE WHEN r.created_at >= NOW() - INTERVAL '1 month' THEN 1 END) as used_this_month,
    COALESCE(AVG(r.file_size), 0) as average_file_size,
    COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as successful_generations,
    COUNT(CASE WHEN r.status = 'failed' THEN 1 END) as failed_generations
  FROM report_templates rt
  LEFT JOIN reports r ON rt.id = r.template_id
  WHERE rt.organization_id = $1
  GROUP BY rt.id, rt.name, rt.report_type
  ORDER BY total_usage DESC
`;

// Report type statistics queries
const getReportTypeStatistics = `
  SELECT
    report_type,
    COUNT(*) as total_reports,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_reports,
    COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_reports,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_reports,
    COUNT(DISTINCT format) as unique_formats,
    COALESCE(AVG(file_size), 0) as average_file_size,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '1 day' THEN 1 END) as reports_today,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '1 week' THEN 1 END) as reports_this_week,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '1 month' THEN 1 END) as reports_this_month
  FROM reports
  WHERE organization_id = $1
  GROUP BY report_type
  ORDER BY total_reports DESC
`;

const getFormatStatistics = `
  SELECT
    format,
    COUNT(*) as total_reports,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_reports,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_reports,
    COALESCE(AVG(file_size), 0) as average_file_size,
    COALESCE(SUM(file_size), 0) as total_file_size,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '1 day' THEN 1 END) as reports_today,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '1 week' THEN 1 END) as reports_this_week
  FROM reports
  WHERE organization_id = $1
  GROUP BY format
  ORDER BY total_reports DESC
`;

// Scheduled report execution queries
const getDueScheduledReports = `
  SELECT
    sr.*,
    u.name as created_by_name
  FROM scheduled_reports sr
  LEFT JOIN users u ON sr.created_by = u.id
  WHERE sr.organization_id = $1
    AND sr.is_active = true
    AND sr.next_run <= NOW()
  ORDER BY sr.next_run ASC
`;

const updateScheduledReportNextRun = `
  UPDATE scheduled_reports
  SET
    next_run = CASE
      WHEN frequency = 'daily' THEN next_run + INTERVAL '1 day'
      WHEN frequency = 'weekly' THEN next_run + INTERVAL '1 week'
      WHEN frequency = 'monthly' THEN next_run + INTERVAL '1 month'
      WHEN frequency = 'quarterly' THEN next_run + INTERVAL '3 months'
      WHEN frequency = 'yearly' THEN next_run + INTERVAL '1 year'
      ELSE next_run
    END,
    last_run = NOW(),
    updated_at = NOW()
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

// Report cleanup queries
const getOldReports = `
  SELECT id, file_path
  FROM reports
  WHERE organization_id = $1
    AND created_at < NOW() - INTERVAL '90 days'
    AND file_path IS NOT NULL
  LIMIT $2
`;

const deleteOldReport = `
  DELETE FROM reports
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

module.exports = {
  createReportRecord,
  getScheduledReports,
  countScheduledReports,
  findScheduledReportById,
  createScheduledReport,
  deleteScheduledReport,
  getReportTemplates,
  countReportTemplates,
  findReportTemplateById,
  createReportTemplate,
  deleteReportTemplate,
  getReportHistory,
  countReportHistory,
  findReportById,
  getReportStatistics,
  getScheduledReportStatistics,
  getReportTemplateStatistics,
  getReportTypeStatistics,
  getFormatStatistics,
  getDueScheduledReports,
  updateScheduledReportNextRun,
  getOldReports,
  deleteOldReport
};
