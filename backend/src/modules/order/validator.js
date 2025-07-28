const Joi = require('@hapi/joi');

// Order validation schemas
const orderSchemas = {
  // Create order schema
  createOrder: Joi.object({
    title: Joi.string().required().min(3).max(200),
    description: Joi.string().optional().max(1000),
    client_id: Joi.string().required().uuid(),
    project_id: Joi.string().optional().uuid(),
    status: Joi.string().valid('draft', 'pending', 'approved', 'in_progress', 'completed', 'cancelled').default('draft'),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
    due_date: Joi.date().optional(),
    assigned_to: Joi.string().optional().uuid(),
    tags: Joi.array().items(Joi.string()).optional(),
    notes: Joi.string().optional().max(1000)
  }),

  // Update order schema
  updateOrder: Joi.object({
    title: Joi.string().optional().min(3).max(200),
    description: Joi.string().optional().max(1000),
    client_id: Joi.string().optional().uuid(),
    project_id: Joi.string().optional().uuid(),
    status: Joi.string().valid('draft', 'pending', 'approved', 'in_progress', 'completed', 'cancelled').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    due_date: Joi.date().optional(),
    assigned_to: Joi.string().optional().uuid(),
    tags: Joi.array().items(Joi.string()).optional(),
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
    sortBy: Joi.string().valid('created_at', 'updated_at', 'title', 'status', 'priority', 'due_date').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    status: Joi.string().valid('draft', 'pending', 'approved', 'in_progress', 'completed', 'cancelled').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    client_id: Joi.string().optional().uuid(),
    project_id: Joi.string().optional().uuid(),
    assigned_to: Joi.string().optional().uuid()
  }),

  // Delete order schema
  deleteOrder: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Search orders schema
  searchOrders: Joi.object({
    q: Joi.string().optional().max(100),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('created_at', 'updated_at', 'title', 'status', 'priority', 'due_date').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // Update order status schema
  updateOrderStatus: Joi.object({
    status: Joi.string().valid('draft', 'pending', 'approved', 'in_progress', 'completed', 'cancelled').required(),
    notes: Joi.string().optional().max(1000)
  }),

  // Assign order schema
  assignOrder: Joi.object({
    assigned_to: Joi.string().required().uuid()
  }),

  // === ORDER ITEMS SCHEMAS ===

  // Create order item schema
  createOrderItem: Joi.object({
    order_id: Joi.string().required().uuid(),
    name: Joi.string().required().min(2).max(200),
    description: Joi.string().optional().max(500),
    quantity: Joi.number().positive().required(),
    unit_price: Joi.number().positive().required(),
    unit_type: Joi.string().valid('hour', 'day', 'piece', 'service', 'material').required(),
    category: Joi.string().valid('service', 'material', 'labor', 'overhead', 'other').required(),
    tax_rate: Joi.number().min(0).max(100).default(0),
    discount_percentage: Joi.number().min(0).max(100).default(0),
    notes: Joi.string().optional().max(500)
  }),

  // Update order item schema
  updateOrderItem: Joi.object({
    name: Joi.string().optional().min(2).max(200),
    description: Joi.string().optional().max(500),
    quantity: Joi.number().positive().optional(),
    unit_price: Joi.number().positive().optional(),
    unit_type: Joi.string().valid('hour', 'day', 'piece', 'service', 'material').optional(),
    category: Joi.string().valid('service', 'material', 'labor', 'overhead', 'other').optional(),
    tax_rate: Joi.number().min(0).max(100).optional(),
    discount_percentage: Joi.number().min(0).max(100).optional(),
    notes: Joi.string().optional().max(500)
  }),

  // Get order item by ID schema
  getOrderItemById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get order items schema
  getOrderItems: Joi.object({
    order_id: Joi.string().required().uuid(),
    category: Joi.string().valid('service', 'material', 'labor', 'overhead', 'other').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10)
  }),

  // Delete order item schema
  deleteOrderItem: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Calculate order totals schema
  calculateOrderTotals: Joi.object({
    order_id: Joi.string().required().uuid()
  }),

  // Bulk create order items schema
  bulkCreateOrderItems: Joi.object({
    order_id: Joi.string().required().uuid(),
    items: Joi.array().items(
      Joi.object({
        name: Joi.string().required().min(2).max(200),
        description: Joi.string().optional().max(500),
        quantity: Joi.number().positive().required(),
        unit_price: Joi.number().positive().required(),
        unit_type: Joi.string().valid('hour', 'day', 'piece', 'service', 'material').required(),
        category: Joi.string().valid('service', 'material', 'labor', 'overhead', 'other').required(),
        tax_rate: Joi.number().min(0).max(100).default(0),
        discount_percentage: Joi.number().min(0).max(100).default(0),
        notes: Joi.string().optional().max(500)
      })
    ).min(1).max(100).required()
  }),

  // Import order items schema
  importOrderItems: Joi.object({
    order_id: Joi.string().required().uuid(),
    file: Joi.object({
      hapi: Joi.object({
        filename: Joi.string().required(),
        headers: Joi.object().required()
      }).required()
    }).required()
  }),

  // Export order items schema
  exportOrderItems: Joi.object({
    order_id: Joi.string().required().uuid(),
    format: Joi.string().valid('csv', 'xlsx', 'json').default('csv')
  })
};

module.exports = orderSchemas;
