const organizationRoutes = require('./routes');
const organizationHandler = require('./handler');
const OrganizationRepository = require('../../infrastructure/repositories/organizationRepository');

const organizationModule = {
  name: 'organization',
  register: async function (server, options) {
    const db = server.app.db;
    const organizationRepository = new OrganizationRepository(db);
    organizationHandler.setOrganizationRepository(organizationRepository);
    server.route(organizationRoutes);
  }
};

module.exports = organizationModule;
