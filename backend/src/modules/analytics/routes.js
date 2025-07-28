const routes = (handler, auth) => [
  // === DASHBOARD OVERVIEW ROUTES ===
  {
    method: 'GET',
    path: '/analytics/dashboard',
    handler: handler.getDashboardOverview,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getDashboardOverview
      },
      tags: ['analytics']
    }
  },

  // === REVENUE ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/revenue',
    handler: handler.getRevenueAnalytics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getRevenueAnalytics
      },
      tags: ['analytics']
    }
  },

  // === CLIENT ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/clients',
    handler: handler.getClientAnalytics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getClientAnalytics
      },
      tags: ['analytics']
    }
  },

  // === ORDER ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/orders',
    handler: handler.getOrderAnalytics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getOrderAnalytics
      },
      tags: ['analytics']
    }
  },

  // === TICKET ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/tickets',
    handler: handler.getTicketAnalytics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getTicketAnalytics
      },
      tags: ['analytics']
    }
  },

  // === PROJECT ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/projects',
    handler: handler.getProjectAnalytics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getProjectAnalytics
      },
      tags: ['analytics']
    }
  },

  // === SERVICE ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/services',
    handler: handler.getServiceAnalytics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getServiceAnalytics
      },
      tags: ['analytics']
    }
  },

  // === QUOTATION ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/quotations',
    handler: handler.getQuotationAnalytics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getQuotationAnalytics
      },
      tags: ['analytics']
    }
  },

  // === INVOICE ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/invoices',
    handler: handler.getInvoiceAnalytics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getInvoiceAnalytics
      },
      tags: ['analytics']
    }
  },

  // === PERFORMANCE METRICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/performance',
    handler: handler.getPerformanceMetrics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getPerformanceMetrics
      },
      tags: ['analytics']
    }
  },

  // === GROWTH ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/growth',
    handler: handler.getGrowthAnalytics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getGrowthAnalytics
      },
      tags: ['analytics']
    }
  },

  // === CUSTOM ANALYTICS ROUTES ===
  {
    method: 'POST',
    path: '/analytics/custom',
    handler: handler.getCustomAnalytics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['analytics:custom']) }
      ],
      validate: {
        payload: auth.getCustomAnalytics
      },
      tags: ['analytics']
    }
  },

  // === EXPORT ANALYTICS ROUTES ===
  {
    method: 'POST',
    path: '/analytics/export',
    handler: handler.exportAnalyticsData,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['analytics:export']) }
      ],
      validate: {
        payload: auth.exportAnalyticsData
      },
      tags: ['analytics']
    }
  },

  // === REAL-TIME ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/realtime',
    handler: handler.getRealTimeDashboard,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getRealTimeDashboard
      },
      tags: ['analytics']
    }
  },

  // === ACTIVITY FEED ROUTES ===
  {
    method: 'GET',
    path: '/analytics/activity-feed',
    handler: handler.getActivityFeed,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getActivityFeed
      },
      tags: ['analytics']
    }
  },

  // === ALERTS AND NOTIFICATIONS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/alerts',
    handler: handler.getAlertsAndNotifications,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getAlertsAndNotifications
      },
      tags: ['analytics']
    }
  }
];

module.exports = routes;
