const Joi = require('@hapi/joi');

// Project validation schemas
const projectSchemas = {
  // Create project schema
  createProject: Joi.object({
    title: Joi.string().required().min(3).max(200),
    description: Joi.string().optional().max(2000),
    client_id: Joi.string().required().uuid(),
    status: Joi.string().valid('draft', 'active', 'completed', 'cancelled', 'on_hold').default('draft'),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
    category: Joi.string().valid('web_development', 'mobile_development', 'design', 'consulting', 'maintenance', 'other').required(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    budget: Joi.number().positive().optional(),
    currency: Joi.string().default('IDR'),
    assigned_to: Joi.string().optional().uuid(),
    tags: Joi.array().items(Joi.string()).optional(),
    attachments: Joi.array().items(Joi.string()).optional(),
    notes: Joi.string().optional().max(1000)
  }),

  // Update project schema
  updateProject: Joi.object({
    title: Joi.string().optional().min(3).max(200),
    description: Joi.string().optional().max(2000),
    client_id: Joi.string().optional().uuid(),
    status: Joi.string().valid('draft', 'active', 'completed', 'cancelled', 'on_hold').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    category: Joi.string().valid('web_development', 'mobile_development', 'design', 'consulting', 'maintenance', 'other').optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    budget: Joi.number().positive().optional(),
    currency: Joi.string().optional(),
    assigned_to: Joi.string().optional().uuid(),
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
    sortBy: Joi.string().valid('created_at', 'updated_at', 'title', 'status', 'priority', 'start_date', 'end_date').default('created_at'),
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
    sortBy: Joi.string().valid('created_at', 'updated_at', 'title', 'status', 'priority', 'start_date', 'end_date').default('created_at'),
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
    overhead_percentage: Joi.number().min(0).max(100).default(10),
    profit_margin_percentage: Joi.number().min(0).max(100).default(20),
    tax_rate: Joi.number().min(0).max(100).default(11),
    discount_percentage: Joi.number().min(0).max(100).default(0)
  }),

  // Get project cost breakdown schema
  getProjectCostBreakdown: Joi.object({
    project_id: Joi.string().required().uuid()
  }),

  // Update project cost calculation schema
  updateProjectCostCalculation: Joi.object({
    calculation_id: Joi.string().required().uuid(),
    services: Joi.array().items(
      Joi.object({
        service_id: Joi.string().required().uuid(),
        quantity: Joi.number().positive().required(),
        unit_price: Joi.number().positive().required(),
        unit_type: Joi.string().valid('hour', 'day', 'piece', 'service').required()
      })
    ).optional(),
    materials: Joi.array().items(
      Joi.object({
        name: Joi.string().required().min(2).max(100),
        quantity: Joi.number().positive().required(),
        unit_price: Joi.number().positive().required(),
        unit_type: Joi.string().valid('piece', 'meter', 'kg', 'liter').required()
      })
    ).optional(),
    overhead_percentage: Joi.number().min(0).max(100).optional(),
    profit_margin_percentage: Joi.number().min(0).max(100).optional(),
    tax_rate: Joi.number().min(0).max(100).optional(),
    discount_percentage: Joi.number().min(0).max(100).optional()
  }),

  // === PROJECT TEAM MANAGEMENT SCHEMAS ===

  // Assign team to project schema
  assignTeamToProject: Joi.object({
    project_id: Joi.string().required().uuid(),
    team_members: Joi.array().items(
      Joi.object({
        user_id: Joi.string().required().uuid(),
        role: Joi.string().valid('project_manager', 'developer', 'designer', 'tester', 'analyst', 'consultant').required(),
        hourly_rate: Joi.number().positive().optional(),
        start_date: Joi.date().optional(),
        end_date: Joi.date().optional()
      })
    ).min(1).required()
  }),

  // Get project team schema
  getProjectTeam: Joi.object({
    project_id: Joi.string().required().uuid()
  }),

  // Update team member role schema
  updateTeamMemberRole: Joi.object({
    project_id: Joi.string().required().uuid(),
    user_id: Joi.string().required().uuid(),
    role: Joi.string().valid('project_manager', 'developer', 'designer', 'tester', 'analyst', 'consultant').required(),
    hourly_rate: Joi.number().positive().optional(),
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional()
  }),

  // Remove team member schema
  removeTeamMember: Joi.object({
    project_id: Joi.string().required().uuid(),
    user_id: Joi.string().required().uuid()
  }),

  // === PROJECT TIMELINE & MILESTONES SCHEMAS ===

  // Create milestone schema
  createMilestone: Joi.object({
    project_id: Joi.string().required().uuid(),
    title: Joi.string().required().min(3).max(200),
    description: Joi.string().optional().max(1000),
    due_date: Joi.date().required(),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'overdue').default('pending'),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
    assigned_to: Joi.string().optional().uuid(),
    dependencies: Joi.array().items(Joi.string().uuid()).optional()
  }),

  // Update milestone schema
  updateMilestone: Joi.object({
    title: Joi.string().optional().min(3).max(200),
    description: Joi.string().optional().max(1000),
    due_date: Joi.date().optional(),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'overdue').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    assigned_to: Joi.string().optional().uuid(),
    dependencies: Joi.array().items(Joi.string().uuid()).optional()
  }),

  // Get milestone by ID schema
  getMilestoneById: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Get project milestones schema
  getProjectMilestones: Joi.object({
    project_id: Joi.string().required().uuid(),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'overdue').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10)
  }),

  // Delete milestone schema
  deleteMilestone: Joi.object({
    id: Joi.string().required().uuid()
  }),

  // Update milestone status schema
  updateMilestoneStatus: Joi.object({
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'overdue').required(),
    completion_notes: Joi.string().optional().max(1000)
  }),

  // === PROJECT STATISTICS SCHEMAS ===

  // Get project statistics schema
  getProjectStatistics: Joi.object({
    organization_id: Joi.string().required().uuid()
  }),

  // Get project cost statistics schema
  getProjectCostStatistics: Joi.object({
    project_id: Joi.string().required().uuid()
  })
};

module.exports = projectSchemas;
