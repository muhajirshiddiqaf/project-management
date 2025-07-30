const Joi = require('@hapi/joi');

// Analytics validation schemas
const analyticsSchemas = {
  // Get dashboard analytics schema
  getDashboardAnalytics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'year').default('month')
  }),

  // Get revenue analytics schema
  getRevenueAnalytics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'year').default('month'),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional()
  }),

  // Get client analytics schema
  getClientAnalytics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'year').default('month')
  }),

  // Get order analytics schema
  getOrderAnalytics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'year').default('month')
  }),

  // Get project analytics schema
  getProjectAnalytics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'year').default('month')
  }),

  // Get ticket analytics schema
  getTicketAnalytics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'year').default('month')
  })
};

module.exports = analyticsSchemas;
