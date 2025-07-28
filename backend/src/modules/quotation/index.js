const QuotationHandler = require('./handler');
const routes = require('./routes');

const quotation = async (server, { service, validator, auth }) => {
  const quotationHandler = new QuotationHandler(service, validator);
  server.route(routes(quotationHandler, auth));
};

module.exports = {
  name: 'quotation',
  version: '1.0.0',
  register: quotation
};
