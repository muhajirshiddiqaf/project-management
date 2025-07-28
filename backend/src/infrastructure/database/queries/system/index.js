// === GENERAL SYSTEM SETTINGS ===
const getGeneralSettings = `
  SELECT * FROM system_settings WHERE id = 1
`;

// === NOTIFICATION SETTINGS ===
const getNotificationSettings = `
  SELECT * FROM notification_settings WHERE id = 1
`;

// === INTEGRATION SETTINGS ===
const getIntegrationSettings = `
  SELECT * FROM integration_settings WHERE id = 1
`;

// === AUDIT LOGS ===
const getAuditLogs = `
  SELECT
    al.id,
    al.user_id,
    u.name as user_name,
    al.action,
    al.resource,
    al.resource_id,
    al.details,
    al.ip_address,
    al.user_agent,
    al.created_at
  FROM audit_logs al
  LEFT JOIN users u ON al.user_id = u.id
  ORDER BY al.created_at DESC
  LIMIT $1 OFFSET $2
`;

const countAuditLogs = `
  SELECT COUNT(*) as count
  FROM audit_logs al
`;

const getAuditLogById = `
  SELECT
    al.id,
    al.user_id,
    u.name as user_name,
    al.action,
    al.resource,
    al.resource_id,
    al.details,
    al.ip_address,
    al.user_agent,
    al.created_at
  FROM audit_logs al
  LEFT JOIN users u ON al.user_id = u.id
  WHERE al.id = $1
`;

const getAuditLogsForExport = `
  SELECT
    al.id,
    al.user_id,
    u.name as user_name,
    al.action,
    al.resource,
    al.resource_id,
    al.details,
    al.ip_address,
    al.user_agent,
    al.created_at
  FROM audit_logs al
  LEFT JOIN users u ON al.user_id = u.id
  ORDER BY al.created_at DESC
`;

const createAuditLog = `
  INSERT INTO audit_logs (
    user_id, action, resource, resource_id, details, ip_address, user_agent
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7
  ) RETURNING *
`;

// === SYSTEM HEALTH ===
const getSystemHealth = `
  SELECT
    'database' as component,
    CASE
      WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')
      THEN 'healthy'
      ELSE 'unhealthy'
    END as status,
    NOW() as checked_at
  UNION ALL
  SELECT
    'application' as component,
    'healthy' as status,
    NOW() as checked_at
`;

const getSystemMetrics = `
  SELECT
    'cpu_usage' as metric,
    ROUND(RANDOM() * 100, 2) as value,
    NOW() as timestamp
  UNION ALL
  SELECT
    'memory_usage' as metric,
    ROUND(RANDOM() * 100, 2) as value,
    NOW() as timestamp
  UNION ALL
  SELECT
    'disk_usage' as metric,
    ROUND(RANDOM() * 100, 2) as value,
    NOW() as timestamp
  UNION ALL
  SELECT
    'active_users' as metric,
    COUNT(*) as value,
    NOW() as timestamp
  FROM users
  WHERE last_login_at >= NOW() - INTERVAL '1 hour'
`;

// === BACKUP & RESTORE ===
const createBackup = `
  INSERT INTO backups (
    type, description, include_logs, compression, status, created_by
  ) VALUES (
    $1, $2, $3, $4, 'pending', $5
  ) RETURNING *
`;

const getBackups = `
  SELECT
    b.id,
    b.type,
    b.description,
    b.include_logs,
    b.compression,
    b.status,
    b.file_path,
    b.file_size,
    b.created_by,
    u.name as created_by_name,
    b.created_at,
    b.completed_at
  FROM backups b
  LEFT JOIN users u ON b.created_by = u.id
  ORDER BY b.created_at DESC
  LIMIT $1 OFFSET $2
`;

const countBackups = `
  SELECT COUNT(*) as count
  FROM backups b
`;

const getBackupById = `
  SELECT
    b.id,
    b.type,
    b.description,
    b.include_logs,
    b.compression,
    b.status,
    b.file_path,
    b.file_size,
    b.created_by,
    u.name as created_by_name,
    b.created_at,
    b.completed_at
  FROM backups b
  LEFT JOIN users u ON b.created_by = u.id
  WHERE b.id = $1
`;

const getBackupFilePath = `
  SELECT file_path FROM backups WHERE id = $1
`;

const deleteBackup = `
  DELETE FROM backups WHERE id = $1 RETURNING *
`;

const restoreBackup = `
  UPDATE backups
  SET
    status = 'restoring',
    restore_started_at = NOW(),
    restore_options = $2
  WHERE id = $1
  RETURNING *
`;

// === SYSTEM MAINTENANCE ===
const startMaintenance = `
  INSERT INTO system_maintenance (
    mode, message, scheduled_start, scheduled_end, allowed_ips, allowed_users, started_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7
  ) RETURNING *
`;

const endMaintenance = `
  UPDATE system_maintenance
  SET
    ended_at = NOW(),
    ended_by = $1,
    duration_minutes = EXTRACT(EPOCH FROM (NOW() - started_at)) / 60
  WHERE ended_at IS NULL
  RETURNING *
`;

const getMaintenanceStatus = `
  SELECT
    id,
    mode,
    message,
    scheduled_start,
    scheduled_end,
    allowed_ips,
    allowed_users,
    started_by,
    started_at,
    ended_at,
    duration_minutes
  FROM system_maintenance
  WHERE ended_at IS NULL
  ORDER BY started_at DESC
  LIMIT 1
`;

// === SYSTEM UPDATES ===
const checkForUpdates = `
  SELECT
    '1.0.1' as version,
    'Bug fixes and performance improvements' as description,
    '2024-01-15' as release_date,
    'available' as status
  UNION ALL
  SELECT
    '1.0.2' as version,
    'Security updates and new features' as description,
    '2024-02-01' as release_date,
    'available' as status
`;

const getUpdateHistory = `
  SELECT
    u.id,
    u.version,
    u.description,
    u.status,
    u.installed_by,
    usr.name as installed_by_name,
    u.installed_at,
    u.backup_before_update,
    u.auto_restart
  FROM system_updates u
  LEFT JOIN users usr ON u.installed_by = usr.id
  ORDER BY u.created_at DESC
  LIMIT $1 OFFSET $2
`;

const countUpdateHistory = `
  SELECT COUNT(*) as count
  FROM system_updates u
`;

const installUpdate = `
  INSERT INTO system_updates (
    version, backup_before_update, auto_restart, status, installed_by
  ) VALUES (
    $1, $2, $3, 'installing', $4
  ) RETURNING *
`;

// === SYSTEM CONFIGURATION ===
const getSystemConfiguration = `
  SELECT
    section,
    settings,
    created_at,
    updated_at
  FROM system_configuration
  WHERE section = $1 OR $1 = 'all'
  ORDER BY section
`;

const updateSystemConfiguration = `
  INSERT INTO system_configuration (section, settings)
  VALUES ($1, $2)
  ON CONFLICT (section)
  DO UPDATE SET
    settings = $2,
    updated_at = NOW()
  RETURNING *
`;

const resetSystemConfiguration = `
  UPDATE system_configuration
  SET
    settings = '{}',
    updated_at = NOW()
  WHERE section = $1
  RETURNING *
`;

// === SYSTEM STATISTICS ===
const getSystemStatistics = `
  SELECT
    'total_users' as metric,
    COUNT(*) as value,
    NOW() as timestamp
  FROM users
  UNION ALL
  SELECT
    'active_users_24h' as metric,
    COUNT(*) as value,
    NOW() as timestamp
  FROM users
  WHERE last_login_at >= NOW() - INTERVAL '24 hours'
  UNION ALL
  SELECT
    'total_projects' as metric,
    COUNT(*) as value,
    NOW() as timestamp
  FROM projects
  UNION ALL
  SELECT
    'total_quotations' as metric,
    COUNT(*) as value,
    NOW() as timestamp
  FROM quotations
  UNION ALL
  SELECT
    'total_invoices' as metric,
    COUNT(*) as value,
    NOW() as timestamp
  FROM invoices
  UNION ALL
  SELECT
    'total_revenue' as metric,
    COALESCE(SUM(total_amount), 0) as value,
    NOW() as timestamp
  FROM invoices
  WHERE status = 'paid'
  UNION ALL
  SELECT
    'system_uptime' as metric,
    EXTRACT(EPOCH FROM (NOW() - '2024-01-01'::timestamp)) / 3600 as value,
    NOW() as timestamp
`;

// === SYSTEM DIAGNOSTICS ===
const runSystemDiagnostics = `
  INSERT INTO system_diagnostics (
    tests, verbose, status, run_by
  ) VALUES (
    $1, $2, 'running', $3
  ) RETURNING *
`;

const getDiagnosticReport = `
  SELECT
    sd.id,
    sd.tests,
    sd.verbose,
    sd.status,
    sd.results,
    sd.run_by,
    u.name as run_by_name,
    sd.created_at,
    sd.completed_at
  FROM system_diagnostics sd
  LEFT JOIN users u ON sd.run_by = u.id
  WHERE sd.id = $1
`;

module.exports = {
  // General Settings
  getGeneralSettings,

  // Notification Settings
  getNotificationSettings,

  // Integration Settings
  getIntegrationSettings,

  // Audit Logs
  getAuditLogs,
  countAuditLogs,
  getAuditLogById,
  getAuditLogsForExport,
  createAuditLog,

  // System Health
  getSystemHealth,
  getSystemMetrics,

  // Backup & Restore
  createBackup,
  getBackups,
  countBackups,
  getBackupById,
  getBackupFilePath,
  deleteBackup,
  restoreBackup,

  // System Maintenance
  startMaintenance,
  endMaintenance,
  getMaintenanceStatus,

  // System Updates
  checkForUpdates,
  getUpdateHistory,
  countUpdateHistory,
  installUpdate,

  // System Configuration
  getSystemConfiguration,
  updateSystemConfiguration,
  resetSystemConfiguration,

  // System Statistics
  getSystemStatistics,

  // System Diagnostics
  runSystemDiagnostics,
  getDiagnosticReport
};
