const routes = (handler, auth) => [
  // === QUOTATION CRUD ROUTES ===
  {
    method: 'GET',
    path: '/quotations',
    handler: handler.getQuotations,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getQuotations
      },
      tags: ['quotations']
    }
  },
  {
    method: 'GET',
    path: '/quotations/{id}',
    handler: handler.getQuotationById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: auth.getQuotationById
      },
      tags: ['quotations']
    }
  },
  {
    method: 'POST',
    path: '/quotations',
    handler: handler.createQuotation,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['quotation:create']) }
      ],
      validate: {
        payload: auth.createQuotation
      },
      tags: ['quotations']
    }
  },
  {
    method: 'PUT',
    path: '/quotations/{id}',
    handler: handler.updateQuotation,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['quotation:update']) }
      ],
      validate: {
        params: auth.getQuotationById,
        payload: auth.updateQuotation
      },
      tags: ['quotations']
    }
  },
  {
    method: 'DELETE',
    path: '/quotations/{id}',
    handler: handler.deleteQuotation,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['quotation:delete']) }
      ],
      validate: {
        params: auth.deleteQuotation
      },
      tags: ['quotations']
    }
  },
  {
    method: 'GET',
    path: '/quotations/search',
    handler: handler.searchQuotations,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.searchQuotations
      },
      tags: ['quotations']
    }
  },
  {
    method: 'PUT',
    path: '/quotations/{id}/status',
    handler: handler.updateQuotationStatus,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['quotation:update_status']) }
      ],
      validate: {
        params: auth.getQuotationById,
        payload: auth.updateQuotationStatus
      },
      tags: ['quotations']
    }
  },
  {
    method: 'POST',
    path: '/quotations/{id}/send',
    handler: handler.sendQuotation,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['quotation:send']) }
      ],
      validate: {
        params: auth.getQuotationById,
        payload: auth.sendQuotation
      },
      tags: ['quotations']
    }
  },
  {
    method: 'POST',
    path: '/quotations/generate-from-project',
    handler: handler.generateFromProject,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['quotation:generate']) }
      ],
      validate: {
        payload: auth.generateFromProject
      },
      tags: ['quotations']
    }
  },

  // === QUOTATION ITEMS ROUTES ===
  {
    method: 'GET',
    path: '/quotations/items',
    handler: handler.getQuotationItems,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getQuotationItems
      },
      tags: ['quotation-items']
    }
  },
  {
    method: 'GET',
    path: '/quotations/items/{id}',
    handler: handler.getQuotationItemById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: auth.getQuotationItemById
      },
      tags: ['quotation-items']
    }
  },
  {
    method: 'POST',
    path: '/quotations/items',
    handler: handler.createQuotationItem,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['quotation:create_item']) }
      ],
      validate: {
        payload: auth.createQuotationItem
      },
      tags: ['quotation-items']
    }
  },
  {
    method: 'PUT',
    path: '/quotations/items/{id}',
    handler: handler.updateQuotationItem,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['quotation:update_item']) }
      ],
      validate: {
        params: auth.getQuotationItemById,
        payload: auth.updateQuotationItem
      },
      tags: ['quotation-items']
    }
  },
  {
    method: 'DELETE',
    path: '/quotations/items/{id}',
    handler: handler.deleteQuotationItem,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['quotation:delete_item']) }
      ],
      validate: {
        params: auth.deleteQuotationItem
      },
      tags: ['quotation-items']
    }
  },

  // === QUOTATION APPROVAL ROUTES ===
  {
    method: 'POST',
    path: '/quotations/{id}/approve',
    handler: handler.approveQuotation,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['quotation:approve']) }
      ],
      validate: {
        params: auth.getQuotationById,
        payload: auth.approveQuotation
      },
      tags: ['quotation-approval']
    }
  },
  {
    method: 'POST',
    path: '/quotations/{id}/reject',
    handler: handler.rejectQuotation,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['quotation:reject']) }
      ],
      validate: {
        params: auth.getQuotationById,
        payload: auth.rejectQuotation
      },
      tags: ['quotation-approval']
    }
  },

  // === QUOTATION STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/quotations/statistics',
    handler: handler.getQuotationStatistics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getQuotationStatistics
      },
      tags: ['quotation-statistics']
    }
  },
  {
    method: 'GET',
    path: '/quotations/items-statistics',
    handler: handler.getQuotationItemsStatistics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getQuotationItemsStatistics
      },
      tags: ['quotation-statistics']
    }
  },

  // === QUOTATION CALCULATION ROUTES ===
  {
    method: 'GET',
    path: '/quotations/calculate-totals',
    handler: handler.calculateQuotationTotals,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.calculateQuotationTotals
      },
      tags: ['quotations']
    }
  },



  // === QUOTATION TEMPLATES ROUTES ===
  {
    method: 'GET',
    path: '/quotation-templates',
    handler: handler.getQuotationTemplates,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getQuotationTemplates
      },
      tags: ['quotation-templates']
    }
  },

  {
    method: 'POST',
    path: '/quotation-templates',
    handler: handler.createQuotationTemplate,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['quotation:create_template']) }
      ],
      validate: {
        payload: auth.createQuotationTemplate
      },
      tags: ['quotation-templates']
    }
  },

  {
    method: 'GET',
    path: '/quotation-templates/{id}',
    handler: handler.getQuotationTemplateById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: auth.getQuotationTemplateById
      },
      tags: ['quotation-templates']
    }
  },

  {
    method: 'PUT',
    path: '/quotation-templates/{id}',
    handler: handler.updateQuotationTemplate,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['quotation:update_template']) }
      ],
      validate: {
        params: auth.getQuotationTemplateById,
        payload: auth.updateQuotationTemplate
      },
      tags: ['quotation-templates']
    }
  },

  {
    method: 'DELETE',
    path: '/quotation-templates/{id}',
    handler: handler.deleteQuotationTemplate,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['quotation:delete_template']) }
      ],
      validate: {
        params: auth.deleteQuotationTemplate
      },
      tags: ['quotation-templates']
    }
  },

  // === QUOTATION APPROVAL WORKFLOW ROUTES ===
  {
    method: 'POST',
    path: '/quotations/{id}/submit-for-approval',
    handler: handler.submitQuotationForApproval,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['quotation:submit_approval']) }
      ],
      validate: {
        params: auth.getQuotationById,
        payload: auth.submitQuotationForApproval
      },
      tags: ['quotation-approval']
    }
  },

  {
    method: 'GET',
    path: '/approval-requests',
    handler: handler.getApprovalRequests,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getApprovalRequests
      },
      tags: ['quotation-approval']
    }
  }
];

module.exports = routes;
