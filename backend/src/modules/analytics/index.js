const AnalyticsHandler = require('./handler');
const routes = require('./routes');

const analytics = async (server, { service, validator, auth }) => {
  const analyticsHandler = new AnalyticsHandler(service, validator);
  server.route(routes(analyticsHandler, auth));
};

module.exports = {
  name: 'analytics',
  version: '1.0.0',
  register: analytics
};
