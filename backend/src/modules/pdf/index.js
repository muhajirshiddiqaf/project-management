const PdfHandler = require('./handler');
const routes = require('./routes');

const pdf = async (server, { service, validator, auth }) => {
  const pdfHandler = new PdfHandler(service, validator);
  server.route(routes(pdfHandler, auth));
};

module.exports = {
  name: 'pdf',
  version: '1.0.0',
  register: pdf
};
