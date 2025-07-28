const Boom = require('@hapi/boom');
const moment = require('moment');
const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');

class ReportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // Bind all methods to preserve 'this' context
    this.generateReport = this.generateReport.bind(this);
    this.getScheduledReports = this.getScheduledReports.bind(this);
    this.getScheduledReportById = this.getScheduledReportById.bind(this);
    this.createScheduledReport = this.createScheduledReport.bind(this);
    this.updateScheduledReport = this.updateScheduledReport.bind(this);
    this.deleteScheduledReport = this.deleteScheduledReport.bind(this);
    this.getReportTemplates = this.getReportTemplates.bind(this);
    this.getReportTemplateById = this.getReportTemplateById.bind(this);
    this.createReportTemplate = this.createReportTemplate.bind(this);
    this.updateReportTemplate = this.updateReportTemplate.bind(this);
    this.deleteReportTemplate = this.deleteReportTemplate.bind(this);
    this.getReportHistory = this.getReportHistory.bind(this);
    this.getReportById = this.getReportById.bind(this);
    this.downloadReport = this.downloadReport.bind(this);
    this.exportReportData = this.exportReportData.bind(this);
    this.bulkGenerateReports = this.bulkGenerateReports.bind(this);
  }

  // === REPORT GENERATION METHODS ===
  async generateReport(request, h) {
    try {
      const { report_type, format = 'pdf', filters = {}, options = {} } = request.payload;
      const organizationId = request.auth.credentials.organization_id;

      // Create report record
      const reportRecord = await this._service.createReportRecord({
        organization_id: organizationId,
        report_type,
        format,
        filters,
        options,
        status: 'processing',
        generated_by: request.auth.credentials.user_id
      });

      // Generate report asynchronously
      this.generateReportAsync(reportRecord.id, organizationId, report_type, format, filters, options);

      return h.response({
        success: true,
        message: 'Report generation started',
        data: {
          report_id: reportRecord.id,
          status: 'processing',
          estimated_completion: '2-5 minutes'
        }
      }).code(202);
    } catch (error) {
      console.error('Error starting report generation:', error);
      throw Boom.internal('Failed to start report generation');
    }
  }

  async generateReportAsync(reportId, organizationId, reportType, format, filters, options) {
    try {
      // Get report data based on type
      const reportData = await this.getReportData(organizationId, reportType, filters);

      // Generate report content based on format
      let reportContent;
      let filePath;

      switch (format.toLowerCase()) {
        case 'pdf':
          reportContent = await this.generatePDFReport(reportData, options);
          filePath = await this.saveReportFile(reportId, reportContent, 'pdf');
          break;
        case 'excel':
          reportContent = await this.generateExcelReport(reportData, options);
          filePath = await this.saveReportFile(reportId, reportContent, 'xlsx');
          break;
        case 'csv':
          reportContent = await this.generateCSVReport(reportData, options);
          filePath = await this.saveReportFile(reportId, reportContent, 'csv');
          break;
        case 'json':
          reportContent = JSON.stringify(reportData, null, 2);
          filePath = await this.saveReportFile(reportId, reportContent, 'json');
          break;
        default:
          throw new Error('Unsupported format');
      }

      // Update report record
      await this._service.updateReportRecord(reportId, organizationId, {
        status: 'completed',
        file_path: filePath,
        file_size: Buffer.byteLength(reportContent),
        completed_at: new Date()
      });

    } catch (error) {
      console.error('Error generating report:', error);
      await this._service.updateReportRecord(reportId, organizationId, {
        status: 'failed',
        error_message: error.message,
        completed_at: new Date()
      });
    }
  }

  // === SCHEDULED REPORTS METHODS ===
  async getScheduledReports(request, h) {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC', report_type, is_active } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { report_type, is_active };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sortBy, sortOrder };

      const reports = await this._service.getScheduledReports(organizationId, filters, pagination);
      const total = await this._service.countScheduledReports(organizationId, filters);

      return h.response({
        success: true,
        data: reports,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      }).code(200);
    } catch (error) {
      console.error('Error getting scheduled reports:', error);
      throw Boom.internal('Failed to get scheduled reports');
    }
  }

  async getScheduledReportById(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const report = await this._service.getScheduledReportById(id, organizationId);
      if (!report) {
        throw Boom.notFound('Scheduled report not found');
      }

      return h.response({
        success: true,
        data: report
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error getting scheduled report:', error);
      throw Boom.internal('Failed to get scheduled report');
    }
  }

  async createScheduledReport(request, h) {
    try {
      const reportData = {
        ...request.payload,
        organization_id: request.auth.credentials.organization_id,
        created_by: request.auth.credentials.user_id
      };

      const report = await this._service.createScheduledReport(reportData);

      return h.response({
        success: true,
        message: 'Scheduled report created successfully',
        data: report
      }).code(201);
    } catch (error) {
      console.error('Error creating scheduled report:', error);
      throw Boom.internal('Failed to create scheduled report');
    }
  }

  async updateScheduledReport(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;
      const updateData = request.payload;

      const report = await this._service.updateScheduledReport(id, organizationId, updateData);
      if (!report) {
        throw Boom.notFound('Scheduled report not found');
      }

      return h.response({
        success: true,
        message: 'Scheduled report updated successfully',
        data: report
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error updating scheduled report:', error);
      throw Boom.internal('Failed to update scheduled report');
    }
  }

  async deleteScheduledReport(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const report = await this._service.deleteScheduledReport(id, organizationId);
      if (!report) {
        throw Boom.notFound('Scheduled report not found');
      }

      return h.response({
        success: true,
        message: 'Scheduled report deleted successfully'
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error deleting scheduled report:', error);
      throw Boom.internal('Failed to delete scheduled report');
    }
  }

  // === REPORT TEMPLATES METHODS ===
  async getReportTemplates(request, h) {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC', report_type, is_active } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { report_type, is_active };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sortBy, sortOrder };

      const templates = await this._service.getReportTemplates(organizationId, filters, pagination);
      const total = await this._service.countReportTemplates(organizationId, filters);

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
      console.error('Error getting report templates:', error);
      throw Boom.internal('Failed to get report templates');
    }
  }

  async getReportTemplateById(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const template = await this._service.getReportTemplateById(id, organizationId);
      if (!template) {
        throw Boom.notFound('Report template not found');
      }

      return h.response({
        success: true,
        data: template
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error getting report template:', error);
      throw Boom.internal('Failed to get report template');
    }
  }

  async createReportTemplate(request, h) {
    try {
      const templateData = {
        ...request.payload,
        organization_id: request.auth.credentials.organization_id,
        created_by: request.auth.credentials.user_id
      };

      const template = await this._service.createReportTemplate(templateData);

      return h.response({
        success: true,
        message: 'Report template created successfully',
        data: template
      }).code(201);
    } catch (error) {
      console.error('Error creating report template:', error);
      throw Boom.internal('Failed to create report template');
    }
  }

  async updateReportTemplate(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;
      const updateData = request.payload;

      const template = await this._service.updateReportTemplate(id, organizationId, updateData);
      if (!template) {
        throw Boom.notFound('Report template not found');
      }

      return h.response({
        success: true,
        message: 'Report template updated successfully',
        data: template
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error updating report template:', error);
      throw Boom.internal('Failed to update report template');
    }
  }

  async deleteReportTemplate(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const template = await this._service.deleteReportTemplate(id, organizationId);
      if (!template) {
        throw Boom.notFound('Report template not found');
      }

      return h.response({
        success: true,
        message: 'Report template deleted successfully'
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error deleting report template:', error);
      throw Boom.internal('Failed to delete report template');
    }
  }

  // === REPORT HISTORY METHODS ===
  async getReportHistory(request, h) {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC', report_type, status, start_date, end_date } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { report_type, status, start_date, end_date };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sortBy, sortOrder };

      const reports = await this._service.getReportHistory(organizationId, filters, pagination);
      const total = await this._service.countReportHistory(organizationId, filters);

      return h.response({
        success: true,
        data: reports,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      }).code(200);
    } catch (error) {
      console.error('Error getting report history:', error);
      throw Boom.internal('Failed to get report history');
    }
  }

  async getReportById(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const report = await this._service.getReportById(id, organizationId);
      if (!report) {
        throw Boom.notFound('Report not found');
      }

      return h.response({
        success: true,
        data: report
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error getting report:', error);
      throw Boom.internal('Failed to get report');
    }
  }

  async downloadReport(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const report = await this._service.getReportById(id, organizationId);
      if (!report) {
        throw Boom.notFound('Report not found');
      }

      if (report.status !== 'completed') {
        throw Boom.badRequest('Report is not ready for download');
      }

      if (!report.file_path) {
        throw Boom.notFound('Report file not found');
      }

      // Read file and return as download
      const fileContent = await fs.readFile(report.file_path);
      const fileName = `report_${report.report_type}_${moment(report.created_at).format('YYYY-MM-DD')}.${report.format}`;

      return h.response(fileContent)
        .code(200)
        .header('Content-Type', this.getContentType(report.format))
        .header('Content-Disposition', `attachment; filename="${fileName}"`);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error downloading report:', error);
      throw Boom.internal('Failed to download report');
    }
  }

  // === REPORT EXPORT METHODS ===
  async exportReportData(request, h) {
    try {
      const { report_type, format = 'csv', filters = {}, include_headers = true, include_metadata = true } = request.payload;
      const organizationId = request.auth.credentials.organization_id;

      const reportData = await this.getReportData(organizationId, report_type, filters);
      const exportContent = await this.formatExportData(reportData, format, include_headers, include_metadata);

      const fileName = `export_${report_type}_${moment().format('YYYY-MM-DD_HH-mm-ss')}.${format}`;

      return h.response(exportContent)
        .code(200)
        .header('Content-Type', this.getContentType(format))
        .header('Content-Disposition', `attachment; filename="${fileName}"`);
    } catch (error) {
      console.error('Error exporting report data:', error);
      throw Boom.internal('Failed to export report data');
    }
  }

  // === BULK REPORT METHODS ===
  async bulkGenerateReports(request, h) {
    try {
      const { reports, zip_output = true } = request.payload;
      const organizationId = request.auth.credentials.organization_id;

      const reportIds = [];
      const reportPromises = reports.map(async (reportConfig) => {
        const reportRecord = await this._service.createReportRecord({
          organization_id: organizationId,
          report_type: reportConfig.report_type,
          format: reportConfig.format,
          filters: reportConfig.filters,
          options: reportConfig.options,
          status: 'processing',
          generated_by: request.auth.credentials.user_id
        });

        reportIds.push(reportRecord.id);

        // Generate report asynchronously
        this.generateReportAsync(
          reportRecord.id,
          organizationId,
          reportConfig.report_type,
          reportConfig.format,
          reportConfig.filters,
          reportConfig.options
        );

        return reportRecord;
      });

      await Promise.all(reportPromises);

      return h.response({
        success: true,
        message: 'Bulk report generation started',
        data: {
          report_ids: reportIds,
          total_reports: reports.length,
          zip_output: zip_output
        }
      }).code(202);
    } catch (error) {
      console.error('Error starting bulk report generation:', error);
      throw Boom.internal('Failed to start bulk report generation');
    }
  }

  // === HELPER METHODS ===
  async getReportData(organizationId, reportType, filters = {}) {
    // Get data based on report type using analytics repository
    const analyticsRepository = this._service.getAnalyticsRepository();

    switch (reportType) {
      case 'revenue':
        return await analyticsRepository.getRevenueAnalytics(organizationId, filters);
      case 'clients':
        return await analyticsRepository.getClientAnalytics(organizationId, filters);
      case 'orders':
        return await analyticsRepository.getOrderAnalytics(organizationId, filters);
      case 'tickets':
        return await analyticsRepository.getTicketAnalytics(organizationId, filters);
      case 'projects':
        return await analyticsRepository.getProjectAnalytics(organizationId, filters);
      case 'services':
        return await analyticsRepository.getServiceAnalytics(organizationId, filters);
      case 'quotations':
        return await analyticsRepository.getQuotationAnalytics(organizationId, filters);
      case 'invoices':
        return await analyticsRepository.getInvoiceAnalytics(organizationId, filters);
      default:
        return await analyticsRepository.getCustomAnalytics(organizationId, { query_type: reportType, filters });
    }
  }

  async generatePDFReport(data, options = {}) {
    // Generate PDF report using PDF module
    const pdfHandler = this._service.getPDFHandler();
    return await pdfHandler.generatePDFContent(null, data, options);
  }

  async generateExcelReport(data, options = {}) {
    // Generate Excel report
    // This would use a library like 'xlsx' in a real implementation
    return this.formatAsCSV(data, true);
  }

  async generateCSVReport(data, options = {}) {
    return this.formatAsCSV(data, true);
  }

  async saveReportFile(reportId, content, format) {
    const reportsDir = path.join(process.cwd(), 'reports');
    await fs.mkdir(reportsDir, { recursive: true });

    const fileName = `report_${reportId}_${moment().format('YYYY-MM-DD_HH-mm-ss')}.${format}`;
    const filePath = path.join(reportsDir, fileName);

    await fs.writeFile(filePath, content);
    return filePath;
  }

  async formatExportData(data, format, includeHeaders, includeMetadata) {
    switch (format.toLowerCase()) {
      case 'csv':
        return this.formatAsCSV(data, includeHeaders);
      case 'excel':
        return this.formatAsExcel(data, includeHeaders);
      case 'json':
        return JSON.stringify(data, null, 2);
      default:
        return this.formatAsCSV(data, includeHeaders);
    }
  }

  formatAsCSV(data, includeHeaders = true) {
    if (!data || data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    let csv = '';

    if (includeHeaders) {
      csv += headers.join(',') + '\n';
    }

    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      });
      csv += values.join(',') + '\n';
    });

    return csv;
  }

  formatAsExcel(data, includeHeaders = true) {
    // Simplified Excel format
    return this.formatAsCSV(data, includeHeaders);
  }

  getContentType(format) {
    switch (format.toLowerCase()) {
      case 'pdf':
        return 'application/pdf';
      case 'excel':
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'csv':
        return 'text/csv';
      case 'json':
        return 'application/json';
      default:
        return 'application/octet-stream';
    }
  }
}

module.exports = ReportsHandler;
