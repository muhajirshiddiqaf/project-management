const analyticsRoutes = require('./routes');
const analyticsHandler = require('./handler');
const AnalyticsRepository = require('../../infrastructure/repositories/analyticsRepository');

const analyticsModule = {
  name: 'analytics',
  register: async function (server, options) {
    const db = server.app.db;
    const analyticsRepository = new AnalyticsRepository(db);
    analyticsHandler.setAnalyticsRepository(analyticsRepository);
    server.route(analyticsRoutes);
  }
};

module.exports = analyticsModule;
