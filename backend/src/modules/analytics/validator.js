const Joi = require('@hapi/joi');

// Analytics validation schemas
const analyticsSchemas = {
  // Dashboard overview schema
  getDashboardOverview: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional()
  }),

  // Revenue analytics schema
  getRevenueAnalytics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    group_by: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    include_projections: Joi.boolean().default(false)
  }),

  // Client analytics schema
  getClientAnalytics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    group_by: Joi.string().valid('client', 'industry', 'region', 'size').default('client'),
    include_activity: Joi.boolean().default(true)
  }),

  // Order analytics schema
  getOrderAnalytics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').optional(),
    group_by: Joi.string().valid('day', 'week', 'month', 'status', 'client').default('month')
  }),

  // Ticket analytics schema
  getTicketAnalytics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    status: Joi.string().valid('open', 'in_progress', 'resolved', 'closed').optional(),
    group_by: Joi.string().valid('day', 'week', 'month', 'priority', 'status', 'assigned_to').default('month')
  }),

  // Project analytics schema
  getProjectAnalytics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    status: Joi.string().valid('planning', 'in_progress', 'completed', 'on_hold', 'cancelled').optional(),
    group_by: Joi.string().valid('day', 'week', 'month', 'status', 'client', 'manager').default('month')
  }),

  // Service analytics schema
  getServiceAnalytics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    category_id: Joi.string().optional().uuid(),
    group_by: Joi.string().valid('day', 'week', 'month', 'category', 'service').default('month')
  }),

  // Quotation analytics schema
  getQuotationAnalytics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    status: Joi.string().valid('draft', 'sent', 'accepted', 'rejected', 'expired').optional(),
    group_by: Joi.string().valid('day', 'week', 'month', 'status', 'client').default('month')
  }),

  // Invoice analytics schema
  getInvoiceAnalytics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    status: Joi.string().valid('draft', 'sent', 'paid', 'overdue', 'cancelled').optional(),
    group_by: Joi.string().valid('day', 'week', 'month', 'status', 'client').default('month')
  }),

  // Performance metrics schema
  getPerformanceMetrics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    include_comparison: Joi.boolean().default(true)
  }),

  // Growth analytics schema
  getGrowthAnalytics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    metric: Joi.string().valid('revenue', 'clients', 'orders', 'tickets', 'projects').required(),
    include_forecast: Joi.boolean().default(false)
  }),

  // === CUSTOM ANALYTICS SCHEMAS ===

  // Custom analytics query schema
  getCustomAnalytics: Joi.object({
    query_type: Joi.string().valid('revenue', 'clients', 'orders', 'tickets', 'projects', 'services', 'quotations', 'invoices').required(),
    filters: Joi.object({
      date_range: Joi.object({
        start_date: Joi.date().optional(),
        end_date: Joi.date().optional()
      }).optional(),
      status: Joi.array().items(Joi.string()).optional(),
      category: Joi.array().items(Joi.string()).optional(),
      client_id: Joi.array().items(Joi.string().uuid()).optional(),
      user_id: Joi.array().items(Joi.string().uuid()).optional()
    }).optional(),
    group_by: Joi.array().items(Joi.string()).optional(),
    sort_by: Joi.string().optional(),
    sort_order: Joi.string().valid('asc', 'desc').default('desc'),
    limit: Joi.number().integer().min(1).max(1000).default(100)
  }),

  // Export analytics data schema
  exportAnalyticsData: Joi.object({
    query_type: Joi.string().valid('revenue', 'clients', 'orders', 'tickets', 'projects', 'services', 'quotations', 'invoices').required(),
    format: Joi.string().valid('csv', 'excel', 'json').default('csv'),
    filters: Joi.object({
      date_range: Joi.object({
        start_date: Joi.date().optional(),
        end_date: Joi.date().optional()
      }).optional(),
      status: Joi.array().items(Joi.string()).optional(),
      category: Joi.array().items(Joi.string()).optional(),
      client_id: Joi.array().items(Joi.string().uuid()).optional(),
      user_id: Joi.array().items(Joi.string().uuid()).optional()
    }).optional(),
    include_headers: Joi.boolean().default(true)
  }),

  // === REAL-TIME ANALYTICS SCHEMAS ===

  // Real-time dashboard schema
  getRealTimeDashboard: Joi.object({
    include_activity: Joi.boolean().default(true),
    include_alerts: Joi.boolean().default(true),
    refresh_interval: Joi.number().integer().min(5).max(300).default(30)
  }),

  // Activity feed schema
  getActivityFeed: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    activity_type: Joi.array().items(Joi.string()).optional(),
    user_id: Joi.string().optional().uuid(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional()
  }),

  // Alerts and notifications schema
  getAlertsAndNotifications: Joi.object({
    alert_type: Joi.array().items(Joi.string()).optional(),
    priority: Joi.array().items(Joi.string().valid('low', 'medium', 'high', 'urgent')).optional(),
    status: Joi.array().items(Joi.string().valid('active', 'acknowledged', 'resolved')).optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
};

module.exports = analyticsSchemas;
