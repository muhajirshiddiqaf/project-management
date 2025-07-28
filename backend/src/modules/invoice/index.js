const InvoiceHandler = require('./handler');
const routes = require('./routes');

const invoice = async (server, { service, validator, auth }) => {
  const invoiceHandler = new InvoiceHandler(service, validator);
  server.route(routes(invoiceHandler, auth));
};

module.exports = {
  name: 'invoice',
  version: '1.0.0',
  register: invoice
};
