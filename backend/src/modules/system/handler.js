const Boom = require('@hapi/boom');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const archiver = require('archiver');
const xlsx = require('xlsx');

class SystemHandler {
  constructor() {
    this.systemRepository = null;
  }

  setSystemRepository(systemRepository) {
    this.systemRepository = systemRepository;
  }

  // === GENERAL SYSTEM SETTINGS ===

  async getGeneralSettings(request, h) {
    try {
      const settings = await this.systemRepository.getGeneralSettings();

      return h.response({
        success: true,
        data: settings
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get general settings');
    }
  }

  async updateGeneralSettings(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const updateData = request.payload;

      const settings = await this.systemRepository.updateGeneralSettings(updateData);

      // Log activity
      await this.systemRepository.createAuditLog({
        user_id: userId,
        action: 'update',
        resource: 'system_settings',
        resource_id: 'general',
        details: { updated_sections: Object.keys(updateData) },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'General settings updated successfully',
        data: settings
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update general settings');
    }
  }

  // === NOTIFICATION SETTINGS ===

  async getNotificationSettings(request, h) {
    try {
      const settings = await this.systemRepository.getNotificationSettings();

      return h.response({
        success: true,
        data: settings
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get notification settings');
    }
  }

  async updateNotificationSettings(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const updateData = request.payload;

      const settings = await this.systemRepository.updateNotificationSettings(updateData);

      // Log activity
      await this.systemRepository.createAuditLog({
        user_id: userId,
        action: 'update',
        resource: 'system_settings',
        resource_id: 'notifications',
        details: { updated_sections: Object.keys(updateData) },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Notification settings updated successfully',
        data: settings
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update notification settings');
    }
  }

  // === INTEGRATION SETTINGS ===

  async getIntegrationSettings(request, h) {
    try {
      const settings = await this.systemRepository.getIntegrationSettings();

      return h.response({
        success: true,
        data: settings
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get integration settings');
    }
  }

  async updateIntegrationSettings(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const updateData = request.payload;

      const settings = await this.systemRepository.updateIntegrationSettings(updateData);

      // Log activity
      await this.systemRepository.createAuditLog({
        user_id: userId,
        action: 'update',
        resource: 'system_settings',
        resource_id: 'integrations',
        details: { updated_sections: Object.keys(updateData) },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Integration settings updated successfully',
        data: settings
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update integration settings');
    }
  }

  // === AUDIT LOGS ===

  async getAuditLogs(request, h) {
    try {
      const { page, limit, user_id, action, resource, resource_id, start_date, end_date, ip_address, sort_by, sort_order } = request.query;

      const filters = { user_id, action, resource, resource_id, start_date, end_date, ip_address };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [logs, total] = await Promise.all([
        this.systemRepository.getAuditLogs(filters, pagination),
        this.systemRepository.countAuditLogs(filters)
      ]);

      return h.response({
        success: true,
        data: {
          logs,
          pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total,
            total_pages: Math.ceil(total / parseInt(limit, 10))
          }
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get audit logs');
    }
  }

  async getAuditLogById(request, h) {
    try {
      const { id } = request.params;

      const log = await this.systemRepository.getAuditLogById(id);
      if (!log) {
        throw Boom.notFound('Audit log not found');
      }

      return h.response({
        success: true,
        data: log
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get audit log');
    }
  }

  async exportAuditLogs(request, h) {
    try {
      const { format, start_date, end_date, user_id, action, resource } = request.query;

      const filters = { start_date, end_date, user_id, action, resource };
      const logs = await this.systemRepository.getAuditLogsForExport(filters);
      const exportData = await this.formatAuditLogExport(logs, format);

      return h.response(exportData.content)
        .header('Content-Type', exportData.contentType)
        .header('Content-Disposition', `attachment; filename="audit-logs-export.${format}"`);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to export audit logs');
    }
  }

  // === SYSTEM HEALTH ===

  async getSystemHealth(request, h) {
    try {
      const health = await this.systemRepository.getSystemHealth();

      return h.response({
        success: true,
        data: health
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get system health');
    }
  }

  async getSystemMetrics(request, h) {
    try {
      const { period, metrics } = request.query;

      const systemMetrics = await this.systemRepository.getSystemMetrics(period, metrics);

      return h.response({
        success: true,
        data: systemMetrics
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get system metrics');
    }
  }

  // === BACKUP & RESTORE ===

  async createBackup(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { type, description, include_logs, compression } = request.payload;

      const backup = await this.systemRepository.createBackup({
        type,
        description,
        include_logs,
        compression,
        created_by: userId
      });

      // Log activity
      await this.systemRepository.createAuditLog({
        user_id: userId,
        action: 'create',
        resource: 'backup',
        resource_id: backup.id,
        details: { type, description },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Backup created successfully',
        data: backup
      }).code(201);
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to create backup');
    }
  }

  async getBackups(request, h) {
    try {
      const { page, limit, type, status, start_date, end_date, sort_by, sort_order } = request.query;

      const filters = { type, status, start_date, end_date };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [backups, total] = await Promise.all([
        this.systemRepository.getBackups(filters, pagination),
        this.systemRepository.countBackups(filters)
      ]);

      return h.response({
        success: true,
        data: {
          backups,
          pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total,
            total_pages: Math.ceil(total / parseInt(limit, 10))
          }
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get backups');
    }
  }

  async getBackupById(request, h) {
    try {
      const { id } = request.params;

      const backup = await this.systemRepository.getBackupById(id);
      if (!backup) {
        throw Boom.notFound('Backup not found');
      }

      return h.response({
        success: true,
        data: backup
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get backup');
    }
  }

  async downloadBackup(request, h) {
    try {
      const { id } = request.params;

      const backup = await this.systemRepository.getBackupById(id);
      if (!backup) {
        throw Boom.notFound('Backup not found');
      }

      const filePath = await this.systemRepository.getBackupFilePath(id);
      const fileName = `backup-${backup.type}-${backup.created_at.toISOString().split('T')[0]}.zip`;

      return h.file(filePath, { filename: fileName });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to download backup');
    }
  }

  async deleteBackup(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { id } = request.params;

      const backup = await this.systemRepository.deleteBackup(id);
      if (!backup) {
        throw Boom.notFound('Backup not found');
      }

      // Log activity
      await this.systemRepository.createAuditLog({
        user_id: userId,
        action: 'delete',
        resource: 'backup',
        resource_id: id,
        details: { backup_type: backup.type },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Backup deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete backup');
    }
  }

  async restoreBackup(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { id, confirm, options } = request.payload;

      if (!confirm) {
        throw Boom.badRequest('Confirmation required for backup restoration');
      }

      const backup = await this.systemRepository.getBackupById(id);
      if (!backup) {
        throw Boom.notFound('Backup not found');
      }

      const restoreResult = await this.systemRepository.restoreBackup(id, options);

      // Log activity
      await this.systemRepository.createAuditLog({
        user_id: userId,
        action: 'restore',
        resource: 'backup',
        resource_id: id,
        details: { backup_type: backup.type, restore_options: options },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Backup restored successfully',
        data: restoreResult
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to restore backup');
    }
  }

  // === SYSTEM MAINTENANCE ===

  async startMaintenance(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const maintenanceData = request.payload;

      const maintenance = await this.systemRepository.startMaintenance({
        ...maintenanceData,
        started_by: userId
      });

      // Log activity
      await this.systemRepository.createAuditLog({
        user_id: userId,
        action: 'start',
        resource: 'maintenance',
        resource_id: maintenance.id,
        details: { mode: maintenanceData.mode, message: maintenanceData.message },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Maintenance mode started successfully',
        data: maintenance
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to start maintenance mode');
    }
  }

  async endMaintenance(request, h) {
    try {
      const userId = request.auth.credentials.userId;

      const maintenance = await this.systemRepository.endMaintenance(userId);

      // Log activity
      await this.systemRepository.createAuditLog({
        user_id: userId,
        action: 'end',
        resource: 'maintenance',
        resource_id: maintenance.id,
        details: { duration_minutes: maintenance.duration_minutes },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'Maintenance mode ended successfully',
        data: maintenance
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to end maintenance mode');
    }
  }

  async getMaintenanceStatus(request, h) {
    try {
      const status = await this.systemRepository.getMaintenanceStatus();

      return h.response({
        success: true,
        data: status
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get maintenance status');
    }
  }

  // === SYSTEM UPDATES ===

  async checkForUpdates(request, h) {
    try {
      const updates = await this.systemRepository.checkForUpdates();

      return h.response({
        success: true,
        data: updates
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to check for updates');
    }
  }

  async getUpdateHistory(request, h) {
    try {
      const { page, limit, status, sort_by, sort_order } = request.query;

      const filters = { status };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort_by, sort_order };

      const [updates, total] = await Promise.all([
        this.systemRepository.getUpdateHistory(filters, pagination),
        this.systemRepository.countUpdateHistory(filters)
      ]);

      return h.response({
        success: true,
        data: {
          updates,
          pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total,
            total_pages: Math.ceil(total / parseInt(limit, 10))
          }
        }
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get update history');
    }
  }

  async installUpdate(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { version, confirm, backup_before_update, auto_restart } = request.payload;

      if (!confirm) {
        throw Boom.badRequest('Confirmation required for system update');
      }

      const updateResult = await this.systemRepository.installUpdate({
        version,
        backup_before_update,
        auto_restart,
        installed_by: userId
      });

      // Log activity
      await this.systemRepository.createAuditLog({
        user_id: userId,
        action: 'install',
        resource: 'system_update',
        resource_id: updateResult.id,
        details: { version, backup_before_update, auto_restart },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'System update installed successfully',
        data: updateResult
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to install system update');
    }
  }

  // === SYSTEM CONFIGURATION ===

  async getSystemConfiguration(request, h) {
    try {
      const { section } = request.query;

      const configuration = await this.systemRepository.getSystemConfiguration(section);

      return h.response({
        success: true,
        data: configuration
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get system configuration');
    }
  }

  async updateSystemConfiguration(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { section, settings } = request.payload;

      const configuration = await this.systemRepository.updateSystemConfiguration(section, settings);

      // Log activity
      await this.systemRepository.createAuditLog({
        user_id: userId,
        action: 'update',
        resource: 'system_configuration',
        resource_id: section,
        details: { section, updated_settings: Object.keys(settings) },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'System configuration updated successfully',
        data: configuration
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update system configuration');
    }
  }

  async resetSystemConfiguration(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { section, confirm } = request.payload;

      if (!confirm) {
        throw Boom.badRequest('Confirmation required for configuration reset');
      }

      const configuration = await this.systemRepository.resetSystemConfiguration(section);

      // Log activity
      await this.systemRepository.createAuditLog({
        user_id: userId,
        action: 'reset',
        resource: 'system_configuration',
        resource_id: section,
        details: { section },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'System configuration reset successfully',
        data: configuration
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to reset system configuration');
    }
  }

  // === SYSTEM STATISTICS ===

  async getSystemStatistics(request, h) {
    try {
      const { period, include_details } = request.query;

      const statistics = await this.systemRepository.getSystemStatistics(period, include_details);

      return h.response({
        success: true,
        data: statistics
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get system statistics');
    }
  }

  // === SYSTEM DIAGNOSTICS ===

  async runSystemDiagnostics(request, h) {
    try {
      const userId = request.auth.credentials.userId;
      const { tests, verbose } = request.payload;

      const diagnostics = await this.systemRepository.runSystemDiagnostics({
        tests,
        verbose,
        run_by: userId
      });

      // Log activity
      await this.systemRepository.createAuditLog({
        user_id: userId,
        action: 'run',
        resource: 'system_diagnostics',
        resource_id: diagnostics.id,
        details: { tests, verbose },
        ip_address: request.info.remoteAddress,
        user_agent: request.headers['user-agent']
      });

      return h.response({
        success: true,
        message: 'System diagnostics completed successfully',
        data: diagnostics
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to run system diagnostics');
    }
  }

  async getDiagnosticReport(request, h) {
    try {
      const { id } = request.params;

      const report = await this.systemRepository.getDiagnosticReport(id);
      if (!report) {
        throw Boom.notFound('Diagnostic report not found');
      }

      return h.response({
        success: true,
        data: report
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to get diagnostic report');
    }
  }

  // === HELPER METHODS ===

  async formatAuditLogExport(logs, format) {
    switch (format) {
      case 'csv':
        return this.formatAsCSV(logs);
      case 'excel':
        return this.formatAsExcel(logs);
      case 'json':
        return this.formatAsJSON(logs);
      default:
        throw new Error('Unsupported export format');
    }
  }

  formatAsCSV(logs) {
    const headers = ['id', 'user_id', 'action', 'resource', 'resource_id', 'details', 'ip_address', 'created_at'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => headers.map(header => log[header]).join(','))
    ].join('\n');

    return {
      content: csvContent,
      contentType: 'text/csv'
    };
  }

  formatAsExcel(logs) {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(logs);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Audit Logs');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return {
      content: buffer,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
  }

  formatAsJSON(logs) {
    return {
      content: JSON.stringify(logs, null, 2),
      contentType: 'application/json'
    };
  }
}

module.exports = new SystemHandler();
