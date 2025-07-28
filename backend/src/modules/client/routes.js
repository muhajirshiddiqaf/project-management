const Joi = require('@hapi/joi');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // Get all clients (with tenant isolation)
  {
    method: 'GET',
    path: '/clients',
    handler: (request, h) => {
      // Handler akan diimplementasikan nanti
      return h.response({ message: 'Get clients' });
    },
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      tags: ['clients']
    }
  },

  // Get client by ID
  {
    method: 'GET',
    path: '/clients/{id}',
    handler: (request, h) => {
      // Handler akan diimplementasikan nanti
      return h.response({ message: 'Get client by ID' });
    },
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        })
      },
      tags: ['clients']
    }
  },

  // Create new client
  {
    method: 'POST',
    path: '/clients',
    handler: (request, h) => {
      // Handler akan diimplementasikan nanti
      return h.response({ message: 'Create client' });
    },
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['client:create']) }
      ],
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required(),
          phone: Joi.string().optional(),
          address: Joi.string().optional()
        })
      },
      tags: ['clients']
    }
  },

  // Update client
  {
    method: 'PUT',
    path: '/clients/{id}',
    handler: (request, h) => {
      // Handler akan diimplementasikan nanti
      return h.response({ message: 'Update client' });
    },
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['client:update']) }
      ],
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        }),
        payload: Joi.object({
          name: Joi.string().optional(),
          email: Joi.string().email().optional(),
          phone: Joi.string().optional(),
          address: Joi.string().optional()
        })
      },
      tags: ['clients']
    }
  },

  // Delete client
  {
    method: 'DELETE',
    path: '/clients/{id}',
    handler: (request, h) => {
      // Handler akan diimplementasikan nanti
      return h.response({ message: 'Delete client' });
    },
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['client:delete']) }
      ],
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        })
      },
      tags: ['clients']
    }
  },

  // Search clients
  {
    method: 'GET',
    path: '/clients/search',
    handler: (request, h) => {
      // Handler akan diimplementasikan nanti
      return h.response({ message: 'Search clients' });
    },
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: Joi.object({
          q: Joi.string().optional(),
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(10)
        })
      },
      tags: ['clients']
    }
  }
];

module.exports = routes;
