const reportsHandler = require('./handler');
const reportsValidator = require('./validator');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // === REPORT GENERATION ROUTES ===
  {
    method: 'POST',
    path: '/reports/generate',
    handler: reportsHandler.generateReport,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['reports:generate']) }
      ],
      validate: {
        payload: reportsValidator.generateReport
      },
      tags: ['reports']
    }
  },

  // === SCHEDULED REPORTS ROUTES ===
  {
    method: 'GET',
    path: '/scheduled-reports',
    handler: reportsHandler.getScheduledReports,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: reportsValidator.getScheduledReports
      },
      tags: ['scheduled-reports']
    }
  },
  {
    method: 'GET',
    path: '/scheduled-reports/{id}',
    handler: reportsHandler.getScheduledReportById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: reportsValidator.getScheduledReportById
      },
      tags: ['scheduled-reports']
    }
  },
  {
    method: 'POST',
    path: '/scheduled-reports',
    handler: reportsHandler.createScheduledReport,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['reports:create_scheduled']) }
      ],
      validate: {
        payload: reportsValidator.createScheduledReport
      },
      tags: ['scheduled-reports']
    }
  },
  {
    method: 'PUT',
    path: '/scheduled-reports/{id}',
    handler: reportsHandler.updateScheduledReport,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['reports:update_scheduled']) }
      ],
      validate: {
        params: reportsValidator.getScheduledReportById,
        payload: reportsValidator.updateScheduledReport
      },
      tags: ['scheduled-reports']
    }
  },
  {
    method: 'DELETE',
    path: '/scheduled-reports/{id}',
    handler: reportsHandler.deleteScheduledReport,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['reports:delete_scheduled']) }
      ],
      validate: {
        params: reportsValidator.deleteScheduledReport
      },
      tags: ['scheduled-reports']
    }
  },

  // === REPORT TEMPLATES ROUTES ===
  {
    method: 'GET',
    path: '/report-templates',
    handler: reportsHandler.getReportTemplates,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: reportsValidator.getReportTemplates
      },
      tags: ['report-templates']
    }
  },
  {
    method: 'GET',
    path: '/report-templates/{id}',
    handler: reportsHandler.getReportTemplateById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: reportsValidator.getReportTemplateById
      },
      tags: ['report-templates']
    }
  },
  {
    method: 'POST',
    path: '/report-templates',
    handler: reportsHandler.createReportTemplate,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['reports:create_template']) }
      ],
      validate: {
        payload: reportsValidator.createReportTemplate
      },
      tags: ['report-templates']
    }
  },
  {
    method: 'PUT',
    path: '/report-templates/{id}',
    handler: reportsHandler.updateReportTemplate,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['reports:update_template']) }
      ],
      validate: {
        params: reportsValidator.getReportTemplateById,
        payload: reportsValidator.updateReportTemplate
      },
      tags: ['report-templates']
    }
  },
  {
    method: 'DELETE',
    path: '/report-templates/{id}',
    handler: reportsHandler.deleteReportTemplate,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['reports:delete_template']) }
      ],
      validate: {
        params: reportsValidator.deleteReportTemplate
      },
      tags: ['report-templates']
    }
  },

  // === REPORT HISTORY ROUTES ===
  {
    method: 'GET',
    path: '/reports/history',
    handler: reportsHandler.getReportHistory,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: reportsValidator.getReportHistory
      },
      tags: ['reports']
    }
  },
  {
    method: 'GET',
    path: '/reports/{id}',
    handler: reportsHandler.getReportById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: reportsValidator.getReportById
      },
      tags: ['reports']
    }
  },
  {
    method: 'GET',
    path: '/reports/{id}/download',
    handler: reportsHandler.downloadReport,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: reportsValidator.downloadReport
      },
      tags: ['reports']
    }
  },

  // === REPORT EXPORT ROUTES ===
  {
    method: 'POST',
    path: '/reports/export',
    handler: reportsHandler.exportReportData,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['reports:export']) }
      ],
      validate: {
        payload: reportsValidator.exportReportData
      },
      tags: ['reports']
    }
  },

  // === BULK REPORT ROUTES ===
  {
    method: 'POST',
    path: '/reports/bulk-generate',
    handler: reportsHandler.bulkGenerateReports,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['reports:bulk_generate']) }
      ],
      validate: {
        payload: reportsValidator.bulkGenerateReports
      },
      tags: ['reports']
    }
  }
];

module.exports = routes;
