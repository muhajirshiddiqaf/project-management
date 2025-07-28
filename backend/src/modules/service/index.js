const ServiceHandler = require('./handler');
const routes = require('./routes');

const service = async (server, { service, validator, auth }) => {
  const serviceHandler = new ServiceHandler(service, validator);
  server.route(routes(serviceHandler, auth));
};

module.exports = {
  name: 'service',
  version: '1.0.0',
  register: service
};
