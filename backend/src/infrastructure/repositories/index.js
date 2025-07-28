// Repositories index
const UserRepository = require('./userRepository');
const ClientRepository = require('./clientRepository');
const OrderRepository = require('./orderRepository');
const TicketRepository = require('./ticketRepository');
const ProjectRepository = require('./projectRepository');
const InvoiceRepository = require('./invoiceRepository');
const QuotationRepository = require('./quotationRepository'); // New import

module.exports = {
  UserRepository,
  ClientRepository,
  OrderRepository,
  TicketRepository,
  ProjectRepository,
  InvoiceRepository,
  QuotationRepository // New export
};
