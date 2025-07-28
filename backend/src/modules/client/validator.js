const Joi = require('@hapi/joi');

// Client validation schemas
const clientSchemas = {
  // Create client schema
  createClient: Joi.object({
    name: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    phone: Joi.string().optional().max(20),
    address: Joi.string().optional().max(500),
    company: Joi.string().optional().max(100),
    website: Joi.string().uri().optional(),
    notes: Joi.string().optional().max(1000)
  }),

  // Update client schema
  updateClient: Joi.object({
    name: Joi.string().optional().min(2).max(100),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional().max(20),
    address: Joi.string().optional().max(500),
    company: Joi.string().optional().max(100),
    website: Joi.string().uri().optional(),
    notes: Joi.string().optional().max(1000)
  }),

  // Get client by ID schema
  getClientById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Search clients schema
  searchClients: Joi.object({
    q: Joi.string().optional().max(100),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('created_at', 'updated_at', 'name', 'company').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // Delete client schema
  deleteClient: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Create client contact schema
  createClientContact: Joi.object({
    client_id: Joi.string().required().uuid(),
    name: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    phone: Joi.string().optional().max(20),
    position: Joi.string().optional().max(100),
    department: Joi.string().optional().max(100),
    is_primary: Joi.boolean().default(false),
    notes: Joi.string().optional().max(500)
  }),

  // Update client contact schema
  updateClientContact: Joi.object({
    name: Joi.string().optional().min(2).max(100),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional().max(20),
    position: Joi.string().optional().max(100),
    department: Joi.string().optional().max(100),
    is_primary: Joi.boolean().optional(),
    notes: Joi.string().optional().max(500)
  }),

  // Get client contact by ID schema
  getClientContactById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get client contacts schema
  getClientContacts: Joi.object({
    client_id: Joi.string().required().uuid(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10)
  }),

  // Delete client contact schema
  deleteClientContact: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Create client communication schema
  createClientCommunication: Joi.object({
    client_id: Joi.string().required().uuid(),
    type: Joi.string().valid('email', 'phone', 'meeting', 'other').required(),
    subject: Joi.string().required().max(200),
    content: Joi.string().required().max(2000),
    direction: Joi.string().valid('inbound', 'outbound').required(),
    contact_id: Joi.string().optional().uuid(),
    scheduled_follow_up: Joi.date().optional(),
    notes: Joi.string().optional().max(1000)
  }),

  // Update client communication schema
  updateClientCommunication: Joi.object({
    type: Joi.string().valid('email', 'phone', 'meeting', 'other').optional(),
    subject: Joi.string().optional().max(200),
    content: Joi.string().optional().max(2000),
    direction: Joi.string().valid('inbound', 'outbound').optional(),
    contact_id: Joi.string().optional().uuid(),
    scheduled_follow_up: Joi.date().optional(),
    notes: Joi.string().optional().max(1000)
  }),

  // Get client communication by ID schema
  getClientCommunicationById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get client communications schema
  getClientCommunications: Joi.object({
    client_id: Joi.string().required().uuid(),
    type: Joi.string().valid('email', 'phone', 'meeting', 'other').optional(),
    direction: Joi.string().valid('inbound', 'outbound').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10)
  }),

  // Delete client communication schema
  deleteClientCommunication: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Import clients schema
  importClients: Joi.object({
    file: Joi.object({
      hapi: Joi.object({
        filename: Joi.string().required(),
        headers: Joi.object().required()
      }).required()
    }).required()
  }),

  // Export clients schema
  exportClients: Joi.object({
    format: Joi.string().valid('csv', 'xlsx', 'json').default('csv'),
    filters: Joi.object({
      search: Joi.string().optional(),
      company: Joi.string().optional(),
      created_after: Joi.date().optional(),
      created_before: Joi.date().optional()
    }).optional()
  })
};

module.exports = clientSchemas;
