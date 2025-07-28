const routes = (handler, auth) => [
  // === PDF GENERATION ROUTES ===
  {
    method: 'POST',
    path: '/pdfs/generate',
    handler: handler.generatePDF,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['pdf:generate']) }
      ],
      validate: {
        payload: auth.generatePDF
      },
      tags: ['pdfs']
    }
  },
  {
    method: 'POST',
    path: '/pdfs/generate-quotation',
    handler: handler.generateQuotationPDF,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['pdf:generate_quotation']) }
      ],
      validate: {
        payload: auth.generateQuotationPDF
      },
      tags: ['pdfs']
    }
  },
  {
    method: 'POST',
    path: '/pdfs/generate-invoice',
    handler: handler.generateInvoicePDF,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['pdf:generate_invoice']) }
      ],
      validate: {
        payload: auth.generateInvoicePDF
      },
      tags: ['pdfs']
    }
  },

  // === PDF TEMPLATES ROUTES ===
  {
    method: 'GET',
    path: '/pdf-templates',
    handler: handler.getPDFTemplates,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getPDFTemplates
      },
      tags: ['pdf-templates']
    }
  },
  {
    method: 'GET',
    path: '/pdf-templates/{id}',
    handler: handler.getPDFTemplateById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: auth.getPDFTemplateById
      },
      tags: ['pdf-templates']
    }
  },
  {
    method: 'POST',
    path: '/pdf-templates',
    handler: handler.createPDFTemplate,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['pdf:create_template']) }
      ],
      validate: {
        payload: auth.createPDFTemplate
      },
      tags: ['pdf-templates']
    }
  },
  {
    method: 'PUT',
    path: '/pdf-templates/{id}',
    handler: handler.updatePDFTemplate,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['pdf:update_template']) }
      ],
      validate: {
        params: auth.getPDFTemplateById,
        payload: auth.updatePDFTemplate
      },
      tags: ['pdf-templates']
    }
  },
  {
    method: 'DELETE',
    path: '/pdf-templates/{id}',
    handler: handler.deletePDFTemplate,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['pdf:delete_template']) }
      ],
      validate: {
        params: auth.deletePDFTemplate
      },
      tags: ['pdf-templates']
    }
  },

  // === PDF COMPRESSION ROUTES ===
  {
    method: 'POST',
    path: '/pdfs/compress',
    handler: handler.compressPDF,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['pdf:compress']) }
      ],
      validate: {
        payload: auth.compressPDF
      },
      tags: ['pdf-compression']
    }
  },

  // === PDF DIGITAL SIGNATURE ROUTES ===
  {
    method: 'POST',
    path: '/pdfs/sign',
    handler: handler.signPDF,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['pdf:sign']) }
      ],
      validate: {
        payload: auth.signPDF
      },
      tags: ['pdf-signatures']
    }
  },
  {
    method: 'POST',
    path: '/pdfs/verify-signature',
    handler: handler.verifyPDFSignature,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        payload: auth.verifyPDFSignature
      },
      tags: ['pdf-signatures']
    }
  },

  // === PDF MERGE ROUTES ===
  {
    method: 'POST',
    path: '/pdfs/merge',
    handler: handler.mergePDFs,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['pdf:merge']) }
      ],
      validate: {
        payload: auth.mergePDFs
      },
      tags: ['pdf-merge']
    }
  },

  // === PDF STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/pdfs/statistics',
    handler: handler.getPDFStatistics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getPDFStatistics
      },
      tags: ['pdf-statistics']
    }
  },
  {
    method: 'GET',
    path: '/pdf-templates/statistics',
    handler: handler.getPDFTemplateStatistics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getPDFTemplateStatistics
      },
      tags: ['pdf-statistics']
    }
  }
];

module.exports = routes;
