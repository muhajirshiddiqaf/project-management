// === PROJECT CRUD QUERIES ===

const findAll = `
  SELECT p.*,
         c.name as client_name,
         c.email as client_email,
         u.first_name || ' ' || u.last_name as assigned_to_name
  FROM projects p
  LEFT JOIN clients c ON p.client_id = c.id
  LEFT JOIN users u ON p.assigned_to = u.id
  WHERE p.organization_id = $1
    AND ($2::text IS NULL OR p.status = $2)
    AND ($3::text IS NULL OR p.priority = $3)
    AND ($4::text IS NULL OR p.category = $4)
    AND ($5::uuid IS NULL OR p.client_id = $5)
    AND ($6::uuid IS NULL OR p.assigned_to = $6)
  ORDER BY p.created_at DESC
  LIMIT $7 OFFSET $8
`;

const countProjects = `
  SELECT COUNT(*) FROM projects
  WHERE organization_id = $1
    AND ($2::text IS NULL OR status = $2)
    AND ($3::text IS NULL OR priority = $3)
    AND ($4::text IS NULL OR category = $4)
    AND ($5::uuid IS NULL OR client_id = $5)
    AND ($6::uuid IS NULL OR assigned_to = $6)
`;

const findProjectById = `
  SELECT p.*,
         c.name as client_name,
         c.email as client_email,
         u.first_name || ' ' || u.last_name as assigned_to_name
  FROM projects p
  LEFT JOIN clients c ON p.client_id = c.id
  LEFT JOIN users u ON p.assigned_to = u.id
  WHERE p.id = $1 AND p.organization_id = $2
`;

const createProject = `
  INSERT INTO projects (
    name, description, client_id, status, priority, category,
    start_date, end_date, budget, currency, assigned_to, tags, notes, organization_id
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *
`;

const updateProject = `
  UPDATE projects
  SET name = $3, description = $4, client_id = $5, status = $6, priority = $7, category = $8,
      start_date = $9, end_date = $10, budget = $11, currency = $12, assigned_to = $13, tags = $14, notes = $15,
      updated_at = NOW()
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

const deleteProject = `
  DELETE FROM projects
  WHERE id = $1 AND organization_id = $2
`;

const searchProjects = `
  SELECT p.*,
         c.name as client_name,
         c.email as client_email,
         u.first_name || ' ' || u.last_name as assigned_to_name
  FROM projects p
  LEFT JOIN clients c ON p.client_id = c.id
  LEFT JOIN users u ON p.assigned_to = u.id
  WHERE p.organization_id = $1
    AND (
      p.name ILIKE $2 OR
      p.description ILIKE $2 OR
      c.name ILIKE $2 OR
      c.email ILIKE $2
    )
  ORDER BY p.created_at DESC
  LIMIT $3 OFFSET $4
`;

const countSearchProjects = `
  SELECT COUNT(*) FROM projects p
  LEFT JOIN clients c ON p.client_id = c.id
  WHERE p.organization_id = $1
    AND (
      p.name ILIKE $2 OR
      p.description ILIKE $2 OR
      c.name ILIKE $2 OR
      c.email ILIKE $2
    )
`;

const updateProjectStatus = `
  UPDATE projects
  SET status = $3, updated_at = NOW()
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

const assignProject = `
  UPDATE projects
  SET assigned_to = $3, updated_at = NOW()
  WHERE id = $1 AND organization_id = $2
  RETURNING *
`;

// === PROJECT COST CALCULATION QUERIES ===

const createProjectCostCalculation = `
  INSERT INTO project_cost_calculations (
    project_id, labor_cost, material_cost, overhead_cost, profit_margin,
    profit_amount, tax_rate, tax_amount, discount_rate, discount_amount,
    total_cost, final_price, currency, notes, created_by
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
  RETURNING *
`;

const getProjectCostBreakdown = `
  SELECT * FROM project_cost_calculations
  WHERE project_id = $1
  ORDER BY created_at DESC
  LIMIT 1
`;

// === PROJECT TASKS QUERIES ===

const createProjectTask = `
  INSERT INTO project_tasks (
    project_id, name, description, estimated_hours, hourly_rate,
    assigned_to, status, priority, start_date, end_date
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *
`;

const getProjectTasks = `
  SELECT pt.*,
         u.first_name || ' ' || u.last_name as assigned_to_name
  FROM project_tasks pt
  LEFT JOIN users u ON pt.assigned_to = u.id
  WHERE pt.project_id = $1
    AND ($2::text IS NULL OR pt.status = $2)
  ORDER BY pt.start_date ASC
  LIMIT $3 OFFSET $4
`;

const findTaskById = `
  SELECT pt.*,
         u.first_name || ' ' || u.last_name as assigned_to_name
  FROM project_tasks pt
  LEFT JOIN users u ON pt.assigned_to = u.id
  WHERE pt.id = $1
`;

const updateProjectTask = `
  UPDATE project_tasks
  SET name = $3, description = $4, estimated_hours = $5, actual_hours = $6,
      hourly_rate = $7, total_cost = $8, assigned_to = $9, status = $10,
      priority = $11, start_date = $12, end_date = $13, updated_at = NOW()
  WHERE id = $1 AND project_id = $2
  RETURNING *
`;

const deleteProjectTask = `
  DELETE FROM project_tasks
  WHERE id = $1 AND project_id = $2
`;

const updateTaskStatus = `
  UPDATE project_tasks
  SET status = $3, updated_at = NOW()
  WHERE id = $1 AND project_id = $2
  RETURNING *
`;

// === PROJECT STATISTICS QUERIES ===

const getProjectStatistics = `
  SELECT
    COUNT(*) as total_projects,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_projects,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_projects,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_projects,
    COUNT(CASE WHEN status = 'on_hold' THEN 1 END) as on_hold_projects,
    COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_projects,
    COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_projects,
    COUNT(CASE WHEN priority = 'medium' THEN 1 END) as medium_priority_projects,
    COUNT(CASE WHEN priority = 'low' THEN 1 END) as low_priority_projects,
    AVG(CASE WHEN budget IS NOT NULL THEN budget END) as avg_budget,
    SUM(CASE WHEN budget IS NOT NULL THEN budget END) as total_budget
  FROM projects
  WHERE organization_id = $1
`;

const getProjectCostStatistics = `
  SELECT
    COUNT(*) as total_calculations,
    AVG(labor_cost) as avg_labor_cost,
    AVG(material_cost) as avg_material_cost,
    AVG(overhead_cost) as avg_overhead_cost,
    AVG(profit_margin) as avg_profit_margin,
    AVG(tax_rate) as avg_tax_rate,
    AVG(discount_rate) as avg_discount_rate,
    AVG(total_cost) as avg_total_cost,
    AVG(final_price) as avg_final_price,
    SUM(final_price) as total_final_price
  FROM project_cost_calculations
  WHERE project_id = $1
`;

module.exports = {
  // Project CRUD
  findAll,
  countProjects,
  findProjectById,
  createProject,
  updateProject,
  deleteProject,
  searchProjects,
  countSearchProjects,
  updateProjectStatus,
  assignProject,

  // Project Cost Calculation
  createProjectCostCalculation,
  getProjectCostBreakdown,

  // Project Tasks
  createProjectTask,
  getProjectTasks,
  findTaskById,
  updateProjectTask,
  deleteProjectTask,
  updateTaskStatus,

  // Project Statistics
  getProjectStatistics,
  getProjectCostStatistics
};
