// Project module database queries
const projectQueries = {
  // Find project by ID
  findProjectById: `
    SELECT p.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM projects p
    LEFT JOIN clients c ON p.client_id = c.id
    LEFT JOIN users u ON p.created_by = u.id
    WHERE p.id = $1 AND p.organization_id = $2 AND p.is_active = true
  `,

  // Find projects by organization
  findProjectsByOrganization: `
    SELECT p.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM projects p
    LEFT JOIN clients c ON p.client_id = c.id
    LEFT JOIN users u ON p.created_by = u.id
    WHERE p.organization_id = $1 AND p.is_active = true
    ORDER BY p.created_at DESC
  `,

  // Create project
  createProject: `
    INSERT INTO projects (id, organization_id, client_id, name, description, status,
                        start_date, end_date, budget, actual_cost, progress_percentage, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
  `,

  // Update project
  updateProject: `
    UPDATE projects
    SET name = COALESCE($1, name),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        start_date = COALESCE($4, start_date),
        end_date = COALESCE($5, end_date),
        budget = COALESCE($6, budget),
        actual_cost = COALESCE($7, actual_cost),
        progress_percentage = COALESCE($8, progress_percentage),
        updated_at = NOW()
    WHERE id = $9 AND organization_id = $10
    RETURNING *
  `,

  // Delete project (soft delete)
  deleteProject: `
    UPDATE projects
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get project statistics
  getProjectStatistics: `
    SELECT
      COUNT(*) as total_projects,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_projects,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects,
      COUNT(CASE WHEN status = 'on_hold' THEN 1 END) as on_hold_projects,
      COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_projects,
      AVG(progress_percentage) as avg_progress,
      SUM(budget) as total_budget,
      SUM(actual_cost) as total_actual_cost,
      AVG(EXTRACT(EPOCH FROM (end_date - start_date))/86400) as avg_duration_days
    FROM projects
    WHERE organization_id = $1 AND is_active = true
  `,

  // Search projects
  searchProjects: `
    SELECT p.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM projects p
    LEFT JOIN clients c ON p.client_id = c.id
    LEFT JOIN users u ON p.created_by = u.id
    WHERE p.organization_id = $1 AND p.is_active = true
    AND (
      LOWER(p.name) LIKE LOWER($2) OR
      LOWER(p.description) LIKE LOWER($2) OR
      LOWER(c.name) LIKE LOWER($2)
    )
    ORDER BY p.created_at DESC
  `,

  // Get projects by status
  getProjectsByStatus: `
    SELECT p.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM projects p
    LEFT JOIN clients c ON p.client_id = c.id
    LEFT JOIN users u ON p.created_by = u.id
    WHERE p.organization_id = $1 AND p.status = $2 AND p.is_active = true
    ORDER BY p.created_at DESC
  `,

  // Get projects by client
  getProjectsByClient: `
    SELECT p.*, c.name as client_name, c.email as client_email,
           u.first_name || ' ' || u.last_name as created_by_name
    FROM projects p
    LEFT JOIN clients c ON p.client_id = c.id
    LEFT JOIN users u ON p.created_by = u.id
    WHERE p.organization_id = $1 AND p.client_id = $2 AND p.is_active = true
    ORDER BY p.created_at DESC
  `,

  // Get project tasks
  getProjectTasks: `
    SELECT * FROM project_tasks
    WHERE project_id = $1 AND organization_id = $2 AND is_active = true
    ORDER BY created_at ASC
  `,

  // Create project task
  createProjectTask: `
    INSERT INTO project_tasks (id, organization_id, project_id, name, description,
                              estimated_hours, actual_hours, status, assigned_to)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `,

  // Update project task
  updateProjectTask: `
    UPDATE project_tasks
    SET name = COALESCE($1, name),
        description = COALESCE($2, description),
        estimated_hours = COALESCE($3, estimated_hours),
        actual_hours = COALESCE($4, actual_hours),
        status = COALESCE($5, status),
        assigned_to = COALESCE($6, assigned_to),
        updated_at = NOW()
    WHERE id = $7 AND organization_id = $8
    RETURNING *
  `,

  // Delete project task
  deleteProjectTask: `
    UPDATE project_tasks
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get project materials
  getProjectMaterials: `
    SELECT pm.*, m.name as material_name, m.unit_price, m.unit_type
    FROM project_materials pm
    JOIN materials m ON pm.material_id = m.id
    WHERE pm.project_id = $1 AND pm.organization_id = $2 AND pm.is_active = true
    ORDER BY pm.created_at ASC
  `,

  // Create project material
  createProjectMaterial: `
    INSERT INTO project_materials (id, organization_id, project_id, material_id, quantity, unit_price)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `,

  // Update project material
  updateProjectMaterial: `
    UPDATE project_materials
    SET quantity = COALESCE($1, quantity),
        unit_price = COALESCE($2, unit_price),
        updated_at = NOW()
    WHERE id = $3 AND organization_id = $4
    RETURNING *
  `,

  // Delete project material
  deleteProjectMaterial: `
    UPDATE project_materials
    SET is_active = false, updated_at = NOW()
    WHERE id = $1 AND organization_id = $2
  `,

  // Get project cost calculation
  getProjectCostCalculation: `
    SELECT * FROM project_cost_calculations
    WHERE project_id = $1 AND organization_id = $2 AND is_active = true
    ORDER BY created_at DESC
    LIMIT 1
  `,

  // Create project cost calculation
  createProjectCostCalculation: `
    INSERT INTO project_cost_calculations (id, organization_id, project_id, labor_cost, material_cost,
                                         overhead_cost, profit_margin, total_cost, pricing_strategy)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `,

  // Update project cost calculation
  updateProjectCostCalculation: `
    UPDATE project_cost_calculations
    SET labor_cost = COALESCE($1, labor_cost),
        material_cost = COALESCE($2, material_cost),
        overhead_cost = COALESCE($3, overhead_cost),
        profit_margin = COALESCE($4, profit_margin),
        total_cost = COALESCE($5, total_cost),
        pricing_strategy = COALESCE($6, pricing_strategy),
        updated_at = NOW()
    WHERE id = $7 AND organization_id = $8
    RETURNING *
  `,

  // Get project dashboard data
  getProjectDashboardData: `
    SELECT
      p.id,
      p.name,
      p.status,
      p.progress_percentage,
      p.budget,
      p.actual_cost,
      p.start_date,
      p.end_date,
      c.name as client_name,
      u.first_name || ' ' || u.last_name as created_by_name,
      COUNT(pt.id) as total_tasks,
      COUNT(CASE WHEN pt.status = 'completed' THEN 1 END) as completed_tasks,
      SUM(pt.estimated_hours) as total_estimated_hours,
      SUM(pt.actual_hours) as total_actual_hours
    FROM projects p
    LEFT JOIN clients c ON p.client_id = c.id
    LEFT JOIN users u ON p.created_by = u.id
    LEFT JOIN project_tasks pt ON p.id = pt.project_id AND pt.is_active = true
    WHERE p.organization_id = $1 AND p.is_active = true
    GROUP BY p.id, p.name, p.status, p.progress_percentage, p.budget, p.actual_cost,
             p.start_date, p.end_date, c.name, u.first_name, u.last_name
    ORDER BY p.created_at DESC
  `,

  // Get project timeline
  getProjectTimeline: `
    SELECT
      'task' as type,
      pt.id,
      pt.name as title,
      pt.created_at as date,
      pt.status,
      u.first_name || ' ' || u.last_name as assigned_to_name
    FROM project_tasks pt
    LEFT JOIN users u ON pt.assigned_to = u.id
    WHERE pt.project_id = $1 AND pt.organization_id = $2 AND pt.is_active = true

    UNION ALL

    SELECT
      'material' as type,
      pm.id,
      m.name as title,
      pm.created_at as date,
      'added' as status,
      NULL as assigned_to_name
    FROM project_materials pm
    JOIN materials m ON pm.material_id = m.id
    WHERE pm.project_id = $1 AND pm.organization_id = $2 AND pm.is_active = true

    ORDER BY date DESC
  `
};

module.exports = projectQueries;
