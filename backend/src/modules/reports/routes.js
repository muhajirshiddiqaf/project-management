const routes = (handler, auth) => [
  // === REPORT GENERATION ROUTES ===
  {
    method: 'POST',
    path: '/reports/generate',
    handler: handler.generateReport,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['reports:generate']) }
      ],
      validate: {
        payload: auth.generateReport
      },
      tags: ['reports']
    }
  },

  // === SCHEDULED REPORTS ROUTES ===
  {
    method: 'GET',
    path: '/scheduled-reports',
    handler: handler.getScheduledReports,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getScheduledReports
      },
      tags: ['scheduled-reports']
    }
  },
  {
    method: 'GET',
    path: '/scheduled-reports/{id}',
    handler: handler.getScheduledReportById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getScheduledReportById
      },
      tags: ['scheduled-reports']
    }
  },
  {
    method: 'POST',
    path: '/scheduled-reports',
    handler: handler.createScheduledReport,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['reports:create_scheduled']) }
      ],
      validate: {
        payload: auth.createScheduledReport
      },
      tags: ['scheduled-reports']
    }
  },
  {
    method: 'PUT',
    path: '/scheduled-reports/{id}',
    handler: handler.updateScheduledReport,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['reports:update_scheduled']) }
      ],
      validate: {
        params: auth.getScheduledReportById,
        payload: auth.updateScheduledReport
      },
      tags: ['scheduled-reports']
    }
  },
  {
    method: 'DELETE',
    path: '/scheduled-reports/{id}',
    handler: handler.deleteScheduledReport,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['reports:delete_scheduled']) }
      ],
      validate: {
        params: auth.deleteScheduledReport
      },
      tags: ['scheduled-reports']
    }
  },

  // === REPORT TEMPLATES ROUTES ===
  {
    method: 'GET',
    path: '/report-templates',
    handler: handler.getReportTemplates,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getReportTemplates
      },
      tags: ['report-templates']
    }
  },
  {
    method: 'GET',
    path: '/report-templates/{id}',
    handler: handler.getReportTemplateById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getReportTemplateById
      },
      tags: ['report-templates']
    }
  },
  {
    method: 'POST',
    path: '/report-templates',
    handler: handler.createReportTemplate,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['reports:create_template']) }
      ],
      validate: {
        payload: auth.createReportTemplate
      },
      tags: ['report-templates']
    }
  },
  {
    method: 'PUT',
    path: '/report-templates/{id}',
    handler: handler.updateReportTemplate,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['reports:update_template']) }
      ],
      validate: {
        params: auth.getReportTemplateById,
        payload: auth.updateReportTemplate
      },
      tags: ['report-templates']
    }
  },
  {
    method: 'DELETE',
    path: '/report-templates/{id}',
    handler: handler.deleteReportTemplate,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['reports:delete_template']) }
      ],
      validate: {
        params: auth.deleteReportTemplate
      },
      tags: ['report-templates']
    }
  },

  // === REPORT HISTORY ROUTES ===
  {
    method: 'GET',
    path: '/reports/history',
    handler: handler.getReportHistory,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getReportHistory
      },
      tags: ['reports']
    }
  },
  {
    method: 'GET',
    path: '/reports/{id}',
    handler: handler.getReportById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getReportById
      },
      tags: ['reports']
    }
  },
  {
    method: 'GET',
    path: '/reports/{id}/download',
    handler: handler.downloadReport,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.downloadReport
      },
      tags: ['reports']
    }
  },

  // === REPORT EXPORT ROUTES ===
  {
    method: 'POST',
    path: '/reports/export',
    handler: handler.exportReportData,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['reports:export']) }
      ],
      validate: {
        payload: auth.exportReportData
      },
      tags: ['reports']
    }
  },

  // === BULK REPORT ROUTES ===
  {
    method: 'POST',
    path: '/reports/bulk-generate',
    handler: handler.bulkGenerateReports,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['reports:bulk_generate']) }
      ],
      validate: {
        payload: auth.bulkGenerateReports
      },
      tags: ['reports']
    }
  }
];

module.exports = routes;
