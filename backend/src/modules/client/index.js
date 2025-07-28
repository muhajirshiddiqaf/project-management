const Hapi = require('@hapi/hapi');

// Import routes
const clientRoutes = require('./routes');

// Import handler
const clientHandler = require('./handler');

// Import repositories
const { ClientRepository } = require('../../infrastructure/repositories');

// Client module registration
const register = async (server, options) => {
  // Register routes
  server.route(clientRoutes);

  // Inject database into repositories
  const clientRepository = new ClientRepository(server.app.db);

  // Inject repository into handler
  clientHandler.setClientRepository(clientRepository);

  console.log('✅ Client module registered with multi-tenant support');
};

const name = 'client';

module.exports = {
  register,
  name
};
