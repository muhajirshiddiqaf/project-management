// === PROJECT CRUD QUERIES ===

const findAll = `
  SELECT p.*,
         c.name as client_name,
         c.email as client_email,
         u.first_name || ' ' || u.last_name as assigned_to_name,
         creator.first_name || ' ' || creator.last_name as created_by_name
  FROM projects p
  LEFT JOIN clients c ON p.client_id = c.id
  LEFT JOIN users u ON p.assigned_to = u.id
  LEFT JOIN users creator ON p.created_by = creator.id
  WHERE p.organization_id = $1 AND p.is_active = true
    AND ($2::text IS NULL OR p.status = $2)
    AND ($3::text IS NULL OR p.priority = $3)
    AND ($4::text IS NULL OR p.category = $4)
    AND ($5::uuid IS NULL OR p.client_id = $5)
    AND ($6::uuid IS NULL OR p.assigned_to = $6)
    AND ($7::uuid IS NULL OR p.created_by = $7)
  ORDER BY p.${sortBy} ${sortOrder}
  LIMIT $8 OFFSET $9
`;

const countProjects = `
  SELECT COUNT(*) FROM projects
  WHERE organization_id = $1 AND is_active = true
    AND ($2::text IS NULL OR status = $2)
    AND ($3::text IS NULL OR priority = $3)
    AND ($4::text IS NULL OR category = $4)
    AND ($5::uuid IS NULL OR client_id = $5)
    AND ($6::uuid IS NULL OR assigned_to = $6)
    AND ($7::uuid IS NULL OR created_by = $7)
`;

const findProjectById = `
  SELECT p.*,
         c.name as client_name,
         c.email as client_email,
         u.first_name || ' ' || u.last_name as assigned_to_name,
         creator.first_name || ' ' || creator.last_name as created_by_name
  FROM projects p
  LEFT JOIN clients c ON p.client_id = c.id
  LEFT JOIN users u ON p.assigned_to = u.id
  LEFT JOIN users creator ON p.created_by = creator.id
  WHERE p.id = $1 AND p.organization_id = $2 AND p.is_active = true
`;

const createProject = `
  INSERT INTO projects (
    title, description, client_id, status, priority, category,
    start_date, end_date, budget, currency, assigned_to,
    tags, attachments, notes, organization_id, created_by
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
  RETURNING *
`;

const deleteProject = `
  UPDATE projects
  SET is_active = false, updated_at = NOW()
  WHERE id = $1 AND organization_id = $2 AND is_active = true
  RETURNING *
`;

const searchProjects = `
  SELECT p.*,
         c.name as client_name,
         c.email as client_email,
         u.first_name || ' ' || u.last_name as assigned_to_name,
         creator.first_name || ' ' || creator.last_name as created_by_name
  FROM projects p
  LEFT JOIN clients c ON p.client_id = c.id
  LEFT JOIN users u ON p.assigned_to = u.id
  LEFT JOIN users creator ON p.created_by = creator.id
  WHERE p.organization_id = $1 AND p.is_active = true
    AND (
      p.title ILIKE $2 OR
      p.description ILIKE $2 OR
      c.name ILIKE $2 OR
      c.email ILIKE $2
    )
  ORDER BY p.${sortBy} ${sortOrder}
  LIMIT $3 OFFSET $4
`;

const countSearchProjects = `
  SELECT COUNT(*) FROM projects p
  LEFT JOIN clients c ON p.client_id = c.id
  WHERE p.organization_id = $1 AND p.is_active = true
    AND (
      p.title ILIKE $2 OR
      p.description ILIKE $2 OR
      c.name ILIKE $2 OR
      c.email ILIKE $2
    )
`;

const updateProjectStatus = `
  UPDATE projects
  SET status = $3, notes = $4, updated_at = NOW()
  WHERE id = $1 AND organization_id = $2 AND is_active = true
  RETURNING *
`;

const assignProject = `
  UPDATE projects
  SET assigned_to = $3, updated_at = NOW()
  WHERE id = $1 AND organization_id = $2 AND is_active = true
  RETURNING *
`;

// === PROJECT COST CALCULATION QUERIES ===

const createProjectCostCalculation = `
  INSERT INTO project_cost_calculations (
    project_id, services, materials, services_cost, materials_cost,
    subtotal, overhead_percentage, overhead_amount, subtotal_with_overhead,
    profit_margin_percentage, profit_amount, subtotal_with_profit,
    discount_percentage, discount_amount, subtotal_after_discount,
    tax_rate, tax_amount, grand_total, organization_id
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
  RETURNING *
`;

const getProjectCostBreakdown = `
  SELECT * FROM project_cost_calculations
  WHERE project_id = $1 AND organization_id = $2 AND is_active = true
  ORDER BY created_at DESC
  LIMIT 1
`;

// === PROJECT TEAM MANAGEMENT QUERIES ===

const assignTeamMember = `
  INSERT INTO project_team_members (
    project_id, user_id, role, hourly_rate, start_date, end_date, organization_id
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  ON CONFLICT (project_id, user_id) DO UPDATE SET
    role = EXCLUDED.role,
    hourly_rate = EXCLUDED.hourly_rate,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = NOW()
  RETURNING *
`;

const getProjectTeam = `
  SELECT ptm.*,
         u.first_name || ' ' || u.last_name as user_name,
         u.email as user_email
  FROM project_team_members ptm
  JOIN users u ON ptm.user_id = u.id
  WHERE ptm.project_id = $1 AND ptm.organization_id = $2 AND ptm.is_active = true
  ORDER BY ptm.created_at DESC
`;

const updateTeamMemberRole = `
  UPDATE project_team_members
  SET role = $4, hourly_rate = $5, start_date = $6, end_date = $7, updated_at = NOW()
  WHERE project_id = $1 AND user_id = $2 AND organization_id = $3 AND is_active = true
  RETURNING *
`;

const removeTeamMember = `
  UPDATE project_team_members
  SET is_active = false, updated_at = NOW()
  WHERE project_id = $1 AND user_id = $2 AND organization_id = $3 AND is_active = true
  RETURNING *
`;

// === PROJECT TIMELINE & MILESTONES QUERIES ===

const createMilestone = `
  INSERT INTO project_milestones (
    project_id, title, description, due_date, status, priority,
    assigned_to, dependencies, organization_id
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING *
`;

const getProjectMilestones = `
  SELECT pm.*,
         u.first_name || ' ' || u.last_name as assigned_to_name
  FROM project_milestones pm
  LEFT JOIN users u ON pm.assigned_to = u.id
  WHERE pm.project_id = $1 AND pm.organization_id = $2 AND pm.is_active = true
    AND ($3::text IS NULL OR pm.status = $3)
  ORDER BY pm.due_date ASC
  LIMIT $4 OFFSET $5
`;

const countProjectMilestones = `
  SELECT COUNT(*) FROM project_milestones
  WHERE project_id = $1 AND organization_id = $2 AND is_active = true
    AND ($3::text IS NULL OR status = $3)
`;

const findMilestoneById = `
  SELECT pm.*,
         u.first_name || ' ' || u.last_name as assigned_to_name
  FROM project_milestones pm
  LEFT JOIN users u ON pm.assigned_to = u.id
  WHERE pm.id = $1 AND pm.organization_id = $2 AND pm.is_active = true
`;

const deleteMilestone = `
  UPDATE project_milestones
  SET is_active = false, updated_at = NOW()
  WHERE id = $1 AND organization_id = $2 AND is_active = true
  RETURNING *
`;

const updateMilestoneStatus = `
  UPDATE project_milestones
  SET status = $3, completion_notes = $4, updated_at = NOW()
  WHERE id = $1 AND organization_id = $2 AND is_active = true
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
  WHERE organization_id = $1 AND is_active = true
`;

const getProjectCostStatistics = `
  SELECT
    COUNT(*) as total_calculations,
    AVG(services_cost) as avg_services_cost,
    AVG(materials_cost) as avg_materials_cost,
    AVG(subtotal) as avg_subtotal,
    AVG(overhead_percentage) as avg_overhead_percentage,
    AVG(profit_margin_percentage) as avg_profit_margin,
    AVG(tax_rate) as avg_tax_rate,
    AVG(discount_percentage) as avg_discount_percentage,
    AVG(grand_total) as avg_grand_total,
    SUM(grand_total) as total_grand_total
  FROM project_cost_calculations
  WHERE project_id = $1 AND organization_id = $2 AND is_active = true
`;

module.exports = {
  // Project CRUD
  findAll,
  countProjects,
  findProjectById,
  createProject,
  deleteProject,
  searchProjects,
  countSearchProjects,
  updateProjectStatus,
  assignProject,

  // Project Cost Calculation
  createProjectCostCalculation,
  getProjectCostBreakdown,

  // Project Team Management
  assignTeamMember,
  getProjectTeam,
  updateTeamMemberRole,
  removeTeamMember,

  // Project Milestones
  createMilestone,
  getProjectMilestones,
  countProjectMilestones,
  findMilestoneById,
  deleteMilestone,
  updateMilestoneStatus,

  // Project Statistics
  getProjectStatistics,
  getProjectCostStatistics
};
