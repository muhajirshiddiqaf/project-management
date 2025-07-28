const EmailHandler = require('./handler');
const routes = require('./routes');

const email = async (server, { service, validator, auth }) => {
  const emailHandler = new EmailHandler(service, validator);
  server.route(routes(emailHandler, auth));
};

module.exports = {
  name: 'email',
  version: '1.0.0',
  register: email
};
