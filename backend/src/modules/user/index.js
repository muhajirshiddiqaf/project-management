const UserHandler = require('./handler');
const routes = require('./routes');

const user = async (server, { service, validator, auth }) => {
  const userHandler = new UserHandler(service, validator);
  server.route(routes(userHandler, auth));
};

module.exports = {
  name: 'user',
  version: '1.0.0',
  register: user
};
