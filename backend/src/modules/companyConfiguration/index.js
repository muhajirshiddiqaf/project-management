const CompanyConfigurationHandler = require('./handler');
const routes = require('./routes');

const companyConfiguration = async (server, { service, validator, auth }) => {
  const companyConfigurationHandler = new CompanyConfigurationHandler(service, validator);
  server.route(routes(companyConfigurationHandler, auth));
};

module.exports = {
  name: 'company-configuration',
  version: '1.0.0',
  register: companyConfiguration
};
