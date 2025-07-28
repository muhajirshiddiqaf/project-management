// Repositories index
const UserRepository = require('./userRepository');
const ClientRepository = require('./clientRepository');
const OrderRepository = require('./orderRepository');
const TicketRepository = require('./ticketRepository');
const ProjectRepository = require('./projectRepository');
const InvoiceRepository = require('./invoiceRepository');
const QuotationRepository = require('./quotationRepository');
const ServiceRepository = require('./serviceRepository');
const EmailRepository = require('./emailRepository');
const PDFRepository = require('./pdfRepository');
const AnalyticsRepository = require('./analyticsRepository');
const ReportsRepository = require('./reportsRepository');
const DocsRepository = require('./docsRepository'); // New import

module.exports = {
  UserRepository,
  ClientRepository,
  OrderRepository,
  TicketRepository,
  ProjectRepository,
  InvoiceRepository,
  QuotationRepository,
  ServiceRepository,
  EmailRepository,
  PDFRepository,
  AnalyticsRepository,
  ReportsRepository,
  DocsRepository // New export
};
