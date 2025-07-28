const clientHandler = require('./handler');
const clientValidator = require('./validator');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // === CLIENT CRUD ROUTES ===

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
      validate: {
        query: clientValidator.searchClients
      },
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
  },

  // === CLIENT CONTACTS ROUTES ===

  // Get client contacts
  {
    method: 'GET',
    path: '/clients/contacts',
    handler: clientHandler.getClientContacts,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: clientValidator.getClientContacts
      },
      tags: ['client-contacts']
    }
  },

  // Get client contact by ID
  {
    method: 'GET',
    path: '/clients/contacts/{id}',
    handler: clientHandler.getClientContactById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: clientValidator.getClientContactById
      },
      tags: ['client-contacts']
    }
  },

  // Create client contact
  {
    method: 'POST',
    path: '/clients/contacts',
    handler: clientHandler.createClientContact,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['client:create_contact']) }
      ],
      validate: {
        payload: clientValidator.createClientContact
      },
      tags: ['client-contacts']
    }
  },

  // Update client contact
  {
    method: 'PUT',
    path: '/clients/contacts/{id}',
    handler: clientHandler.updateClientContact,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['client:update_contact']) }
      ],
      validate: {
        params: clientValidator.getClientContactById,
        payload: clientValidator.updateClientContact
      },
      tags: ['client-contacts']
    }
  },

  // Delete client contact
  {
    method: 'DELETE',
    path: '/clients/contacts/{id}',
    handler: clientHandler.deleteClientContact,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['client:delete_contact']) }
      ],
      validate: {
        params: clientValidator.deleteClientContact
      },
      tags: ['client-contacts']
    }
  },

  // === CLIENT COMMUNICATIONS ROUTES ===

  // Get client communications
  {
    method: 'GET',
    path: '/clients/communications',
    handler: clientHandler.getClientCommunications,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: clientValidator.getClientCommunications
      },
      tags: ['client-communications']
    }
  },

  // Get client communication by ID
  {
    method: 'GET',
    path: '/clients/communications/{id}',
    handler: clientHandler.getClientCommunicationById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: clientValidator.getClientCommunicationById
      },
      tags: ['client-communications']
    }
  },

  // Create client communication
  {
    method: 'POST',
    path: '/clients/communications',
    handler: clientHandler.createClientCommunication,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) },
        { method: permissionBasedAccess(['client:create_communication']) }
      ],
      validate: {
        payload: clientValidator.createClientCommunication
      },
      tags: ['client-communications']
    }
  },

  // Update client communication
  {
    method: 'PUT',
    path: '/clients/communications/{id}',
    handler: clientHandler.updateClientCommunication,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['client:update_communication']) }
      ],
      validate: {
        params: clientValidator.getClientCommunicationById,
        payload: clientValidator.updateClientCommunication
      },
      tags: ['client-communications']
    }
  },

  // Delete client communication
  {
    method: 'DELETE',
    path: '/clients/communications/{id}',
    handler: clientHandler.deleteClientCommunication,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['client:delete_communication']) }
      ],
      validate: {
        params: clientValidator.deleteClientCommunication
      },
      tags: ['client-communications']
    }
  },

  // === CLIENT IMPORT/EXPORT ROUTES ===

  // Import clients
  {
    method: 'POST',
    path: '/clients/import',
    handler: clientHandler.importClients,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['client:import']) }
      ],
      validate: {
        payload: clientValidator.importClients
      },
      tags: ['client-import-export']
    }
  },

  // Export clients
  {
    method: 'GET',
    path: '/clients/export',
    handler: clientHandler.exportClients,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) },
        { method: permissionBasedAccess(['client:export']) }
      ],
      validate: {
        query: clientValidator.exportClients
      },
      tags: ['client-import-export']
    }
  }
];

module.exports = routes;
