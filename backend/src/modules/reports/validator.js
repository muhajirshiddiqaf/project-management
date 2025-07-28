const Joi = require('@hapi/joi');

// Reports validation schemas
const reportSchemas = {
  // Generate report schema
  generateReport: Joi.object({
    report_type: Joi.string().valid('revenue', 'clients', 'orders', 'tickets', 'projects', 'services', 'quotations', 'invoices', 'custom').required(),
    format: Joi.string().valid('pdf', 'excel', 'csv', 'json').default('pdf'),
    filters: Joi.object({
      date_range: Joi.object({
        start_date: Joi.date().optional(),
        end_date: Joi.date().optional()
      }).optional(),
      status: Joi.array().items(Joi.string()).optional(),
      category: Joi.array().items(Joi.string()).optional(),
      client_id: Joi.array().items(Joi.string().uuid()).optional(),
      user_id: Joi.array().items(Joi.string().uuid()).optional(),
      priority: Joi.array().items(Joi.string().valid('low', 'medium', 'high', 'urgent')).optional()
    }).optional(),
    options: Joi.object({
      include_charts: Joi.boolean().default(true),
      include_summary: Joi.boolean().default(true),
      include_details: Joi.boolean().default(true),
      page_size: Joi.string().valid('A4', 'A3', 'Letter', 'Legal').default('A4'),
      orientation: Joi.string().valid('portrait', 'landscape').default('portrait'),
      header: Joi.object({
        enabled: Joi.boolean().default(true),
        title: Joi.string().optional(),
        subtitle: Joi.string().optional(),
        logo: Joi.boolean().default(true)
      }).optional(),
      footer: Joi.object({
        enabled: Joi.boolean().default(true),
        include_page_numbers: Joi.boolean().default(true),
        include_generated_date: Joi.boolean().default(true)
      }).optional()
    }).optional()
  }),

  // Create scheduled report schema
  createScheduledReport: Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().optional().max(500),
    report_type: Joi.string().valid('revenue', 'clients', 'orders', 'tickets', 'projects', 'services', 'quotations', 'invoices', 'custom').required(),
    schedule: Joi.object({
      frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'quarterly', 'yearly').required(),
      day_of_week: Joi.number().min(0).max(6).optional(), // 0 = Sunday, 6 = Saturday
      day_of_month: Joi.number().min(1).max(31).optional(),
      time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(), // HH:MM format
      timezone: Joi.string().optional()
    }).required(),
    format: Joi.string().valid('pdf', 'excel', 'csv', 'json').default('pdf'),
    recipients: Joi.array().items(Joi.string().email()).min(1).required(),
    filters: Joi.object({
      date_range: Joi.object({
        start_date: Joi.date().optional(),
        end_date: Joi.date().optional()
      }).optional(),
      status: Joi.array().items(Joi.string()).optional(),
      category: Joi.array().items(Joi.string()).optional(),
      client_id: Joi.array().items(Joi.string().uuid()).optional(),
      user_id: Joi.array().items(Joi.string().uuid()).optional()
    }).optional(),
    options: Joi.object({
      include_charts: Joi.boolean().default(true),
      include_summary: Joi.boolean().default(true),
      include_details: Joi.boolean().default(true),
      auto_send_email: Joi.boolean().default(true),
      save_to_storage: Joi.boolean().default(false)
    }).optional(),
    is_active: Joi.boolean().default(true)
  }),

  // Update scheduled report schema
  updateScheduledReport: Joi.object({
    name: Joi.string().optional().min(3).max(100),
    description: Joi.string().optional().max(500),
    report_type: Joi.string().valid('revenue', 'clients', 'orders', 'tickets', 'projects', 'services', 'quotations', 'invoices', 'custom').optional(),
    schedule: Joi.object({
      frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'quarterly', 'yearly').optional(),
      day_of_week: Joi.number().min(0).max(6).optional(),
      day_of_month: Joi.number().min(1).max(31).optional(),
      time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
      timezone: Joi.string().optional()
    }).optional(),
    format: Joi.string().valid('pdf', 'excel', 'csv', 'json').optional(),
    recipients: Joi.array().items(Joi.string().email()).optional(),
    filters: Joi.object({
      date_range: Joi.object({
        start_date: Joi.date().optional(),
        end_date: Joi.date().optional()
      }).optional(),
      status: Joi.array().items(Joi.string()).optional(),
      category: Joi.array().items(Joi.string()).optional(),
      client_id: Joi.array().items(Joi.string().uuid()).optional(),
      user_id: Joi.array().items(Joi.string().uuid()).optional()
    }).optional(),
    options: Joi.object({
      include_charts: Joi.boolean().optional(),
      include_summary: Joi.boolean().optional(),
      include_details: Joi.boolean().optional(),
      auto_send_email: Joi.boolean().optional(),
      save_to_storage: Joi.boolean().optional()
    }).optional(),
    is_active: Joi.boolean().optional()
  }),

  // Get scheduled report by ID schema
  getScheduledReportById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get scheduled reports schema
  getScheduledReports: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('name', 'created_at', 'updated_at', 'next_run').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    report_type: Joi.string().valid('revenue', 'clients', 'orders', 'tickets', 'projects', 'services', 'quotations', 'invoices', 'custom').optional(),
    is_active: Joi.boolean().optional()
  }),

  // Delete scheduled report schema
  deleteScheduledReport: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // === REPORT TEMPLATES SCHEMAS ===

  // Create report template schema
  createReportTemplate: Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().optional().max(500),
    report_type: Joi.string().valid('revenue', 'clients', 'orders', 'tickets', 'projects', 'services', 'quotations', 'invoices', 'custom').required(),
    template_data: Joi.object({
      layout: Joi.string().valid('standard', 'compact', 'detailed').default('standard'),
      sections: Joi.array().items(Joi.string()).optional(),
      charts: Joi.array().items(Joi.string()).optional(),
      styling: Joi.object({
        primary_color: Joi.string().optional(),
        secondary_color: Joi.string().optional(),
        font_family: Joi.string().optional(),
        font_size: Joi.string().optional()
      }).optional()
    }).required(),
    is_default: Joi.boolean().default(false),
    is_active: Joi.boolean().default(true)
  }),

  // Update report template schema
  updateReportTemplate: Joi.object({
    name: Joi.string().optional().min(3).max(100),
    description: Joi.string().optional().max(500),
    report_type: Joi.string().valid('revenue', 'clients', 'orders', 'tickets', 'projects', 'services', 'quotations', 'invoices', 'custom').optional(),
    template_data: Joi.object({
      layout: Joi.string().valid('standard', 'compact', 'detailed').optional(),
      sections: Joi.array().items(Joi.string()).optional(),
      charts: Joi.array().items(Joi.string()).optional(),
      styling: Joi.object({
        primary_color: Joi.string().optional(),
        secondary_color: Joi.string().optional(),
        font_family: Joi.string().optional(),
        font_size: Joi.string().optional()
      }).optional()
    }).optional(),
    is_default: Joi.boolean().optional(),
    is_active: Joi.boolean().optional()
  }),

  // Get report template by ID schema
  getReportTemplateById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get report templates schema
  getReportTemplates: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('name', 'created_at', 'updated_at').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    report_type: Joi.string().valid('revenue', 'clients', 'orders', 'tickets', 'projects', 'services', 'quotations', 'invoices', 'custom').optional(),
    is_active: Joi.boolean().optional()
  }),

  // Delete report template schema
  deleteReportTemplate: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // === REPORT HISTORY SCHEMAS ===

  // Get report history schema
  getReportHistory: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('created_at', 'report_type', 'status').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    report_type: Joi.string().valid('revenue', 'clients', 'orders', 'tickets', 'projects', 'services', 'quotations', 'invoices', 'custom').optional(),
    status: Joi.string().valid('pending', 'processing', 'completed', 'failed').optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional()
  }),

  // Get report by ID schema
  getReportById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Download report schema
  downloadReport: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // === REPORT EXPORT SCHEMAS ===

  // Export report data schema
  exportReportData: Joi.object({
    report_type: Joi.string().valid('revenue', 'clients', 'orders', 'tickets', 'projects', 'services', 'quotations', 'invoices', 'custom').required(),
    format: Joi.string().valid('csv', 'excel', 'json').default('csv'),
    filters: Joi.object({
      date_range: Joi.object({
        start_date: Joi.date().optional(),
        end_date: Joi.date().optional()
      }).optional(),
      status: Joi.array().items(Joi.string()).optional(),
      category: Joi.array().items(Joi.string()).optional(),
      client_id: Joi.array().items(Joi.string().uuid()).optional(),
      user_id: Joi.array().items(Joi.string().uuid()).optional()
    }).optional(),
    include_headers: Joi.boolean().default(true),
    include_metadata: Joi.boolean().default(true)
  }),

  // === BULK REPORT OPERATIONS ===

  // Bulk generate reports schema
  bulkGenerateReports: Joi.object({
    reports: Joi.array().items(
      Joi.object({
        report_type: Joi.string().valid('revenue', 'clients', 'orders', 'tickets', 'projects', 'services', 'quotations', 'invoices', 'custom').required(),
        format: Joi.string().valid('pdf', 'excel', 'csv', 'json').default('pdf'),
        filters: Joi.object({
          date_range: Joi.object({
            start_date: Joi.date().optional(),
            end_date: Joi.date().optional()
          }).optional(),
          status: Joi.array().items(Joi.string()).optional(),
          category: Joi.array().items(Joi.string()).optional(),
          client_id: Joi.array().items(Joi.string().uuid()).optional(),
          user_id: Joi.array().items(Joi.string().uuid()).optional()
        }).optional(),
        options: Joi.object({
          include_charts: Joi.boolean().default(true),
          include_summary: Joi.boolean().default(true),
          include_details: Joi.boolean().default(true)
        }).optional()
      })
    ).min(1).max(10).required(),
    zip_output: Joi.boolean().default(true)
  })
};

module.exports = reportSchemas;
