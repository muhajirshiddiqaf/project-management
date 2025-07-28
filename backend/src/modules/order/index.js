const Hapi = require('@hapi/hapi');

// Import routes
const orderRoutes = require('./routes');

// Import handler
const orderHandler = require('./handler');

// Import repositories
const { OrderRepository } = require('../../infrastructure/repositories');

// Order module registration
const register = async (server, options) => {
  // Register routes
  server.route(orderRoutes);

  // Inject database into repositories
  const orderRepository = new OrderRepository(server.app.db);

  // Inject repository into handler
  orderHandler.setOrderRepository(orderRepository);

  console.log('✅ Order module registered with multi-tenant support');
};

const name = 'order';

module.exports = {
  register,
  name
};
