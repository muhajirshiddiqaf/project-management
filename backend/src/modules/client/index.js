const ClientHandler = require('./handler');
const routes = require('./routes');

const client = async (server, { service, validator, auth }) => {
  const clientHandler = new ClientHandler(service, validator);
  server.route(routes(clientHandler, auth));
};

module.exports = {
  name: 'client',
  version: '1.0.0',
  register: client
};
