const TicketHandler = require('./handler');
const routes = require('./routes');

const ticket = async (server, { service, validator, auth }) => {
  const ticketHandler = new TicketHandler(service, validator);
  server.route(routes(ticketHandler, auth));
};

module.exports = {
  name: 'ticket',
  version: '1.0.0',
  register: ticket
};
