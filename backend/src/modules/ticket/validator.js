const Joi = require('@hapi/joi');

// Ticket validation schemas
const ticketSchemas = {
  // Create ticket schema
  createTicket: Joi.object({
    title: Joi.string().required().min(3).max(200),
    description: Joi.string().required().max(2000),
    category: Joi.string().valid('bug', 'feature', 'support', 'question', 'other').required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
    status: Joi.string().valid('open', 'in_progress', 'resolved', 'closed', 'cancelled').default('open'),
    client_id: Joi.string().optional().uuid(),
    project_id: Joi.string().optional().uuid(),
    order_id: Joi.string().optional().uuid(),
    assigned_to: Joi.string().optional().uuid(),
    due_date: Joi.date().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    attachments: Joi.array().items(Joi.string()).optional()
  }),

  // Update ticket schema
  updateTicket: Joi.object({
    title: Joi.string().optional().min(3).max(200),
    description: Joi.string().optional().max(2000),
    category: Joi.string().valid('bug', 'feature', 'support', 'question', 'other').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    status: Joi.string().valid('open', 'in_progress', 'resolved', 'closed', 'cancelled').optional(),
    client_id: Joi.string().optional().uuid(),
    project_id: Joi.string().optional().uuid(),
    order_id: Joi.string().optional().uuid(),
    assigned_to: Joi.string().optional().uuid(),
    due_date: Joi.date().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    attachments: Joi.array().items(Joi.string()).optional()
  }),

  // Get ticket by ID schema
  getTicketById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get tickets schema
  getTickets: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid('open', 'in_progress', 'resolved', 'closed', 'cancelled').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    category: Joi.string().valid('bug', 'feature', 'support', 'question', 'other').optional(),
    client_id: Joi.string().optional().uuid(),
    project_id: Joi.string().optional().uuid(),
    assigned_to: Joi.string().optional().uuid(),
    created_by: Joi.string().optional().uuid(),
    sortBy: Joi.string().valid('created_at', 'updated_at', 'priority', 'due_date', 'status').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // Search tickets schema
  searchTickets: Joi.object({
    q: Joi.string().optional().max(100),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid('open', 'in_progress', 'resolved', 'closed', 'cancelled').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    category: Joi.string().valid('bug', 'feature', 'support', 'question', 'other').optional(),
    sortBy: Joi.string().valid('created_at', 'updated_at', 'priority', 'due_date', 'status').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // Delete ticket schema
  deleteTicket: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Update ticket status schema
  updateTicketStatus: Joi.object({
    id: Joi.string().required().uuid(),
    status: Joi.string().valid('open', 'in_progress', 'resolved', 'closed', 'cancelled').required(),
    notes: Joi.string().optional().max(500)
  }),

  // Assign ticket schema
  assignTicket: Joi.object({
    id: Joi.string().required().uuid(),
    assigned_to: Joi.string().required().uuid()
  }),

  // Add ticket comment schema
  addTicketComment: Joi.object({
    id: Joi.string().required().uuid(),
    content: Joi.string().required().max(1000),
    is_internal: Joi.boolean().default(false),
    attachments: Joi.array().items(Joi.string()).optional()
  }),

  // Get ticket comments schema
  getTicketComments: Joi.object({
    id: Joi.string().required().uuid(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10)
  })
};

module.exports = ticketSchemas;
