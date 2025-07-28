const serviceRoutes = require('./routes');
const serviceHandler = require('./handler');
const ServiceRepository = require('../../infrastructure/repositories/serviceRepository');

const serviceModule = {
  name: 'service',
  register: async function (server, options) {
    const db = server.app.db;
    const serviceRepository = new ServiceRepository(db);
    serviceHandler.setServiceRepository(serviceRepository);
    server.route(serviceRoutes);
  }
};

module.exports = serviceModule;
