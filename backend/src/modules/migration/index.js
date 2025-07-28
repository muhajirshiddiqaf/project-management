const migrationRoutes = require('./routes');
const migrationHandler = require('./handler');
const MigrationRepository = require('../../infrastructure/repositories/migrationRepository');

const migrationModule = {
  name: 'migration',
  register: async function (server, options) {
    const db = server.app.db;
    const migrationRepository = new MigrationRepository(db);
    migrationHandler.setMigrationRepository(migrationRepository);
    server.route(migrationRoutes);
  }
};

module.exports = migrationModule;
