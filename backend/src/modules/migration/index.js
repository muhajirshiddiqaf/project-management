const MigrationHandler = require('./handler');
const routes = require('./routes');

const migration = async (server, { service, validator, auth }) => {
  const migrationHandler = new MigrationHandler(service, validator);
  server.route(routes(migrationHandler, auth));
};

module.exports = {
  name: 'migration',
  version: '1.0.0',
  register: migration
};
