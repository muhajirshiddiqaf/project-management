const analyticsHandler = require('./handler');
const analyticsValidator = require('./validator');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // === DASHBOARD OVERVIEW ROUTES ===
  {
    method: 'GET',
    path: '/analytics/dashboard',
    handler: analyticsHandler.getDashboardOverview,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: analyticsValidator.getDashboardOverview
      },
      tags: ['analytics']
    }
  },

  // === REVENUE ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/revenue',
    handler: analyticsHandler.getRevenueAnalytics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: analyticsValidator.getRevenueAnalytics
      },
      tags: ['analytics']
    }
  },

  // === CLIENT ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/clients',
    handler: analyticsHandler.getClientAnalytics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: analyticsValidator.getClientAnalytics
      },
      tags: ['analytics']
    }
  },

  // === ORDER ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/orders',
    handler: analyticsHandler.getOrderAnalytics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: analyticsValidator.getOrderAnalytics
      },
      tags: ['analytics']
    }
  },

  // === TICKET ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/tickets',
    handler: analyticsHandler.getTicketAnalytics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: analyticsValidator.getTicketAnalytics
      },
      tags: ['analytics']
    }
  },

  // === PROJECT ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/projects',
    handler: analyticsHandler.getProjectAnalytics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: analyticsValidator.getProjectAnalytics
      },
      tags: ['analytics']
    }
  },

  // === SERVICE ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/services',
    handler: analyticsHandler.getServiceAnalytics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: analyticsValidator.getServiceAnalytics
      },
      tags: ['analytics']
    }
  },

  // === QUOTATION ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/quotations',
    handler: analyticsHandler.getQuotationAnalytics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: analyticsValidator.getQuotationAnalytics
      },
      tags: ['analytics']
    }
  },

  // === INVOICE ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/invoices',
    handler: analyticsHandler.getInvoiceAnalytics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: analyticsValidator.getInvoiceAnalytics
      },
      tags: ['analytics']
    }
  },

  // === PERFORMANCE METRICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/performance',
    handler: analyticsHandler.getPerformanceMetrics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: analyticsValidator.getPerformanceMetrics
      },
      tags: ['analytics']
    }
  },

  // === GROWTH ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/growth',
    handler: analyticsHandler.getGrowthAnalytics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: analyticsValidator.getGrowthAnalytics
      },
      tags: ['analytics']
    }
  },

  // === CUSTOM ANALYTICS ROUTES ===
  {
    method: 'POST',
    path: '/analytics/custom',
    handler: analyticsHandler.getCustomAnalytics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['analytics:custom']) }
      ],
      validate: {
        payload: analyticsValidator.getCustomAnalytics
      },
      tags: ['analytics']
    }
  },

  // === EXPORT ANALYTICS ROUTES ===
  {
    method: 'POST',
    path: '/analytics/export',
    handler: analyticsHandler.exportAnalyticsData,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['analytics:export']) }
      ],
      validate: {
        payload: analyticsValidator.exportAnalyticsData
      },
      tags: ['analytics']
    }
  },

  // === REAL-TIME ANALYTICS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/realtime',
    handler: analyticsHandler.getRealTimeDashboard,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: analyticsValidator.getRealTimeDashboard
      },
      tags: ['analytics']
    }
  },

  // === ACTIVITY FEED ROUTES ===
  {
    method: 'GET',
    path: '/analytics/activity-feed',
    handler: analyticsHandler.getActivityFeed,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: analyticsValidator.getActivityFeed
      },
      tags: ['analytics']
    }
  },

  // === ALERTS AND NOTIFICATIONS ROUTES ===
  {
    method: 'GET',
    path: '/analytics/alerts',
    handler: analyticsHandler.getAlertsAndNotifications,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: analyticsValidator.getAlertsAndNotifications
      },
      tags: ['analytics']
    }
  }
];

module.exports = routes;
