const Joi = require('@hapi/joi');

// Order validation schemas
const orderSchemas = {
  // Create order schema
  createOrder: Joi.object({
    title: Joi.string().required().min(3).max(200),
    description: Joi.string().optional().max(1000),
    client_id: Joi.string().required().uuid(),
    project_id: Joi.string().optional().uuid(),
    order_date: Joi.date().default(() => new Date()),
    due_date: Joi.date().optional(),
    total_amount: Joi.number().positive().required(),
    currency: Joi.string().default('IDR'),
    status: Joi.string().valid('draft', 'pending', 'approved', 'in_progress', 'completed', 'cancelled').default('draft'),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
    assigned_to: Joi.string().optional().uuid(),
    notes: Joi.string().optional().max(1000)
  }),

  // Update order schema
  updateOrder: Joi.object({
    title: Joi.string().optional().min(3).max(200),
    description: Joi.string().optional().max(1000),
    client_id: Joi.string().optional().uuid(),
    project_id: Joi.string().optional().uuid(),
    order_date: Joi.date().optional(),
    due_date: Joi.date().optional(),
    total_amount: Joi.number().positive().optional(),
    currency: Joi.string().optional(),
    status: Joi.string().valid('draft', 'pending', 'approved', 'in_progress', 'completed', 'cancelled').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    assigned_to: Joi.string().optional().uuid(),
    notes: Joi.string().optional().max(1000)
  }),

  // Get order by ID schema
  getOrderById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get orders schema
  getOrders: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid('draft', 'pending', 'approved', 'in_progress', 'completed', 'cancelled').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    client_id: Joi.string().optional().uuid(),
    assigned_to: Joi.string().optional().uuid(),
    sortBy: Joi.string().valid('created_at', 'order_date', 'due_date', 'total_amount', 'priority').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // Search orders schema
  searchOrders: Joi.object({
    q: Joi.string().optional().max(100),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid('draft', 'pending', 'approved', 'in_progress', 'completed', 'cancelled').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    sortBy: Joi.string().valid('created_at', 'order_date', 'due_date', 'total_amount', 'priority').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // Delete order schema
  deleteOrder: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Update order status schema
  updateOrderStatus: Joi.object({
    id: Joi.string().required().uuid(),
    status: Joi.string().valid('draft', 'pending', 'approved', 'in_progress', 'completed', 'cancelled').required(),
    notes: Joi.string().optional().max(500)
  }),

  // Assign order schema
  assignOrder: Joi.object({
    id: Joi.string().required().uuid(),
    assigned_to: Joi.string().required().uuid()
  })
};

module.exports = orderSchemas;
