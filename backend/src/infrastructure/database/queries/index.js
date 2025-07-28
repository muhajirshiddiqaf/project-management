// Centralized database queries index
const auth = require('./auth');
const user = require('./user');
const client = require('./client');
const order = require('./order');
const ticket = require('./ticket');

const queries = {
  auth,
  user,
  client,
  order,
  ticket
};

module.exports = { queries };
