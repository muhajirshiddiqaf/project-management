const OrderHandler = require('./handler');
const routes = require('./routes');

const order = async (server, { service, validator, auth }) => {
  const orderHandler = new OrderHandler(service, validator);
  server.route(routes(orderHandler, auth));
};

module.exports = {
  name: 'order',
  version: '1.0.0',
  register: order
};
