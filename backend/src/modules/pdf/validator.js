const Joi = require('@hapi/joi');

// PDF validation schemas
const pdfSchemas = {
  // Generate PDF schema
  generatePDF: Joi.object({
    template_id: Joi.string().optional().uuid(),
    template_name: Joi.string().optional().max(100),
    content: Joi.object().required(),
    options: Joi.object({
      format: Joi.string().valid('A4', 'A3', 'Letter', 'Legal').default('A4'),
      orientation: Joi.string().valid('portrait', 'landscape').default('portrait'),
      margin: Joi.object({
        top: Joi.number().min(0).default(20),
        bottom: Joi.number().min(0).default(20),
        left: Joi.number().min(0).default(20),
        right: Joi.number().min(0).default(20)
      }).optional(),
      header: Joi.object({
        enabled: Joi.boolean().default(false),
        content: Joi.string().optional(),
        height: Joi.number().min(0).optional()
      }).optional(),
      footer: Joi.object({
        enabled: Joi.boolean().default(false),
        content: Joi.string().optional(),
        height: Joi.number().min(0).optional()
      }).optional(),
      watermark: Joi.object({
        enabled: Joi.boolean().default(false),
        text: Joi.string().optional(),
        opacity: Joi.number().min(0).max(1).default(0.3)
      }).optional(),
      compression: Joi.boolean().default(true),
      digital_signature: Joi.object({
        enabled: Joi.boolean().default(false),
        certificate_path: Joi.string().optional(),
        password: Joi.string().optional(),
        reason: Joi.string().optional(),
        location: Joi.string().optional()
      }).optional()
    }).optional()
  }),

  // Generate quotation PDF schema
  generateQuotationPDF: Joi.object({
    quotation_id: Joi.string().required().uuid(),
    template_id: Joi.string().optional().uuid(),
    include_signature: Joi.boolean().default(false),
    include_terms: Joi.boolean().default(true),
    include_company_logo: Joi.boolean().default(true),
    options: Joi.object({
      format: Joi.string().valid('A4', 'A3', 'Letter', 'Legal').default('A4'),
      orientation: Joi.string().valid('portrait', 'landscape').default('portrait'),
      compression: Joi.boolean().default(true),
      digital_signature: Joi.object({
        enabled: Joi.boolean().default(false),
        certificate_path: Joi.string().optional(),
        password: Joi.string().optional(),
        reason: Joi.string().optional(),
        location: Joi.string().optional()
      }).optional()
    }).optional()
  }),

  // Generate invoice PDF schema
  generateInvoicePDF: Joi.object({
    invoice_id: Joi.string().required().uuid(),
    template_id: Joi.string().optional().uuid(),
    include_payment_terms: Joi.boolean().default(true),
    include_company_logo: Joi.boolean().default(true),
    options: Joi.object({
      format: Joi.string().valid('A4', 'A3', 'Letter', 'Legal').default('A4'),
      orientation: Joi.string().valid('portrait', 'landscape').default('portrait'),
      compression: Joi.boolean().default(true),
      digital_signature: Joi.object({
        enabled: Joi.boolean().default(false),
        certificate_path: Joi.string().optional(),
        password: Joi.string().optional(),
        reason: Joi.string().optional(),
        location: Joi.string().optional()
      }).optional()
    }).optional()
  }),

  // Create PDF template schema
  createPDFTemplate: Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().optional().max(500),
    category: Joi.string().valid('quotation', 'invoice', 'contract', 'report', 'custom').required(),
    html_content: Joi.string().required().max(50000),
    css_content: Joi.string().optional().max(10000),
    variables: Joi.array().items(Joi.string()).optional(),
    default_options: Joi.object({
      format: Joi.string().valid('A4', 'A3', 'Letter', 'Legal').default('A4'),
      orientation: Joi.string().valid('portrait', 'landscape').default('portrait'),
      margin: Joi.object({
        top: Joi.number().min(0).default(20),
        bottom: Joi.number().min(0).default(20),
        left: Joi.number().min(0).default(20),
        right: Joi.number().min(0).default(20)
      }).optional(),
      header: Joi.object({
        enabled: Joi.boolean().default(false),
        content: Joi.string().optional(),
        height: Joi.number().min(0).optional()
      }).optional(),
      footer: Joi.object({
        enabled: Joi.boolean().default(false),
        content: Joi.string().optional(),
        height: Joi.number().min(0).optional()
      }).optional(),
      watermark: Joi.object({
        enabled: Joi.boolean().default(false),
        text: Joi.string().optional(),
        opacity: Joi.number().min(0).max(1).default(0.3)
      }).optional()
    }).optional(),
    is_active: Joi.boolean().default(true)
  }),

  // Update PDF template schema
  updatePDFTemplate: Joi.object({
    name: Joi.string().optional().min(3).max(100),
    description: Joi.string().optional().max(500),
    category: Joi.string().valid('quotation', 'invoice', 'contract', 'report', 'custom').optional(),
    html_content: Joi.string().optional().max(50000),
    css_content: Joi.string().optional().max(10000),
    variables: Joi.array().items(Joi.string()).optional(),
    default_options: Joi.object({
      format: Joi.string().valid('A4', 'A3', 'Letter', 'Legal').optional(),
      orientation: Joi.string().valid('portrait', 'landscape').optional(),
      margin: Joi.object({
        top: Joi.number().min(0).optional(),
        bottom: Joi.number().min(0).optional(),
        left: Joi.number().min(0).optional(),
        right: Joi.number().min(0).optional()
      }).optional(),
      header: Joi.object({
        enabled: Joi.boolean().optional(),
        content: Joi.string().optional(),
        height: Joi.number().min(0).optional()
      }).optional(),
      footer: Joi.object({
        enabled: Joi.boolean().optional(),
        content: Joi.string().optional(),
        height: Joi.number().min(0).optional()
      }).optional(),
      watermark: Joi.object({
        enabled: Joi.boolean().optional(),
        text: Joi.string().optional(),
        opacity: Joi.number().min(0).max(1).optional()
      }).optional()
    }).optional(),
    is_active: Joi.boolean().optional()
  }),

  // Get PDF template by ID schema
  getPDFTemplateById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get PDF templates schema
  getPDFTemplates: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('name', 'created_at', 'updated_at').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    category: Joi.string().valid('quotation', 'invoice', 'contract', 'report', 'custom').optional(),
    is_active: Joi.boolean().optional()
  }),

  // Delete PDF template schema
  deletePDFTemplate: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // === PDF COMPRESSION SCHEMAS ===

  // Compress PDF schema
  compressPDF: Joi.object({
    pdf_data: Joi.string().required(), // Base64 encoded PDF
    quality: Joi.string().valid('low', 'medium', 'high').default('medium'),
    max_size_mb: Joi.number().positive().optional(),
    remove_metadata: Joi.boolean().default(false)
  }),

  // === PDF DIGITAL SIGNATURE SCHEMAS ===

  // Sign PDF schema
  signPDF: Joi.object({
    pdf_data: Joi.string().required(), // Base64 encoded PDF
    certificate_path: Joi.string().required(),
    password: Joi.string().optional(),
    reason: Joi.string().optional(),
    location: Joi.string().optional(),
    signature_position: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      x: Joi.number().min(0).required(),
      y: Joi.number().min(0).required(),
      width: Joi.number().positive().optional(),
      height: Joi.number().positive().optional()
    }).optional()
  }),

  // Verify PDF signature schema
  verifyPDFSignature: Joi.object({
    pdf_data: Joi.string().required() // Base64 encoded PDF
  }),

  // === PDF MERGE SCHEMAS ===

  // Merge PDFs schema
  mergePDFs: Joi.object({
    pdfs: Joi.array().items(
      Joi.object({
        data: Joi.string().required(), // Base64 encoded PDF
        name: Joi.string().optional()
      })
    ).min(2).max(10).required(),
    output_name: Joi.string().optional(),
    options: Joi.object({
      add_bookmarks: Joi.boolean().default(false),
      add_page_numbers: Joi.boolean().default(false),
      compression: Joi.boolean().default(true)
    }).optional()
  }),

  // === PDF STATISTICS SCHEMAS ===

  // Get PDF statistics schema
  getPDFStatistics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    category: Joi.string().valid('quotation', 'invoice', 'contract', 'report', 'custom').optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional()
  }),

  // Get PDF template statistics schema
  getPDFTemplateStatistics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional()
  })
};

module.exports = pdfSchemas;
