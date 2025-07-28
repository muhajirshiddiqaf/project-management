const reportsRoutes = require('./routes');
const reportsHandler = require('./handler');
const ReportsRepository = require('../../infrastructure/repositories/reportsRepository');

const reportsModule = {
  name: 'reports',
  register: async function (server, options) {
    const db = server.app.db;
    const reportsRepository = new ReportsRepository(db);
    reportsHandler.setReportsRepository(reportsRepository);
    server.route(reportsRoutes);
  }
};

module.exports = reportsModule;
