const Hapi = require('@hapi/hapi');

// Import routes
const clientRoutes = require('./routes');

// Client module registration
const register = async (server, options) => {
  // Register routes
  server.route(clientRoutes);

  console.log('✅ Client module registered with multi-tenant support');
};

const name = 'client';

module.exports = {
  register,
  name
};
