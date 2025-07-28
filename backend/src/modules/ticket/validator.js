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
    sortBy: Joi.string().valid('created_at', 'updated_at', 'title', 'priority', 'status', 'due_date').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    status: Joi.string().valid('open', 'in_progress', 'resolved', 'closed', 'cancelled').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    category: Joi.string().valid('bug', 'feature', 'support', 'question', 'other').optional(),
    client_id: Joi.string().optional().uuid(),
    project_id: Joi.string().optional().uuid(),
    assigned_to: Joi.string().optional().uuid(),
    created_by: Joi.string().optional().uuid()
  }),

  // Search tickets schema
  searchTickets: Joi.object({
    q: Joi.string().optional().max(100),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('created_at', 'updated_at', 'title', 'priority', 'status', 'due_date').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // Delete ticket schema
  deleteTicket: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Update ticket status schema
  updateTicketStatus: Joi.object({
    status: Joi.string().valid('open', 'in_progress', 'resolved', 'closed', 'cancelled').required(),
    notes: Joi.string().optional().max(1000)
  }),

  // Assign ticket schema
  assignTicket: Joi.object({
    assigned_to: Joi.string().required().uuid()
  }),

  // === TICKET MESSAGING SCHEMAS ===

  // Create ticket message schema
  createTicketMessage: Joi.object({
    ticket_id: Joi.string().required().uuid(),
    content: Joi.string().required().max(2000),
    message_type: Joi.string().valid('comment', 'internal_note', 'status_update', 'assignment_update').required(),
    is_internal: Joi.boolean().default(false),
    parent_message_id: Joi.string().optional().uuid(),
    attachments: Joi.array().items(Joi.string()).optional(),
    notify_users: Joi.array().items(Joi.string().uuid()).optional()
  }),

  // Update ticket message schema
  updateTicketMessage: Joi.object({
    content: Joi.string().optional().max(2000),
    message_type: Joi.string().valid('comment', 'internal_note', 'status_update', 'assignment_update').optional(),
    is_internal: Joi.boolean().optional(),
    attachments: Joi.array().items(Joi.string()).optional()
  }),

  // Get ticket message by ID schema
  getTicketMessageById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get ticket messages schema
  getTicketMessages: Joi.object({
    ticket_id: Joi.string().required().uuid(),
    message_type: Joi.string().valid('comment', 'internal_note', 'status_update', 'assignment_update').optional(),
    is_internal: Joi.boolean().optional(),
    parent_message_id: Joi.string().optional().uuid(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10)
  }),

  // Delete ticket message schema
  deleteTicketMessage: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Reply to ticket message schema
  replyToTicketMessage: Joi.object({
    ticket_id: Joi.string().required().uuid(),
    parent_message_id: Joi.string().required().uuid(),
    content: Joi.string().required().max(2000),
    message_type: Joi.string().valid('comment', 'internal_note').required(),
    is_internal: Joi.boolean().default(false),
    attachments: Joi.array().items(Joi.string()).optional()
  }),

  // Mark ticket message as read schema
  markTicketMessageAsRead: Joi.object({
    message_id: Joi.string().required().uuid()
  }),

  // Get ticket message thread schema
  getTicketMessageThread: Joi.object({
    message_id: Joi.string().required().uuid(),
    include_internal: Joi.boolean().default(false)
  }),

  // Bulk create ticket messages schema
  bulkCreateTicketMessages: Joi.object({
    ticket_id: Joi.string().required().uuid(),
    messages: Joi.array().items(
      Joi.object({
        content: Joi.string().required().max(2000),
        message_type: Joi.string().valid('comment', 'internal_note', 'status_update', 'assignment_update').required(),
        is_internal: Joi.boolean().default(false),
        parent_message_id: Joi.string().optional().uuid(),
        attachments: Joi.array().items(Joi.string()).optional()
      })
    ).min(1).max(50).required()
  }),

  // Import ticket messages schema
  importTicketMessages: Joi.object({
    ticket_id: Joi.string().required().uuid(),
    file: Joi.object({
      hapi: Joi.object({
        filename: Joi.string().required(),
        headers: Joi.object().required()
      }).required()
    }).required()
  }),

  // Export ticket messages schema
  exportTicketMessages: Joi.object({
    ticket_id: Joi.string().required().uuid(),
    format: Joi.string().valid('csv', 'xlsx', 'json').default('csv'),
    include_internal: Joi.boolean().default(false)
  })
};

module.exports = ticketSchemas;
