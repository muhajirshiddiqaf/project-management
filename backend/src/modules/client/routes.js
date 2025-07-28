const clientHandler = require('./handler');
const clientValidator = require('./validator');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // Get all clients
  {
    method: 'GET',
    path: '/clients',
    handler: clientHandler.getClients,
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
    handler: clientHandler.getClientById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: clientValidator.getClientById
      },
      tags: ['clients']
    }
  },

  // Create client
  {
    method: 'POST',
    path: '/clients',
    handler: clientHandler.createClient,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['client:create']) }
      ],
      validate: {
        payload: clientValidator.createClient
      },
      tags: ['clients']
    }
  },

  // Update client
  {
    method: 'PUT',
    path: '/clients/{id}',
    handler: clientHandler.updateClient,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['client:update']) }
      ],
      validate: {
        params: clientValidator.getClientById,
        payload: clientValidator.updateClient
      },
      tags: ['clients']
    }
  },

  // Delete client
  {
    method: 'DELETE',
    path: '/clients/{id}',
    handler: clientHandler.deleteClient,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['client:delete']) }
      ],
      validate: {
        params: clientValidator.deleteClient
      },
      tags: ['clients']
    }
  },

  // Search clients
  {
    method: 'GET',
    path: '/clients/search',
    handler: clientHandler.searchClients,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: clientValidator.searchClients
      },
      tags: ['clients']
    }
  }
];

module.exports = routes;
