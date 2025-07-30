const routes = (handler, auth) => [
  // === ANALYTICS ROUTES ===

  // Test route to check if service is working
  {
    method: 'GET',
    path: '/analytics/test',
    handler: handler.testService,
    options: {
      auth: 'jwt',
      tags: ['analytics']
    }
  },

  // Get dashboard analytics
  {
    method: 'GET',
    path: '/analytics/dashboard',
    handler: handler.getDashboardAnalytics,
    options: {
      auth: 'jwt',
      validate: {
        query: auth.getDashboardAnalytics
      },
      tags: ['analytics']
    }
  },

  // Get revenue analytics
  {
    method: 'GET',
    path: '/analytics/revenue',
    handler: handler.getRevenueAnalytics,
    options: {
      auth: 'jwt',
      validate: {
        query: auth.getRevenueAnalytics
      },
      tags: ['analytics']
    }
  },

  // Get client analytics
  {
    method: 'GET',
    path: '/analytics/clients',
    handler: handler.getClientAnalytics,
    options: {
      auth: 'jwt',
      validate: {
        query: auth.getClientAnalytics
      },
      tags: ['analytics']
    }
  },

  // Get order analytics
  {
    method: 'GET',
    path: '/analytics/orders',
    handler: handler.getOrderAnalytics,
    options: {
      auth: 'jwt',
      validate: {
        query: auth.getOrderAnalytics
      },
      tags: ['analytics']
    }
  },

  // Get project analytics
  {
    method: 'GET',
    path: '/analytics/projects',
    handler: handler.getProjectAnalytics,
    options: {
      auth: 'jwt',
      validate: {
        query: auth.getProjectAnalytics
      },
      tags: ['analytics']
    }
  },

  // Get ticket analytics
  {
    method: 'GET',
    path: '/analytics/tickets',
    handler: handler.getTicketAnalytics,
    options: {
      auth: 'jwt',
      validate: {
        query: auth.getTicketAnalytics
      },
      tags: ['analytics']
    }
  }
];

module.exports = routes;
