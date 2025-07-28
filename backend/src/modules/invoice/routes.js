const invoiceHandler = require('./handler');
const invoiceValidator = require('./validator');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // === INVOICE CRUD ROUTES ===
  {
    method: 'GET',
    path: '/invoices',
    handler: invoiceHandler.getInvoices,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: invoiceValidator.getInvoices
      },
      tags: ['invoices']
    }
  },
  {
    method: 'GET',
    path: '/invoices/{id}',
    handler: invoiceHandler.getInvoiceById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: invoiceValidator.getInvoiceById
      },
      tags: ['invoices']
    }
  },
  {
    method: 'POST',
    path: '/invoices',
    handler: invoiceHandler.createInvoice,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['invoice:create']) }
      ],
      validate: {
        payload: invoiceValidator.createInvoice
      },
      tags: ['invoices']
    }
  },
  {
    method: 'PUT',
    path: '/invoices/{id}',
    handler: invoiceHandler.updateInvoice,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['invoice:update']) }
      ],
      validate: {
        params: invoiceValidator.getInvoiceById,
        payload: invoiceValidator.updateInvoice
      },
      tags: ['invoices']
    }
  },
  {
    method: 'DELETE',
    path: '/invoices/{id}',
    handler: invoiceHandler.deleteInvoice,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['invoice:delete']) }
      ],
      validate: {
        params: invoiceValidator.deleteInvoice
      },
      tags: ['invoices']
    }
  },
  {
    method: 'GET',
    path: '/invoices/search',
    handler: invoiceHandler.searchInvoices,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: invoiceValidator.searchInvoices
      },
      tags: ['invoices']
    }
  },
  {
    method: 'PUT',
    path: '/invoices/{id}/status',
    handler: invoiceHandler.updateInvoiceStatus,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['invoice:update_status']) }
      ],
      validate: {
        params: invoiceValidator.getInvoiceById,
        payload: invoiceValidator.updateInvoiceStatus
      },
      tags: ['invoices']
    }
  },
  {
    method: 'POST',
    path: '/invoices/{id}/send',
    handler: invoiceHandler.sendInvoice,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['invoice:send']) }
      ],
      validate: {
        params: invoiceValidator.getInvoiceById,
        payload: invoiceValidator.sendInvoice
      },
      tags: ['invoices']
    }
  },

  // === INVOICE ITEMS ROUTES ===
  {
    method: 'GET',
    path: '/invoices/items',
    handler: invoiceHandler.getInvoiceItems,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: invoiceValidator.getInvoiceItems
      },
      tags: ['invoice-items']
    }
  },
  {
    method: 'GET',
    path: '/invoices/items/{id}',
    handler: invoiceHandler.getInvoiceItemById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: invoiceValidator.getInvoiceItemById
      },
      tags: ['invoice-items']
    }
  },
  {
    method: 'POST',
    path: '/invoices/items',
    handler: invoiceHandler.createInvoiceItem,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['invoice:create_item']) }
      ],
      validate: {
        payload: invoiceValidator.createInvoiceItem
      },
      tags: ['invoice-items']
    }
  },
  {
    method: 'PUT',
    path: '/invoices/items/{id}',
    handler: invoiceHandler.updateInvoiceItem,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['invoice:update_item']) }
      ],
      validate: {
        params: invoiceValidator.getInvoiceItemById,
        payload: invoiceValidator.updateInvoiceItem
      },
      tags: ['invoice-items']
    }
  },
  {
    method: 'DELETE',
    path: '/invoices/items/{id}',
    handler: invoiceHandler.deleteInvoiceItem,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['invoice:delete_item']) }
      ],
      validate: {
        params: invoiceValidator.deleteInvoiceItem
      },
      tags: ['invoice-items']
    }
  },

  // === PAYMENT INTEGRATION ROUTES ===
  {
    method: 'POST',
    path: '/invoices/{id}/process-payment',
    handler: invoiceHandler.processPayment,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['invoice:process_payment']) }
      ],
      validate: {
        params: invoiceValidator.getInvoiceById,
        payload: invoiceValidator.processPayment
      },
      tags: ['payment']
    }
  },
  {
    method: 'POST',
    path: '/invoices/{id}/verify-payment',
    handler: invoiceHandler.verifyPayment,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['invoice:verify_payment']) }
      ],
      validate: {
        params: invoiceValidator.getInvoiceById,
        payload: invoiceValidator.verifyPayment
      },
      tags: ['payment']
    }
  },

  // === INVOICE STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/invoices/statistics',
    handler: invoiceHandler.getInvoiceStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: invoiceValidator.getInvoiceStatistics
      },
      tags: ['invoice-statistics']
    }
  },
  {
    method: 'GET',
    path: '/invoices/payment-statistics',
    handler: invoiceHandler.getPaymentStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: invoiceValidator.getPaymentStatistics
      },
      tags: ['invoice-statistics']
    }
  }
];

module.exports = routes;
