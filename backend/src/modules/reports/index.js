const ReportsHandler = require('./handler');
const routes = require('./routes');

const reports = async (server, { service, validator, auth }) => {
  const reportsHandler = new ReportsHandler(service, validator);
  server.route(routes(reportsHandler, auth));
};

module.exports = {
  name: 'reports',
  version: '1.0.0',
  register: reports
};
