const systemRoutes = require('./routes');
const systemHandler = require('./handler');
const SystemRepository = require('../../infrastructure/repositories/systemRepository');

const systemModule = {
  name: 'system',
  register: async function (server, options) {
    const db = server.app.db;
    const systemRepository = new SystemRepository(db);
    systemHandler.setSystemRepository(systemRepository);
    server.route(systemRoutes);
  }
};

module.exports = systemModule;
