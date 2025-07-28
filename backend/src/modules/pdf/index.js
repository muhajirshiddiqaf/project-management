const pdfRoutes = require('./routes');
const pdfHandler = require('./handler');
const PDFRepository = require('../../infrastructure/repositories/pdfRepository');

const pdfModule = {
  name: 'pdf',
  register: async function (server, options) {
    const db = server.app.db;
    const pdfRepository = new PDFRepository(db);
    pdfHandler.setPDFRepository(pdfRepository);
    server.route(pdfRoutes);
  }
};

module.exports = pdfModule;
