const Joi = require('@hapi/joi');

// Project validation schemas
const projectSchemas = {
  // Create project schema
  createProject: Joi.object({
    name: Joi.string().required().min(3).max(200),
    description: Joi.string().optional().max(2000),
    client_id: Joi.string().required().uuid(),
    status: Joi.string().valid('draft', 'active', 'completed', 'cancelled', 'on_hold').default('draft'),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
    category: Joi.string().valid('web_development', 'mobile_development', 'design', 'consulting', 'maintenance', 'other').optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    budget: Joi.number().positive().optional(),
    currency: Joi.string().default('IDR'),
    assigned_to: Joi.string().optional().uuid().allow('', null),
    tags: Joi.array().items(Joi.string()).optional(),
    attachments: Joi.array().items(Joi.string()).optional(),
    notes: Joi.string().optional().max(1000)
  }),

  // Update project schema
  updateProject: Joi.object({
    name: Joi.string().optional().min(3).max(200),
    description: Joi.string().optional().max(2000),
    client_id: Joi.string().optional().uuid(),
    status: Joi.string().valid('draft', 'active', 'completed', 'cancelled', 'on_hold').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    category: Joi.string().valid('web_development', 'mobile_development', 'design', 'consulting', 'maintenance', 'other').optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    budget: Joi.number().positive().optional(),
    currency: Joi.string().optional(),
    assigned_to: Joi.string().optional().uuid().allow('', null),
    tags: Joi.array().items(Joi.string()).optional(),
    attachments: Joi.array().items(Joi.string()).optional(),
    notes: Joi.string().optional().max(1000)
  }),

  // Get project by ID schema
  getProjectById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get projects schema
  getProjects: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('created_at', 'updated_at', 'name', 'status', 'priority', 'start_date', 'end_date').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    status: Joi.string().valid('draft', 'active', 'completed', 'cancelled', 'on_hold').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    category: Joi.string().valid('web_development', 'mobile_development', 'design', 'consulting', 'maintenance', 'other').optional(),
    client_id: Joi.string().optional().uuid(),
    assigned_to: Joi.string().optional().uuid(),
    created_by: Joi.string().optional().uuid()
  }),

  // Search projects schema
  searchProjects: Joi.object({
    q: Joi.string().optional().max(100),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('created_at', 'updated_at', 'name', 'status', 'priority', 'start_date', 'end_date').default('created_at'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // Delete project schema
  deleteProject: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Update project status schema
  updateProjectStatus: Joi.object({
    status: Joi.string().valid('draft', 'active', 'completed', 'cancelled', 'on_hold').required(),
    notes: Joi.string().optional().max(1000)
  }),

  // Assign project schema
  assignProject: Joi.object({
    assigned_to: Joi.string().required().uuid()
  }),

  // === PROJECT COST CALCULATION SCHEMAS ===

  // Calculate project cost schema
  calculateProjectCost: Joi.object({
    project_id: Joi.string().required().uuid(),
    services: Joi.array().items(
      Joi.object({
        service_id: Joi.string().required().uuid(),
        quantity: Joi.number().positive().required(),
        unit_price: Joi.number().positive().required(),
        unit_type: Joi.string().valid('hour', 'day', 'piece', 'service').required()
      })
    ).min(1).required(),
    materials: Joi.array().items(
      Joi.object({
        name: Joi.string().required().min(2).max(100),
        quantity: Joi.number().positive().required(),
        unit_price: Joi.number().positive().required(),
        unit_type: Joi.string().valid('piece', 'meter', 'kg', 'liter').required()
      })
    ).optional(),
    labor_costs: Joi.array().items(
      Joi.object({
        role: Joi.string().required().min(2).max(100),
        hours: Joi.number().positive().required(),
        rate_per_hour: Joi.number().positive().required()
      })
    ).optional(),
    overhead_costs: Joi.number().positive().optional(),
    profit_margin: Joi.number().positive().optional()
  }),

  // Get project cost breakdown schema
  getProjectCostBreakdown: Joi.object({
    project_id: Joi.string().required().uuid()
  }),

  // Update project cost schema
  updateProjectCost: Joi.object({
    project_id: Joi.string().required().uuid(),
    actual_cost: Joi.number().positive().required(),
    notes: Joi.string().optional().max(1000)
  }),

  // === PROJECT TEAM MANAGEMENT SCHEMAS ===

  // Add team member schema
  addTeamMember: Joi.object({
    user_id: Joi.string().required().uuid(),
    role: Joi.string().required().min(2).max(100),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    hourly_rate: Joi.number().positive().optional(),
    notes: Joi.string().optional().max(1000)
  }),

  // Update team member schema
  updateTeamMember: Joi.object({
    role: Joi.string().optional().min(2).max(100),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    hourly_rate: Joi.number().positive().optional(),
    notes: Joi.string().optional().max(1000)
  }),

  // === PROJECT TIMELINE SCHEMAS ===

  // Add timeline event schema
  addTimelineEvent: Joi.object({
    event_type: Joi.string().valid('milestone', 'task', 'meeting', 'delivery', 'other').required(),
    title: Joi.string().required().min(2).max(200),
    description: Joi.string().optional().max(1000),
    event_date: Joi.date().required(),
    assigned_to: Joi.string().optional().uuid(),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').default('pending'),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium')
  }),

  // Update timeline event schema
  updateTimelineEvent: Joi.object({
    event_type: Joi.string().valid('milestone', 'task', 'meeting', 'delivery', 'other').optional(),
    title: Joi.string().optional().min(2).max(200),
    description: Joi.string().optional().max(1000),
    event_date: Joi.date().optional(),
    assigned_to: Joi.string().optional().uuid(),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional()
  }),

  // === PROJECT FILE MANAGEMENT SCHEMAS ===

  // Upload project file schema
  uploadProjectFile: Joi.object({
    file_type: Joi.string().valid('document', 'image', 'video', 'audio', 'other').required(),
    description: Joi.string().optional().max(500),
    tags: Joi.array().items(Joi.string()).optional()
  }),

  // Update project file schema
  updateProjectFile: Joi.object({
    description: Joi.string().optional().max(500),
    tags: Joi.array().items(Joi.string()).optional()
  })
};

module.exports = projectSchemas;
