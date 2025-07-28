const Joi = require('@hapi/joi');

// Invoice validation schemas
const invoiceSchemas = {
  // Create invoice schema
  createInvoice: Joi.object({
    project_id: Joi.string().required().uuid(),
    client_id: Joi.string().required().uuid(),
    invoice_number: Joi.string().optional().max(50),
    title: Joi.string().required().min(3).max(200),
    description: Joi.string().optional().max(2000),
    status: Joi.string().valid('draft', 'sent', 'paid', 'overdue', 'cancelled').default('draft'),
    due_date: Joi.date().required(),
    issue_date: Joi.date().default(() => new Date()),
    payment_terms: Joi.number().integer().min(1).default(30),
    subtotal: Joi.number().positive().required(),
    tax_rate: Joi.number().min(0).max(100).default(11),
    tax_amount: Joi.number().min(0).required(),
    discount_percentage: Joi.number().min(0).max(100).default(0),
    discount_amount: Joi.number().min(0).required(),
    total_amount: Joi.number().positive().required(),
    currency: Joi.string().default('IDR'),
    notes: Joi.string().optional().max(1000),
    payment_method: Joi.string().valid('bank_transfer', 'credit_card', 'cash', 'check', 'paypal', 'stripe').optional(),
    payment_reference: Joi.string().optional().max(100),
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

  // Update invoice schema
  updateInvoice: Joi.object({
    project_id: Joi.string().optional().uuid(),
    client_id: Joi.string().optional().uuid(),
    invoice_number: Joi.string().optional().max(50),
    title: Joi.string().optional().min(3).max(200),
    description: Joi.string().optional().max(2000),
    status: Joi.string().valid('draft', 'sent', 'paid', 'overdue', 'cancelled').optional(),
    due_date: Joi.date().optional(),
    issue_date: Joi.date().optional(),
    payment_terms: Joi.number().integer().min(1).optional(),
    subtotal: Joi.number().positive().optional(),
    tax_rate: Joi.number().min(0).max(100).optional(),
    tax_amount: Joi.number().min(0).optional(),
    discount_percentage: Joi.number().min(0).max(100).optional(),
    discount_amount: Joi.number().min(0).optional(),
    total_amount: Joi.number().positive().optional(),
    currency: Joi.string().optional(),
    notes: Joi.string().optional().max(1000),
    payment_method: Joi.string().valid('bank_transfer', 'credit_card', 'cash', 'check', 'paypal', 'stripe').optional(),
    payment_reference: Joi.string().optional().max(100)
  }),

  // Get invoice by ID schema
  getInvoiceById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get invoices schema
  getInvoices: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('created_at', 'updated_at', 'due_date', 'issue_date', 'total_amount', 'status').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    status: Joi.string().valid('draft', 'sent', 'paid', 'overdue', 'cancelled').optional(),
    client_id: Joi.string().optional().uuid(),
    project_id: Joi.string().optional().uuid(),
    payment_method: Joi.string().valid('bank_transfer', 'credit_card', 'cash', 'check', 'paypal', 'stripe').optional(),
    created_by: Joi.string().optional().uuid()
  }),

  // Search invoices schema
  searchInvoices: Joi.object({
    q: Joi.string().optional().max(100),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('created_at', 'updated_at', 'due_date', 'issue_date', 'total_amount', 'status').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // Delete invoice schema
  deleteInvoice: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Update invoice status schema
  updateInvoiceStatus: Joi.object({
    status: Joi.string().valid('draft', 'sent', 'paid', 'overdue', 'cancelled').required(),
    payment_date: Joi.date().optional(),
    payment_method: Joi.string().valid('bank_transfer', 'credit_card', 'cash', 'check', 'paypal', 'stripe').optional(),
    payment_reference: Joi.string().optional().max(100),
    notes: Joi.string().optional().max(1000)
  }),

  // Send invoice schema
  sendInvoice: Joi.object({
    email_template: Joi.string().optional().max(100),
    subject: Joi.string().optional().max(200),
    message: Joi.string().optional().max(2000),
    send_copy_to: Joi.array().items(Joi.string().email()).optional()
  }),

  // === INVOICE ITEMS SCHEMAS ===

  // Create invoice item schema
  createInvoiceItem: Joi.object({
    invoice_id: Joi.string().required().uuid(),
    name: Joi.string().required().min(2).max(200),
    description: Joi.string().optional().max(500),
    quantity: Joi.number().positive().required(),
    unit_price: Joi.number().positive().required(),
    unit_type: Joi.string().valid('hour', 'day', 'piece', 'service', 'material').required(),
    tax_rate: Joi.number().min(0).max(100).default(0),
    discount_percentage: Joi.number().min(0).max(100).default(0),
    total: Joi.number().positive().required()
  }),

  // Update invoice item schema
  updateInvoiceItem: Joi.object({
    name: Joi.string().optional().min(2).max(200),
    description: Joi.string().optional().max(500),
    quantity: Joi.number().positive().optional(),
    unit_price: Joi.number().positive().optional(),
    unit_type: Joi.string().valid('hour', 'day', 'piece', 'service', 'material').optional(),
    tax_rate: Joi.number().min(0).max(100).optional(),
    discount_percentage: Joi.number().min(0).max(100).optional(),
    total: Joi.number().positive().optional()
  }),

  // Get invoice item by ID schema
  getInvoiceItemById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get invoice items schema
  getInvoiceItems: Joi.object({
    invoice_id: Joi.string().required().uuid(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  }),

  // Delete invoice item schema
  deleteInvoiceItem: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // === PAYMENT INTEGRATION SCHEMAS ===

  // Process payment schema
  processPayment: Joi.object({
    payment_method: Joi.string().valid('bank_transfer', 'credit_card', 'cash', 'check', 'paypal', 'stripe').required(),
    amount: Joi.number().positive().required(),
    currency: Joi.string().default('IDR'),
    payment_reference: Joi.string().optional().max(100),
    transaction_id: Joi.string().optional().max(100),
    payment_date: Joi.date().default(() => new Date()),
    notes: Joi.string().optional().max(1000)
  }),

  // Verify payment schema
  verifyPayment: Joi.object({
    transaction_id: Joi.string().required().max(100),
    payment_method: Joi.string().valid('bank_transfer', 'credit_card', 'cash', 'check', 'paypal', 'stripe').required()
  }),

  // === INVOICE STATISTICS SCHEMAS ===

  // Get invoice statistics schema
  getInvoiceStatistics: Joi.object({
    organization_id: Joi.string().required().uuid()
  }),

  // Get payment statistics schema
  getPaymentStatistics: Joi.object({
    organization_id: Joi.string().required().uuid()
  })
};

module.exports = invoiceSchemas;
