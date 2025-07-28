const invoiceRoutes = require('./routes');
const invoiceHandler = require('./handler');
const InvoiceRepository = require('../../infrastructure/repositories/invoiceRepository');

const invoiceModule = {
  name: 'invoice',
  register: async function (server, options) {
    // Get database connection
    const db = server.app.db;

    // Create repository instance
    const invoiceRepository = new InvoiceRepository(db);

    // Inject repository into handler
    invoiceHandler.setInvoiceRepository(invoiceRepository);

    // Register routes
    server.route(invoiceRoutes);
  }
};

module.exports = invoiceModule;
