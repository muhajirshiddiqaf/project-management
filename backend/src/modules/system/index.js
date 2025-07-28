const SystemHandler = require('./handler');
const routes = require('./routes');

const system = async (server, { service, validator, auth }) => {
  const systemHandler = new SystemHandler(service, validator);
  server.route(routes(systemHandler, auth));
};

module.exports = {
  name: 'system',
  version: '1.0.0',
  register: system
};
