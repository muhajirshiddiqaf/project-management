// Centralized database queries index
const auth = require('./auth');
const user = require('./user');
const client = require('./client');
const order = require('./order');
const ticket = require('./ticket');
const project = require('./project');
const invoice = require('./invoice');
const quotation = require('./quotation');
const service = require('./service');
const email = require('./email');
const pdf = require('./pdf');
const analytics = require('./analytics'); // New import

const queries = {
  auth,
  user,
  client,
  order,
  ticket,
  project,
  invoice,
  quotation,
  service,
  email,
  pdf,
  analytics // New export
};

module.exports = { queries };
