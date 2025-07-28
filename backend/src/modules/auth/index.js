const AuthHandler = require('./handler');
const routes = require('./routes');

const auth = async (server, { service, validator, auth }) => {
  const authHandler = new AuthHandler(service, validator);
  server.route(routes(authHandler, auth));
};

module.exports = {
  name: 'auth',
  version: '1.0.0',
  register: auth
};
