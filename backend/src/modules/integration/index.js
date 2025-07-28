const IntegrationHandler = require('./handler');
const createRoutes = require('./routes');
const IntegrationRepository = require('../../infrastructure/repositories/integrationRepository');

const integrationPlugin = {
  name: 'integration',
  version: '1.0.0',
  register: async (server, options) => {
    const { db } = options;

    // Create repository instance
    const integrationRepository = new IntegrationRepository(db);

    // Create handler instance with repository injection
    const integrationHandler = new IntegrationHandler(integrationRepository);

    // Create routes with handler
    const routes = createRoutes(integrationHandler);

    // Register routes
    server.route(routes);

    // Log plugin registration
    console.log('Integration module registered successfully');
  }
};

module.exports = integrationPlugin;
