const Hapi = require('@hapi/hapi');

// Import routes
const ticketRoutes = require('./routes');

// Import handler
const ticketHandler = require('./handler');

// Import repositories
const { TicketRepository } = require('../../infrastructure/repositories');

// Ticket module registration
const register = async (server, options) => {
  // Register routes
  server.route(ticketRoutes);

  // Inject database into repositories
  const ticketRepository = new TicketRepository(server.app.db);

  // Inject repository into handler
  ticketHandler.setTicketRepository(ticketRepository);

  console.log('✅ Ticket module registered with multi-tenant support');
};

const name = 'ticket';

module.exports = {
  register,
  name
};
