const DocsHandler = require('./handler');
const routes = require('./routes');

const docs = async (server, { service, validator, auth }) => {
  const docsHandler = new DocsHandler(service, validator);
  server.route(routes(docsHandler, auth));
};

module.exports = {
  name: 'docs',
  version: '1.0.0',
  register: docs
};
