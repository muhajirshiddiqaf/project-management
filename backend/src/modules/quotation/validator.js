const Joi = require('@hapi/joi');

// Quotation validation schemas
const quotationSchemas = {
  // Create quotation schema
  createQuotation: Joi.object({
    project_id: Joi.string().required().uuid(),
    client_id: Joi.string().required().uuid(),
    quotation_number: Joi.string().optional().max(50),
    title: Joi.string().required().min(3).max(200),
    description: Joi.string().optional().max(2000),
    status: Joi.string().valid('draft', 'sent', 'approved', 'rejected', 'expired').default('draft'),
    valid_until: Joi.date().required(),
    issue_date: Joi.date().default(() => new Date()),
    subtotal: Joi.number().positive().required(),
    tax_rate: Joi.number().min(0).max(100).default(11),
    tax_amount: Joi.number().min(0).required(),
    discount_percentage: Joi.number().min(0).max(100).default(0),
    discount_amount: Joi.number().min(0).required(),
    total_amount: Joi.number().positive().required(),
    currency: Joi.string().default('IDR'),
    notes: Joi.string().optional().max(1000),
    terms_conditions: Joi.string().optional().max(2000),
    items: Joi.array().items(
      Joi.object({
        name: Joi.string().required().min(2).max(200),
        description: Joi.string().optional().max(500),
        quantity: Joi.number().positive().required(),
        unit_price: Joi.number().positive().required(),
        unit_type: Joi.string().valid('hour', 'day', 'piece', 'service', 'material').required(),
        tax_rate: Joi.number().min(0).max(100).default(0),
        discount_percentage: Joi.number().min(0).max(100).default(0),
        total: Joi.number().positive().required()
      })
    ).min(1).required()
  }),

  // Update quotation schema
  updateQuotation: Joi.object({
    project_id: Joi.string().optional().uuid(),
    client_id: Joi.string().optional().uuid(),
    quotation_number: Joi.string().optional().max(50),
    title: Joi.string().optional().min(3).max(200),
    description: Joi.string().optional().max(2000),
    status: Joi.string().valid('draft', 'sent', 'approved', 'rejected', 'expired').optional(),
    valid_until: Joi.date().optional(),
    issue_date: Joi.date().optional(),
    subtotal: Joi.number().positive().optional(),
    tax_rate: Joi.number().min(0).max(100).optional(),
    tax_amount: Joi.number().min(0).optional(),
    discount_percentage: Joi.number().min(0).max(100).optional(),
    discount_amount: Joi.number().min(0).optional(),
    total_amount: Joi.number().positive().optional(),
    currency: Joi.string().optional(),
    notes: Joi.string().optional().max(1000),
    terms_conditions: Joi.string().optional().max(2000)
  }),

  // Get quotation by ID schema
  getQuotationById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get quotations schema
  getQuotations: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('created_at', 'updated_at', 'valid_until', 'issue_date', 'total_amount', 'status').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    status: Joi.string().valid('draft', 'sent', 'approved', 'rejected', 'expired').optional(),
    client_id: Joi.string().optional().uuid(),
    project_id: Joi.string().optional().uuid(),
    created_by: Joi.string().optional().uuid()
  }),

  // Search quotations schema
  searchQuotations: Joi.object({
    q: Joi.string().optional().max(100),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('created_at', 'updated_at', 'valid_until', 'issue_date', 'total_amount', 'status').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // Delete quotation schema
  deleteQuotation: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Update quotation status schema
  updateQuotationStatus: Joi.object({
    status: Joi.string().valid('draft', 'sent', 'approved', 'rejected', 'expired').required(),
    approval_notes: Joi.string().optional().max(1000),
    approved_by: Joi.string().optional().uuid(),
    approved_at: Joi.date().optional()
  }),

  // Send quotation schema
  sendQuotation: Joi.object({
    email_template: Joi.string().optional().max(100),
    subject: Joi.string().optional().max(200),
    message: Joi.string().optional().max(2000),
    send_copy_to: Joi.array().items(Joi.string().email()).optional()
  }),

  // Generate quotation from project schema
  generateFromProject: Joi.object({
    project_id: Joi.string().required().uuid(),
    client_id: Joi.string().required().uuid(),
    title: Joi.string().required().min(3).max(200),
    description: Joi.string().optional().max(2000),
    valid_until: Joi.date().required(),
    tax_rate: Joi.number().min(0).max(100).default(11),
    discount_percentage: Joi.number().min(0).max(100).default(0),
    currency: Joi.string().default('IDR'),
    notes: Joi.string().optional().max(1000),
    terms_conditions: Joi.string().optional().max(2000)
  }),

  // === QUOTATION ITEMS SCHEMAS ===

  // Create quotation item schema
  createQuotationItem: Joi.object({
    quotation_id: Joi.string().required().uuid(),
    name: Joi.string().required().min(2).max(200),
    description: Joi.string().optional().max(500),
    quantity: Joi.number().positive().required(),
    unit_price: Joi.number().positive().required(),
    unit_type: Joi.string().valid('hour', 'day', 'piece', 'service', 'material').required(),
    tax_rate: Joi.number().min(0).max(100).default(0),
    discount_percentage: Joi.number().min(0).max(100).default(0),
    total: Joi.number().positive().required()
  }),

  // Update quotation item schema
  updateQuotationItem: Joi.object({
    name: Joi.string().optional().min(2).max(200),
    description: Joi.string().optional().max(500),
    quantity: Joi.number().positive().optional(),
    unit_price: Joi.number().positive().optional(),
    unit_type: Joi.string().valid('hour', 'day', 'piece', 'service', 'material').optional(),
    tax_rate: Joi.number().min(0).max(100).optional(),
    discount_percentage: Joi.number().min(0).max(100).optional(),
    total: Joi.number().positive().optional()
  }),

  // Get quotation item by ID schema
  getQuotationItemById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get quotation items schema
  getQuotationItems: Joi.object({
    quotation_id: Joi.string().required().uuid(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  }),

  // Delete quotation item schema
  deleteQuotationItem: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // === QUOTATION APPROVAL SCHEMAS ===

  // Approve quotation schema
  approveQuotation: Joi.object({
    approval_notes: Joi.string().optional().max(1000),
    approved_by: Joi.string().required().uuid()
  }),

  // Reject quotation schema
  rejectQuotation: Joi.object({
    rejection_reason: Joi.string().required().max(1000),
    rejected_by: Joi.string().required().uuid()
  }),

  // === QUOTATION STATISTICS SCHEMAS ===

  // Get quotation statistics schema
  getQuotationStatistics: Joi.object({
    organization_id: Joi.string().required().uuid()
  }),

  // Get quotation conversion statistics schema
  getQuotationConversionStatistics: Joi.object({
    organization_id: Joi.string().required().uuid()
  })
};

module.exports = quotationSchemas;
