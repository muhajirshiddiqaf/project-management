const { queries } = require('../database/queries');

class SystemRepository {
  constructor(db) {
    this.db = db;
  }

  // === GENERAL SYSTEM SETTINGS ===

  async getGeneralSettings() {
    try {
      const { rows } = await this.db.query(queries.system.getGeneralSettings);
      return rows[0] || {};
    } catch (error) {
      throw new Error('Failed to get general settings');
    }
  }

  async updateGeneralSettings(updateData) {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

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

      setClause.push('updated_at = NOW()');

      const query = `
        UPDATE system_settings
        SET ${setClause.join(', ')}
        WHERE id = 1
        RETURNING *
      `;

      const { rows } = await this.db.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to update general settings');
    }
  }

  // === NOTIFICATION SETTINGS ===

  async getNotificationSettings() {
    try {
      const { rows } = await this.db.query(queries.system.getNotificationSettings);
      return rows[0] || {};
    } catch (error) {
      throw new Error('Failed to get notification settings');
    }
  }

  async updateNotificationSettings(updateData) {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

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

      setClause.push('updated_at = NOW()');

      const query = `
        UPDATE notification_settings
        SET ${setClause.join(', ')}
        WHERE id = 1
        RETURNING *
      `;

      const { rows } = await this.db.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to update notification settings');
    }
  }

  // === INTEGRATION SETTINGS ===

  async getIntegrationSettings() {
    try {
      const { rows } = await this.db.query(queries.system.getIntegrationSettings);
      return rows[0] || {};
    } catch (error) {
      throw new Error('Failed to get integration settings');
    }
  }

  async updateIntegrationSettings(updateData) {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

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

      setClause.push('updated_at = NOW()');

      const query = `
        UPDATE integration_settings
        SET ${setClause.join(', ')}
        WHERE id = 1
        RETURNING *
      `;

      const { rows } = await this.db.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to update integration settings');
    }
  }

  // === AUDIT LOGS ===

  async getAuditLogs(filters = {}, pagination = {}) {
    try {
      const { user_id, action, resource, resource_id, start_date, end_date, ip_address } = filters;
      const { page, limit, sort_by, sort_order } = pagination;
      const offset = (page - 1) * limit;

      let query = queries.system.getAuditLogs;
      let params = [limit, offset];

      // Add filters
      let whereConditions = [];
      let paramIndex = 3;

      if (user_id) {
        whereConditions.push(`al.user_id = $${paramIndex}`);
        params.push(user_id);
        paramIndex++;
      }

      if (action) {
        whereConditions.push(`al.action = $${paramIndex}`);
        params.push(action);
        paramIndex++;
      }

      if (resource) {
        whereConditions.push(`al.resource = $${paramIndex}`);
        params.push(resource);
        paramIndex++;
      }

      if (resource_id) {
        whereConditions.push(`al.resource_id = $${paramIndex}`);
        params.push(resource_id);
        paramIndex++;
      }

      if (start_date) {
        whereConditions.push(`al.created_at >= $${paramIndex}`);
        params.push(start_date);
        paramIndex++;
      }

      if (end_date) {
        whereConditions.push(`al.created_at <= $${paramIndex}`);
        params.push(end_date);
        paramIndex++;
      }

      if (ip_address) {
        whereConditions.push(`al.ip_address = $${paramIndex}`);
        params.push(ip_address);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query = query.replace('ORDER BY', 'WHERE ' + whereConditions.join(' AND ') + ' ORDER BY');
      }

      // Add sorting
      query = query.replace('ORDER BY al.created_at DESC', `ORDER BY al.${sort_by} ${sort_order.toUpperCase()}`);

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get audit logs');
    }
  }

  async countAuditLogs(filters = {}) {
    try {
      const { user_id, action, resource, resource_id, start_date, end_date, ip_address } = filters;

      let query = queries.system.countAuditLogs;
      let params = [];
      let paramIndex = 1;

      let whereConditions = [];

      if (user_id) {
        whereConditions.push(`al.user_id = $${paramIndex}`);
        params.push(user_id);
        paramIndex++;
      }

      if (action) {
        whereConditions.push(`al.action = $${paramIndex}`);
        params.push(action);
        paramIndex++;
      }

      if (resource) {
        whereConditions.push(`al.resource = $${paramIndex}`);
        params.push(resource);
        paramIndex++;
      }

      if (resource_id) {
        whereConditions.push(`al.resource_id = $${paramIndex}`);
        params.push(resource_id);
        paramIndex++;
      }

      if (start_date) {
        whereConditions.push(`al.created_at >= $${paramIndex}`);
        params.push(start_date);
        paramIndex++;
      }

      if (end_date) {
        whereConditions.push(`al.created_at <= $${paramIndex}`);
        params.push(end_date);
        paramIndex++;
      }

      if (ip_address) {
        whereConditions.push(`al.ip_address = $${paramIndex}`);
        params.push(ip_address);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query = query.replace('FROM audit_logs al', 'FROM audit_logs al WHERE ' + whereConditions.join(' AND '));
      }

      const { rows } = await this.db.query(query, params);
      return parseInt(rows[0].count, 10);
    } catch (error) {
      throw new Error('Failed to count audit logs');
    }
  }

  async getAuditLogById(id) {
    try {
      const { rows } = await this.db.query(queries.system.getAuditLogById, [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get audit log by ID');
    }
  }

  async getAuditLogsForExport(filters = {}) {
    try {
      const { start_date, end_date, user_id, action, resource } = filters;

      let query = queries.system.getAuditLogsForExport;
      let params = [];
      let paramIndex = 1;

      let whereConditions = [];

      if (start_date) {
        whereConditions.push(`al.created_at >= $${paramIndex}`);
        params.push(start_date);
        paramIndex++;
      }

      if (end_date) {
        whereConditions.push(`al.created_at <= $${paramIndex}`);
        params.push(end_date);
        paramIndex++;
      }

      if (user_id) {
        whereConditions.push(`al.user_id = $${paramIndex}`);
        params.push(user_id);
        paramIndex++;
      }

      if (action) {
        whereConditions.push(`al.action = $${paramIndex}`);
        params.push(action);
        paramIndex++;
      }

      if (resource) {
        whereConditions.push(`al.resource = $${paramIndex}`);
        params.push(resource);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query = query.replace('ORDER BY al.created_at DESC', 'WHERE ' + whereConditions.join(' AND ') + ' ORDER BY al.created_at DESC');
      }

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get audit logs for export');
    }
  }

  async createAuditLog(auditData) {
    try {
      const { rows } = await this.db.query(queries.system.createAuditLog, [
        auditData.user_id,
        auditData.action,
        auditData.resource,
        auditData.resource_id,
        auditData.details,
        auditData.ip_address,
        auditData.user_agent
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to create audit log');
    }
  }

  // === SYSTEM HEALTH ===

  async getSystemHealth() {
    try {
      const { rows } = await this.db.query(queries.system.getSystemHealth);
      return rows[0] || {};
    } catch (error) {
      throw new Error('Failed to get system health');
    }
  }

  async getSystemMetrics(period, metrics) {
    try {
      const { rows } = await this.db.query(queries.system.getSystemMetrics, [period, metrics]);
      return rows;
    } catch (error) {
      throw new Error('Failed to get system metrics');
    }
  }

  // === BACKUP & RESTORE ===

  async createBackup(backupData) {
    try {
      const { rows } = await this.db.query(queries.system.createBackup, [
        backupData.type,
        backupData.description,
        backupData.include_logs,
        backupData.compression,
        backupData.created_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to create backup');
    }
  }

  async getBackups(filters = {}, pagination = {}) {
    try {
      const { type, status, start_date, end_date } = filters;
      const { page, limit, sort_by, sort_order } = pagination;
      const offset = (page - 1) * limit;

      let query = queries.system.getBackups;
      let params = [limit, offset];

      // Add filters
      let whereConditions = [];
      let paramIndex = 3;

      if (type) {
        whereConditions.push(`b.type = $${paramIndex}`);
        params.push(type);
        paramIndex++;
      }

      if (status) {
        whereConditions.push(`b.status = $${paramIndex}`);
        params.push(status);
        paramIndex++;
      }

      if (start_date) {
        whereConditions.push(`b.created_at >= $${paramIndex}`);
        params.push(start_date);
        paramIndex++;
      }

      if (end_date) {
        whereConditions.push(`b.created_at <= $${paramIndex}`);
        params.push(end_date);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query = query.replace('ORDER BY', 'WHERE ' + whereConditions.join(' AND ') + ' ORDER BY');
      }

      // Add sorting
      query = query.replace('ORDER BY b.created_at DESC', `ORDER BY b.${sort_by} ${sort_order.toUpperCase()}`);

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get backups');
    }
  }

  async countBackups(filters = {}) {
    try {
      const { type, status, start_date, end_date } = filters;

      let query = queries.system.countBackups;
      let params = [];
      let paramIndex = 1;

      let whereConditions = [];

      if (type) {
        whereConditions.push(`b.type = $${paramIndex}`);
        params.push(type);
        paramIndex++;
      }

      if (status) {
        whereConditions.push(`b.status = $${paramIndex}`);
        params.push(status);
        paramIndex++;
      }

      if (start_date) {
        whereConditions.push(`b.created_at >= $${paramIndex}`);
        params.push(start_date);
        paramIndex++;
      }

      if (end_date) {
        whereConditions.push(`b.created_at <= $${paramIndex}`);
        params.push(end_date);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query = query.replace('FROM backups b', 'FROM backups b WHERE ' + whereConditions.join(' AND '));
      }

      const { rows } = await this.db.query(query, params);
      return parseInt(rows[0].count, 10);
    } catch (error) {
      throw new Error('Failed to count backups');
    }
  }

  async getBackupById(id) {
    try {
      const { rows } = await this.db.query(queries.system.getBackupById, [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get backup by ID');
    }
  }

  async getBackupFilePath(id) {
    try {
      const { rows } = await this.db.query(queries.system.getBackupFilePath, [id]);
      return rows[0]?.file_path;
    } catch (error) {
      throw new Error('Failed to get backup file path');
    }
  }

  async deleteBackup(id) {
    try {
      const { rows } = await this.db.query(queries.system.deleteBackup, [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to delete backup');
    }
  }

  async restoreBackup(id, options) {
    try {
      const { rows } = await this.db.query(queries.system.restoreBackup, [
        id,
        options.overwrite_existing,
        options.restore_logs,
        options.validate_only
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to restore backup');
    }
  }

  // === SYSTEM MAINTENANCE ===

  async startMaintenance(maintenanceData) {
    try {
      const { rows } = await this.db.query(queries.system.startMaintenance, [
        maintenanceData.mode,
        maintenanceData.message,
        maintenanceData.scheduled_start,
        maintenanceData.scheduled_end,
        maintenanceData.allowed_ips,
        maintenanceData.allowed_users,
        maintenanceData.started_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to start maintenance');
    }
  }

  async endMaintenance(userId) {
    try {
      const { rows } = await this.db.query(queries.system.endMaintenance, [userId]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to end maintenance');
    }
  }

  async getMaintenanceStatus() {
    try {
      const { rows } = await this.db.query(queries.system.getMaintenanceStatus);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get maintenance status');
    }
  }

  // === SYSTEM UPDATES ===

  async checkForUpdates() {
    try {
      const { rows } = await this.db.query(queries.system.checkForUpdates);
      return rows;
    } catch (error) {
      throw new Error('Failed to check for updates');
    }
  }

  async getUpdateHistory(filters = {}, pagination = {}) {
    try {
      const { status } = filters;
      const { page, limit, sort_by, sort_order } = pagination;
      const offset = (page - 1) * limit;

      let query = queries.system.getUpdateHistory;
      let params = [limit, offset];

      // Add filters
      if (status) {
        query = query.replace('ORDER BY', 'WHERE u.status = $3 ORDER BY');
        params.push(status);
      }

      // Add sorting
      query = query.replace('ORDER BY u.created_at DESC', `ORDER BY u.${sort_by} ${sort_order.toUpperCase()}`);

      const { rows } = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Failed to get update history');
    }
  }

  async countUpdateHistory(filters = {}) {
    try {
      const { status } = filters;

      let query = queries.system.countUpdateHistory;
      let params = [];

      if (status) {
        query = query.replace('FROM system_updates u', 'FROM system_updates u WHERE u.status = $1');
        params.push(status);
      }

      const { rows } = await this.db.query(query, params);
      return parseInt(rows[0].count, 10);
    } catch (error) {
      throw new Error('Failed to count update history');
    }
  }

  async installUpdate(updateData) {
    try {
      const { rows } = await this.db.query(queries.system.installUpdate, [
        updateData.version,
        updateData.backup_before_update,
        updateData.auto_restart,
        updateData.installed_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to install update');
    }
  }

  // === SYSTEM CONFIGURATION ===

  async getSystemConfiguration(section) {
    try {
      const { rows } = await this.db.query(queries.system.getSystemConfiguration, [section]);
      return rows[0] || {};
    } catch (error) {
      throw new Error('Failed to get system configuration');
    }
  }

  async updateSystemConfiguration(section, settings) {
    try {
      const { rows } = await this.db.query(queries.system.updateSystemConfiguration, [
        section,
        settings
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to update system configuration');
    }
  }

  async resetSystemConfiguration(section) {
    try {
      const { rows } = await this.db.query(queries.system.resetSystemConfiguration, [section]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to reset system configuration');
    }
  }

  // === SYSTEM STATISTICS ===

  async getSystemStatistics(period, includeDetails) {
    try {
      const { rows } = await this.db.query(queries.system.getSystemStatistics, [period, includeDetails]);
      return rows;
    } catch (error) {
      throw new Error('Failed to get system statistics');
    }
  }

  // === SYSTEM DIAGNOSTICS ===

  async runSystemDiagnostics(diagnosticsData) {
    try {
      const { rows } = await this.db.query(queries.system.runSystemDiagnostics, [
        diagnosticsData.tests,
        diagnosticsData.verbose,
        diagnosticsData.run_by
      ]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to run system diagnostics');
    }
  }

  async getDiagnosticReport(id) {
    try {
      const { rows } = await this.db.query(queries.system.getDiagnosticReport, [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Failed to get diagnostic report');
    }
  }
}

module.exports = SystemRepository;
