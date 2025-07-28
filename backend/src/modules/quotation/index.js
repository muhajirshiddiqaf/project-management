const quotationRoutes = require('./routes');
const quotationHandler = require('./handler');
const QuotationRepository = require('../../infrastructure/repositories/quotationRepository');

const quotationModule = {
  name: 'quotation',
  register: async function (server, options) {
    const db = server.app.db;
    const quotationRepository = new QuotationRepository(db);
    quotationHandler.setQuotationRepository(quotationRepository);
    server.route(quotationRoutes);
  }
};

module.exports = quotationModule;
