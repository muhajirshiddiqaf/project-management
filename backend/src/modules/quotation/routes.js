const quotationHandler = require('./handler');
const quotationValidator = require('./validator');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // === QUOTATION CRUD ROUTES ===
  {
    method: 'GET',
    path: '/quotations',
    handler: quotationHandler.getQuotations,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: quotationValidator.getQuotations
      },
      tags: ['quotations']
    }
  },
  {
    method: 'GET',
    path: '/quotations/{id}',
    handler: quotationHandler.getQuotationById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: quotationValidator.getQuotationById
      },
      tags: ['quotations']
    }
  },
  {
    method: 'POST',
    path: '/quotations',
    handler: quotationHandler.createQuotation,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['quotation:create']) }
      ],
      validate: {
        payload: quotationValidator.createQuotation
      },
      tags: ['quotations']
    }
  },
  {
    method: 'PUT',
    path: '/quotations/{id}',
    handler: quotationHandler.updateQuotation,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['quotation:update']) }
      ],
      validate: {
        params: quotationValidator.getQuotationById,
        payload: quotationValidator.updateQuotation
      },
      tags: ['quotations']
    }
  },
  {
    method: 'DELETE',
    path: '/quotations/{id}',
    handler: quotationHandler.deleteQuotation,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['quotation:delete']) }
      ],
      validate: {
        params: quotationValidator.deleteQuotation
      },
      tags: ['quotations']
    }
  },
  {
    method: 'GET',
    path: '/quotations/search',
    handler: quotationHandler.searchQuotations,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: quotationValidator.searchQuotations
      },
      tags: ['quotations']
    }
  },
  {
    method: 'PUT',
    path: '/quotations/{id}/status',
    handler: quotationHandler.updateQuotationStatus,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['quotation:update_status']) }
      ],
      validate: {
        params: quotationValidator.getQuotationById,
        payload: quotationValidator.updateQuotationStatus
      },
      tags: ['quotations']
    }
  },
  {
    method: 'POST',
    path: '/quotations/{id}/send',
    handler: quotationHandler.sendQuotation,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['quotation:send']) }
      ],
      validate: {
        params: quotationValidator.getQuotationById,
        payload: quotationValidator.sendQuotation
      },
      tags: ['quotations']
    }
  },
  {
    method: 'POST',
    path: '/quotations/generate-from-project',
    handler: quotationHandler.generateFromProject,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['quotation:generate']) }
      ],
      validate: {
        payload: quotationValidator.generateFromProject
      },
      tags: ['quotations']
    }
  },

  // === QUOTATION ITEMS ROUTES ===
  {
    method: 'GET',
    path: '/quotations/items',
    handler: quotationHandler.getQuotationItems,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: quotationValidator.getQuotationItems
      },
      tags: ['quotation-items']
    }
  },
  {
    method: 'GET',
    path: '/quotations/items/{id}',
    handler: quotationHandler.getQuotationItemById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: quotationValidator.getQuotationItemById
      },
      tags: ['quotation-items']
    }
  },
  {
    method: 'POST',
    path: '/quotations/items',
    handler: quotationHandler.createQuotationItem,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['quotation:create_item']) }
      ],
      validate: {
        payload: quotationValidator.createQuotationItem
      },
      tags: ['quotation-items']
    }
  },
  {
    method: 'PUT',
    path: '/quotations/items/{id}',
    handler: quotationHandler.updateQuotationItem,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['quotation:update_item']) }
      ],
      validate: {
        params: quotationValidator.getQuotationItemById,
        payload: quotationValidator.updateQuotationItem
      },
      tags: ['quotation-items']
    }
  },
  {
    method: 'DELETE',
    path: '/quotations/items/{id}',
    handler: quotationHandler.deleteQuotationItem,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['quotation:delete_item']) }
      ],
      validate: {
        params: quotationValidator.deleteQuotationItem
      },
      tags: ['quotation-items']
    }
  },

  // === QUOTATION APPROVAL ROUTES ===
  {
    method: 'POST',
    path: '/quotations/{id}/approve',
    handler: quotationHandler.approveQuotation,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['quotation:approve']) }
      ],
      validate: {
        params: quotationValidator.getQuotationById,
        payload: quotationValidator.approveQuotation
      },
      tags: ['quotation-approval']
    }
  },
  {
    method: 'POST',
    path: '/quotations/{id}/reject',
    handler: quotationHandler.rejectQuotation,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['quotation:reject']) }
      ],
      validate: {
        params: quotationValidator.getQuotationById,
        payload: quotationValidator.rejectQuotation
      },
      tags: ['quotation-approval']
    }
  },

  // === QUOTATION STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/quotations/statistics',
    handler: quotationHandler.getQuotationStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: quotationValidator.getQuotationStatistics
      },
      tags: ['quotation-statistics']
    }
  },
  {
    method: 'GET',
    path: '/quotations/items-statistics',
    handler: quotationHandler.getQuotationItemsStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: quotationValidator.getQuotationItemsStatistics
      },
      tags: ['quotation-statistics']
    }
  },

  // === QUOTATION CALCULATION ROUTES ===
  {
    method: 'GET',
    path: '/quotations/calculate-totals',
    handler: quotationHandler.calculateQuotationTotals,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: quotationValidator.calculateQuotationTotals
      },
      tags: ['quotations']
    }
  },

  // === QUOTATION GENERATION FROM PROJECT ROUTES ===
  {
    method: 'POST',
    path: '/quotations/generate-from-project',
    handler: quotationHandler.generateQuotationFromProject,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['quotation:generate']) }
      ],
      validate: {
        payload: quotationValidator.generateQuotationFromProject
      },
      tags: ['quotations']
    }
  },

  // === QUOTATION TEMPLATES ROUTES ===
  {
    method: 'GET',
    path: '/quotation-templates',
    handler: quotationHandler.getQuotationTemplates,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: quotationValidator.getQuotationTemplates
      },
      tags: ['quotation-templates']
    }
  },

  {
    method: 'POST',
    path: '/quotation-templates',
    handler: quotationHandler.createQuotationTemplate,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['quotation:create_template']) }
      ],
      validate: {
        payload: quotationValidator.createQuotationTemplate
      },
      tags: ['quotation-templates']
    }
  },

  {
    method: 'GET',
    path: '/quotation-templates/{id}',
    handler: quotationHandler.getQuotationTemplateById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: quotationValidator.getQuotationTemplateById
      },
      tags: ['quotation-templates']
    }
  },

  {
    method: 'PUT',
    path: '/quotation-templates/{id}',
    handler: quotationHandler.updateQuotationTemplate,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['quotation:update_template']) }
      ],
      validate: {
        params: quotationValidator.getQuotationTemplateById,
        payload: quotationValidator.updateQuotationTemplate
      },
      tags: ['quotation-templates']
    }
  },

  {
    method: 'DELETE',
    path: '/quotation-templates/{id}',
    handler: quotationHandler.deleteQuotationTemplate,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['quotation:delete_template']) }
      ],
      validate: {
        params: quotationValidator.deleteQuotationTemplate
      },
      tags: ['quotation-templates']
    }
  },

  // === QUOTATION APPROVAL WORKFLOW ROUTES ===
  {
    method: 'POST',
    path: '/quotations/{id}/submit-for-approval',
    handler: quotationHandler.submitQuotationForApproval,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['quotation:submit_approval']) }
      ],
      validate: {
        params: quotationValidator.getQuotationById,
        payload: quotationValidator.submitQuotationForApproval
      },
      tags: ['quotation-approval']
    }
  },

  {
    method: 'GET',
    path: '/approval-requests',
    handler: quotationHandler.getApprovalRequests,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: quotationValidator.getApprovalRequests
      },
      tags: ['quotation-approval']
    }
  }
];

module.exports = routes;
