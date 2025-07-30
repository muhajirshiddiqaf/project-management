const AnalyticsHandler = require('./handler');
const AnalyticsService = require('./service');
const AnalyticsValidator = require('./validator');
const AnalyticsRoutes = require('./routes');

const analytics = async (server, { service, validator, auth }) => {
  const analyticsHandler = new AnalyticsHandler(service, validator);
  server.route(AnalyticsRoutes(analyticsHandler, auth));
};

module.exports = {
  name: 'analytics',
  version: '1.0.0',
  register: analytics
};
