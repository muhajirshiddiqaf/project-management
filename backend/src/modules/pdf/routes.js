const pdfHandler = require('./handler');
const pdfValidator = require('./validator');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // === PDF GENERATION ROUTES ===
  {
    method: 'POST',
    path: '/pdfs/generate',
    handler: pdfHandler.generatePDF,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['pdf:generate']) }
      ],
      validate: {
        payload: pdfValidator.generatePDF
      },
      tags: ['pdfs']
    }
  },
  {
    method: 'POST',
    path: '/pdfs/generate-quotation',
    handler: pdfHandler.generateQuotationPDF,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['pdf:generate_quotation']) }
      ],
      validate: {
        payload: pdfValidator.generateQuotationPDF
      },
      tags: ['pdfs']
    }
  },
  {
    method: 'POST',
    path: '/pdfs/generate-invoice',
    handler: pdfHandler.generateInvoicePDF,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['pdf:generate_invoice']) }
      ],
      validate: {
        payload: pdfValidator.generateInvoicePDF
      },
      tags: ['pdfs']
    }
  },

  // === PDF TEMPLATES ROUTES ===
  {
    method: 'GET',
    path: '/pdf-templates',
    handler: pdfHandler.getPDFTemplates,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: pdfValidator.getPDFTemplates
      },
      tags: ['pdf-templates']
    }
  },
  {
    method: 'GET',
    path: '/pdf-templates/{id}',
    handler: pdfHandler.getPDFTemplateById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: pdfValidator.getPDFTemplateById
      },
      tags: ['pdf-templates']
    }
  },
  {
    method: 'POST',
    path: '/pdf-templates',
    handler: pdfHandler.createPDFTemplate,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['pdf:create_template']) }
      ],
      validate: {
        payload: pdfValidator.createPDFTemplate
      },
      tags: ['pdf-templates']
    }
  },
  {
    method: 'PUT',
    path: '/pdf-templates/{id}',
    handler: pdfHandler.updatePDFTemplate,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['pdf:update_template']) }
      ],
      validate: {
        params: pdfValidator.getPDFTemplateById,
        payload: pdfValidator.updatePDFTemplate
      },
      tags: ['pdf-templates']
    }
  },
  {
    method: 'DELETE',
    path: '/pdf-templates/{id}',
    handler: pdfHandler.deletePDFTemplate,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['pdf:delete_template']) }
      ],
      validate: {
        params: pdfValidator.deletePDFTemplate
      },
      tags: ['pdf-templates']
    }
  },

  // === PDF COMPRESSION ROUTES ===
  {
    method: 'POST',
    path: '/pdfs/compress',
    handler: pdfHandler.compressPDF,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['pdf:compress']) }
      ],
      validate: {
        payload: pdfValidator.compressPDF
      },
      tags: ['pdf-compression']
    }
  },

  // === PDF DIGITAL SIGNATURE ROUTES ===
  {
    method: 'POST',
    path: '/pdfs/sign',
    handler: pdfHandler.signPDF,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['pdf:sign']) }
      ],
      validate: {
        payload: pdfValidator.signPDF
      },
      tags: ['pdf-signatures']
    }
  },
  {
    method: 'POST',
    path: '/pdfs/verify-signature',
    handler: pdfHandler.verifyPDFSignature,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        payload: pdfValidator.verifyPDFSignature
      },
      tags: ['pdf-signatures']
    }
  },

  // === PDF MERGE ROUTES ===
  {
    method: 'POST',
    path: '/pdfs/merge',
    handler: pdfHandler.mergePDFs,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['pdf:merge']) }
      ],
      validate: {
        payload: pdfValidator.mergePDFs
      },
      tags: ['pdf-merge']
    }
  },

  // === PDF STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/pdfs/statistics',
    handler: pdfHandler.getPDFStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: pdfValidator.getPDFStatistics
      },
      tags: ['pdf-statistics']
    }
  },
  {
    method: 'GET',
    path: '/pdf-templates/statistics',
    handler: pdfHandler.getPDFTemplateStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: pdfValidator.getPDFTemplateStatistics
      },
      tags: ['pdf-statistics']
    }
  }
];

module.exports = routes;
