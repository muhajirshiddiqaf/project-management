const docsRoutes = require('./routes');
const docsHandler = require('./handler');
const DocsRepository = require('../../infrastructure/repositories/docsRepository');

const docsModule = {
  name: 'docs',
  register: async function (server, options) {
    const db = server.app.db;
    const docsRepository = new DocsRepository(db);
    docsHandler.setDocsRepository(docsRepository);
    server.route(docsRoutes);
  }
};

module.exports = docsModule;
