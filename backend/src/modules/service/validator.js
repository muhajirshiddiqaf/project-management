const Joi = require('@hapi/joi');

// Service validation schemas
const serviceSchemas = {
  // Create service schema
  createService: Joi.object({
    name: Joi.string().required().min(3).max(200),
    description: Joi.string().optional().max(2000),
    category_id: Joi.string().required().uuid(),
    code: Joi.string().optional().max(50),
    unit_type: Joi.string().valid('hour', 'day', 'piece', 'service', 'material').required(),
    base_price: Joi.number().positive().required(),
    currency: Joi.string().default('IDR'),
    is_active: Joi.boolean().default(true),
    tags: Joi.array().items(Joi.string()).optional(),
    specifications: Joi.object().optional(),
    notes: Joi.string().optional().max(1000)
  }),

  // Update service schema
  updateService: Joi.object({
    name: Joi.string().optional().min(3).max(200),
    description: Joi.string().optional().max(2000),
    category_id: Joi.string().optional().uuid(),
    code: Joi.string().optional().max(50),
    unit_type: Joi.string().valid('hour', 'day', 'piece', 'service', 'material').optional(),
    base_price: Joi.number().positive().optional(),
    currency: Joi.string().optional(),
    is_active: Joi.boolean().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    specifications: Joi.object().optional(),
    notes: Joi.string().optional().max(1000)
  }),

  // Get service by ID schema
  getServiceById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get services schema
  getServices: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('name', 'created_at', 'updated_at', 'base_price', 'category_id').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    category_id: Joi.string().optional().uuid(),
    is_active: Joi.boolean().optional(),
    unit_type: Joi.string().valid('hour', 'day', 'piece', 'service', 'material').optional()
  }),

  // Search services schema
  searchServices: Joi.object({
    q: Joi.string().required().min(1),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('name', 'created_at', 'updated_at', 'base_price').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // Delete service schema
  deleteService: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Update service status schema
  updateServiceStatus: Joi.object({
    is_active: Joi.boolean().required()
  }),

  // === SERVICE CATEGORIES SCHEMAS ===

  // Create service category schema
  createServiceCategory: Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().optional().max(500),
    parent_id: Joi.string().optional().uuid(),
    is_active: Joi.boolean().default(true),
    icon: Joi.string().optional().max(100),
    color: Joi.string().optional().max(7)
  }),

  // Update service category schema
  updateServiceCategory: Joi.object({
    name: Joi.string().optional().min(3).max(100),
    description: Joi.string().optional().max(500),
    parent_id: Joi.string().optional().uuid(),
    is_active: Joi.boolean().optional(),
    icon: Joi.string().optional().max(100),
    color: Joi.string().optional().max(7)
  }),

  // Get service category by ID schema
  getServiceCategoryById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get service categories schema
  getServiceCategories: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('name', 'created_at', 'updated_at').default('name'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
    parent_id: Joi.string().optional().uuid(),
    is_active: Joi.boolean().optional()
  }),

  // Delete service category schema
  deleteServiceCategory: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // === SERVICE PRICING SCHEMAS ===

  // Create service pricing schema
  createServicePricing: Joi.object({
    service_id: Joi.string().required().uuid(),
    pricing_type: Joi.string().valid('fixed', 'hourly', 'daily', 'tiered').required(),
    base_price: Joi.number().positive().required(),
    currency: Joi.string().default('IDR'),
    min_quantity: Joi.number().positive().optional(),
    max_quantity: Joi.number().positive().optional(),
    discount_percentage: Joi.number().min(0).max(100).default(0),
    is_active: Joi.boolean().default(true),
    valid_from: Joi.date().default(() => new Date()),
    valid_until: Joi.date().optional(),
    notes: Joi.string().optional().max(500)
  }),

  // Update service pricing schema
  updateServicePricing: Joi.object({
    pricing_type: Joi.string().valid('fixed', 'hourly', 'daily', 'tiered').optional(),
    base_price: Joi.number().positive().optional(),
    currency: Joi.string().optional(),
    min_quantity: Joi.number().positive().optional(),
    max_quantity: Joi.number().positive().optional(),
    discount_percentage: Joi.number().min(0).max(100).optional(),
    is_active: Joi.boolean().optional(),
    valid_from: Joi.date().optional(),
    valid_until: Joi.date().optional(),
    notes: Joi.string().optional().max(500)
  }),

  // Get service pricing by ID schema
  getServicePricingById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get service pricing schema
  getServicePricing: Joi.object({
    service_id: Joi.string().required().uuid(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    is_active: Joi.boolean().optional()
  }),

  // Delete service pricing schema
  deleteServicePricing: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // === SERVICE TEMPLATES SCHEMAS ===

  // Create service template schema
  createServiceTemplate: Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().optional().max(500),
    category_id: Joi.string().required().uuid(),
    services: Joi.array().items(
      Joi.object({
        service_id: Joi.string().required().uuid(),
        quantity: Joi.number().positive().required(),
        unit_price: Joi.number().positive().required(),
        discount_percentage: Joi.number().min(0).max(100).default(0)
      })
    ).min(1).required(),
    is_active: Joi.boolean().default(true),
    notes: Joi.string().optional().max(1000)
  }),

  // Update service template schema
  updateServiceTemplate: Joi.object({
    name: Joi.string().optional().min(3).max(100),
    description: Joi.string().optional().max(500),
    category_id: Joi.string().optional().uuid(),
    services: Joi.array().items(
      Joi.object({
        service_id: Joi.string().required().uuid(),
        quantity: Joi.number().positive().required(),
        unit_price: Joi.number().positive().required(),
        discount_percentage: Joi.number().min(0).max(100).default(0)
      })
    ).optional(),
    is_active: Joi.boolean().optional(),
    notes: Joi.string().optional().max(1000)
  }),

  // Get service template by ID schema
  getServiceTemplateById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get service templates schema
  getServiceTemplates: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('name', 'created_at', 'updated_at').default('name'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
    category_id: Joi.string().optional().uuid(),
    is_active: Joi.boolean().optional()
  }),

  // Delete service template schema
  deleteServiceTemplate: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // === SERVICE STATISTICS SCHEMAS ===

  // Get service statistics schema
  getServiceStatistics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    category_id: Joi.string().optional().uuid(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional()
  }),

  // Get service category statistics schema
  getServiceCategoryStatistics: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month'),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional()
  })
};

module.exports = serviceSchemas;
