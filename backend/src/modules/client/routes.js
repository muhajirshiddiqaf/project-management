const routes = (handler, auth) => [
  // === CLIENT CRUD ROUTES ===

  // Get all clients
  {
    method: 'GET',
    path: '/clients',
    handler: handler.getClients,
    options: {
      auth: 'jwt',
      validate: {
        query: auth.searchClients
      },
      tags: ['clients']
    }
  },

  // Get client by ID
  {
    method: 'GET',
    path: '/clients/{id}',
    handler: handler.getClientById,
    options: {
      auth: 'jwt',
      validate: {
        params: auth.getClientById
      },
      tags: ['clients']
    }
  },

  // Create client
  {
    method: 'POST',
    path: '/clients',
    handler: handler.createClient,
    options: {
      auth: 'jwt',
      validate: {
        payload: auth.createClient
      },
      tags: ['clients']
    }
  },

  // Update client
  {
    method: 'PUT',
    path: '/clients/{id}',
    handler: handler.updateClient,
    options: {
      auth: 'jwt',
      validate: {
        params: auth.getClientById,
        payload: auth.updateClient
      },
      tags: ['clients']
    }
  },

  // Delete client
  {
    method: 'DELETE',
    path: '/clients/{id}',
    handler: handler.deleteClient,
    options: {
      auth: 'jwt',
      validate: {
        params: auth.deleteClient
      },
      tags: ['clients']
    }
  },

  // Search clients
  {
    method: 'GET',
    path: '/clients/search',
    handler: handler.searchClients,
    options: {
      auth: 'jwt',

      validate: {
        query: auth.searchClients
      },
      tags: ['clients']
    }
  },

  // === CLIENT CONTACTS ROUTES ===

  // Get client contacts
  {
    method: 'GET',
    path: '/clients/contacts',
    handler: handler.getClientContacts,
    options: {
      auth: 'jwt',

      validate: {
        query: auth.getClientContacts
      },
      tags: ['client-contacts']
    }
  },

  // Get client contact by ID
  {
    method: 'GET',
    path: '/clients/contacts/{id}',
    handler: handler.getClientContactById,
    options: {
      auth: 'jwt',

      validate: {
        params: auth.getClientContactById
      },
      tags: ['client-contacts']
    }
  },

  // Create client contact
  {
    method: 'POST',
    path: '/clients/contacts',
    handler: handler.createClientContact,
    options: {
      auth: 'jwt',


      validate: {
        payload: auth.createClientContact
      },
      tags: ['client-contacts']
    }
  },

  // Update client contact
  {
    method: 'PUT',
    path: '/clients/contacts/{id}',
    handler: handler.updateClientContact,
    options: {
      auth: 'jwt',


      validate: {
        params: auth.getClientContactById,
        payload: auth.updateClientContact
      },
      tags: ['client-contacts']
    }
  },

  // Delete client contact
  {
    method: 'DELETE',
    path: '/clients/contacts/{id}',
    handler: handler.deleteClientContact,
    options: {
      auth: 'jwt',


      validate: {
        params: auth.deleteClientContact
      },
      tags: ['client-contacts']
    }
  },

  // === CLIENT COMMUNICATIONS ROUTES ===

  // Get client communications
  {
    method: 'GET',
    path: '/clients/communications',
    handler: handler.getClientCommunications,
    options: {
      auth: 'jwt',

      validate: {
        query: auth.getClientCommunications
      },
      tags: ['client-communications']
    }
  },

  // Get client communication by ID
  {
    method: 'GET',
    path: '/clients/communications/{id}',
    handler: handler.getClientCommunicationById,
    options: {
      auth: 'jwt',

      validate: {
        params: auth.getClientCommunicationById
      },
      tags: ['client-communications']
    }
  },

  // Create client communication
  {
    method: 'POST',
    path: '/clients/communications',
    handler: handler.createClientCommunication,
    options: {
      auth: 'jwt',


      validate: {
        payload: auth.createClientCommunication
      },
      tags: ['client-communications']
    }
  },

  // Update client communication
  {
    method: 'PUT',
    path: '/clients/communications/{id}',
    handler: handler.updateClientCommunication,
    options: {
      auth: 'jwt',


      validate: {
        params: auth.getClientCommunicationById,
        payload: auth.updateClientCommunication
      },
      tags: ['client-communications']
    }
  },

  // Delete client communication
  {
    method: 'DELETE',
    path: '/clients/communications/{id}',
    handler: handler.deleteClientCommunication,
    options: {
      auth: 'jwt',


      validate: {
        params: auth.deleteClientCommunication
      },
      tags: ['client-communications']
    }
  },

  // === CLIENT IMPORT/EXPORT ROUTES ===

  // Import clients
  {
    method: 'POST',
    path: '/clients/import',
    handler: handler.importClients,
    options: {
      auth: 'jwt',


      validate: {
        payload: auth.importClients
      },
      tags: ['client-import-export']
    }
  },

  // Export clients
  {
    method: 'GET',
    path: '/clients/export',
    handler: handler.exportClients,
    options: {
      auth: 'jwt',


      validate: {
        query: auth.exportClients
      },
      tags: ['client-import-export']
    }
  }
];

module.exports = routes;
