const OrganizationHandler = require('./handler');
const routes = require('./routes');

const organization = async (server, { service, validator, auth }) => {
  const organizationHandler = new OrganizationHandler(service, validator);
  server.route(routes(organizationHandler, auth));
};

module.exports = {
  name: 'organization',
  version: '1.0.0',
  register: organization
};
