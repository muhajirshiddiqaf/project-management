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
    sortBy: Joi.string().valid('name', 'email', 'created_at').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // Delete client schema
  deleteClient: Joi.object({
    id: Joi.string().required().uuid()
  })
};

module.exports = clientSchemas;
