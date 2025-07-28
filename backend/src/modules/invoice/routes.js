const routes = (handler, auth) => [
  // === INVOICE CRUD ROUTES ===
  {
    method: 'GET',
    path: '/invoices',
    handler: handler.getInvoices,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getInvoices
      },
      tags: ['invoices']
    }
  },
  {
    method: 'GET',
    path: '/invoices/{id}',
    handler: handler.getInvoiceById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: auth.getInvoiceById
      },
      tags: ['invoices']
    }
  },
  {
    method: 'POST',
    path: '/invoices',
    handler: handler.createInvoice,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['invoice:create']) }
      ],
      validate: {
        payload: auth.createInvoice
      },
      tags: ['invoices']
    }
  },
  {
    method: 'PUT',
    path: '/invoices/{id}',
    handler: handler.updateInvoice,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['invoice:update']) }
      ],
      validate: {
        params: auth.getInvoiceById,
        payload: auth.updateInvoice
      },
      tags: ['invoices']
    }
  },
  {
    method: 'DELETE',
    path: '/invoices/{id}',
    handler: handler.deleteInvoice,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['invoice:delete']) }
      ],
      validate: {
        params: auth.deleteInvoice
      },
      tags: ['invoices']
    }
  },
  {
    method: 'GET',
    path: '/invoices/search',
    handler: handler.searchInvoices,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.searchInvoices
      },
      tags: ['invoices']
    }
  },
  {
    method: 'PUT',
    path: '/invoices/{id}/status',
    handler: handler.updateInvoiceStatus,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['invoice:update_status']) }
      ],
      validate: {
        params: auth.getInvoiceById,
        payload: auth.updateInvoiceStatus
      },
      tags: ['invoices']
    }
  },
  {
    method: 'POST',
    path: '/invoices/{id}/send',
    handler: handler.sendInvoice,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['invoice:send']) }
      ],
      validate: {
        params: auth.getInvoiceById,
        payload: auth.sendInvoice
      },
      tags: ['invoices']
    }
  },

  // === INVOICE ITEMS ROUTES ===
  {
    method: 'GET',
    path: '/invoices/items',
    handler: handler.getInvoiceItems,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getInvoiceItems
      },
      tags: ['invoice-items']
    }
  },
  {
    method: 'GET',
    path: '/invoices/items/{id}',
    handler: handler.getInvoiceItemById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: auth.getInvoiceItemById
      },
      tags: ['invoice-items']
    }
  },
  {
    method: 'POST',
    path: '/invoices/items',
    handler: handler.createInvoiceItem,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['invoice:create_item']) }
      ],
      validate: {
        payload: auth.createInvoiceItem
      },
      tags: ['invoice-items']
    }
  },
  {
    method: 'PUT',
    path: '/invoices/items/{id}',
    handler: handler.updateInvoiceItem,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['invoice:update_item']) }
      ],
      validate: {
        params: auth.getInvoiceItemById,
        payload: auth.updateInvoiceItem
      },
      tags: ['invoice-items']
    }
  },
  {
    method: 'DELETE',
    path: '/invoices/items/{id}',
    handler: handler.deleteInvoiceItem,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['invoice:delete_item']) }
      ],
      validate: {
        params: auth.deleteInvoiceItem
      },
      tags: ['invoice-items']
    }
  },

  // === PAYMENT INTEGRATION ROUTES ===
  {
    method: 'POST',
    path: '/invoices/{id}/process-payment',
    handler: handler.processPayment,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['invoice:process_payment']) }
      ],
      validate: {
        params: auth.getInvoiceById,
        payload: auth.processPayment
      },
      tags: ['payment']
    }
  },
  {
    method: 'POST',
    path: '/invoices/{id}/verify-payment',
    handler: handler.verifyPayment,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['invoice:verify_payment']) }
      ],
      validate: {
        params: auth.getInvoiceById,
        payload: auth.verifyPayment
      },
      tags: ['payment']
    }
  },

  // === INVOICE STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/invoices/statistics',
    handler: handler.getInvoiceStatistics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getInvoiceStatistics
      },
      tags: ['invoice-statistics']
    }
  },
  {
    method: 'GET',
    path: '/invoices/payment-statistics',
    handler: handler.getPaymentStatistics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getPaymentStatistics
      },
      tags: ['invoice-statistics']
    }
  }
];

module.exports = routes;
