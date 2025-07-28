const { queries } = require('../database/queries');

class ProjectRepository {
  constructor(db) {
    this.db = db;
  }

  // === PROJECT CRUD METHODS ===

  // Find all projects
  async findAll(organizationId, options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      client_id,
      assigned_to
    } = options;

    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.project.findAll, [
        organizationId,
        status,
        priority,
        client_id,
        assigned_to,
        limit,
        offset
      ]);

      const countResult = await this.db.query(queries.project.countProjects, [
        organizationId,
        status,
        priority,
        client_id,
        assigned_to
      ]);

      return {
        projects: result.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: parseInt(countResult.rows[0].count, 10),
          totalPages: Math.ceil(parseInt(countResult.rows[0].count, 10) / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Find project by ID
  async findById(id, organizationId) {
    try {
      const result = await this.db.query(queries.project.findProjectById, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create project
  async create(projectData) {
    try {
      const result = await this.db.query(queries.project.createProject, [
        projectData.name,
        projectData.description,
        projectData.client_id,
        projectData.status,
        projectData.priority,
        projectData.start_date,
        projectData.end_date,
        projectData.budget,
        projectData.assigned_to,
        projectData.organization_id
      ]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update project
  async update(id, organizationId, updateData) {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      // Build dynamic update query
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(updateData[key]);
          paramIndex++;
        }
      });

      if (setClause.length === 0) {
        return null;
      }

      values.push(new Date(), organizationId, id);
      const query = `
        UPDATE projects
        SET ${setClause.join(', ')}, updated_at = $${paramIndex}
        WHERE organization_id = $${paramIndex + 1} AND id = $${paramIndex + 2}
        RETURNING *
      `;

      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Delete project
  async delete(id, organizationId) {
    try {
      const result = await this.db.query(queries.project.deleteProject, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Search projects
  async search(organizationId, searchTerm, options = {}) {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.project.searchProjects, [
        organizationId,
        searchTerm,
        limit,
        offset
      ]);

      const countResult = await this.db.query(queries.project.countSearchProjects, [
        organizationId,
        searchTerm
      ]);

      return {
        projects: result.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: parseInt(countResult.rows[0].count, 10),
          totalPages: Math.ceil(parseInt(countResult.rows[0].count, 10) / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Update project status
  async updateStatus(id, organizationId, status) {
    try {
      const result = await this.db.query(queries.project.updateProjectStatus, [
        id,
        organizationId,
        status
      ]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Assign project
  async assign(id, organizationId, assignedTo) {
    try {
      const result = await this.db.query(queries.project.assignProject, [
        id,
        organizationId,
        assignedTo
      ]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // === PROJECT COST CALCULATION METHODS ===

  // Calculate project cost
  async calculateCost(costData) {
    try {
      const {
        project_id,
        labor_cost = 0,
        material_cost = 0,
        overhead_cost = 0,
        profit_margin = 0,
        tax_rate = 0,
        discount_rate = 0,
        currency = 'USD',
        notes,
        created_by
      } = costData;

      // Calculate totals
      const total_cost = labor_cost + material_cost + overhead_cost;
      const profit_amount = (total_cost * profit_margin) / 100;
      const discount_amount = (total_cost * discount_rate) / 100;
      const tax_amount = (total_cost * tax_rate) / 100;
      const final_price = total_cost + profit_amount - discount_amount + tax_amount;

      // Save calculation to database
      const result = await this.db.query(queries.project.createProjectCostCalculation, [
        project_id,
        labor_cost,
        material_cost,
        overhead_cost,
        profit_margin,
        profit_amount,
        tax_rate,
        tax_amount,
        discount_rate,
        discount_amount,
        total_cost,
        final_price,
        currency,
        notes,
        created_by
      ]);

      return {
        calculation_id: result.rows[0].id,
        project_id,
        labor_cost,
        material_cost,
        overhead_cost,
        profit_margin,
        profit_amount,
        tax_rate,
        tax_amount,
        discount_rate,
        discount_amount,
        total_cost,
        final_price,
        currency,
        notes
      };
    } catch (error) {
      throw error;
    }
  }

  // Get project cost breakdown
  async getCostBreakdown(projectId) {
    try {
      const result = await this.db.query(queries.project.getProjectCostBreakdown, [
        projectId
      ]);

      if (result.rows.length === 0) {
        return null;
      }

      const calculation = result.rows[0];
      return {
        calculation_id: calculation.id,
        project_id: calculation.project_id,
        labor_cost: parseFloat(calculation.labor_cost),
        material_cost: parseFloat(calculation.material_cost),
        overhead_cost: parseFloat(calculation.overhead_cost),
        profit_margin: parseFloat(calculation.profit_margin),
        profit_amount: parseFloat(calculation.profit_amount),
        tax_rate: parseFloat(calculation.tax_rate),
        tax_amount: parseFloat(calculation.tax_amount),
        discount_rate: parseFloat(calculation.discount_rate),
        discount_amount: parseFloat(calculation.discount_amount),
        total_cost: parseFloat(calculation.total_cost),
        final_price: parseFloat(calculation.final_price),
        currency: calculation.currency,
        notes: calculation.notes,
        created_at: calculation.created_at,
        updated_at: calculation.updated_at
      };
    } catch (error) {
      throw error;
    }
  }

  // Update project cost calculation
  async updateCostCalculation(calculationId, organizationId, updateData) {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      // Build dynamic update query
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(updateData[key]);
          paramIndex++;
        }
      });

      if (setClause.length === 0) {
        return null;
      }

      values.push(new Date(), organizationId, calculationId);
      const query = `
        UPDATE project_cost_calculations
        SET ${setClause.join(', ')}, updated_at = $${paramIndex}
        WHERE organization_id = $${paramIndex + 1} AND id = $${paramIndex + 2} AND is_active = true
        RETURNING *
      `;

      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // === PROJECT TEAM MANAGEMENT METHODS ===

  // Assign team to project
  async assignTeam(projectId, organizationId, teamMembers) {
    try {
      const teamAssignments = [];

      for (const member of teamMembers) {
        const result = await this.db.query(queries.project.assignTeamMember, [
          projectId,
          member.user_id,
          member.role,
          member.hourly_rate,
          member.start_date,
          member.end_date,
          organizationId
        ]);

        teamAssignments.push(result.rows[0]);
      }

      return teamAssignments;
    } catch (error) {
      throw error;
    }
  }

  // Get project team
  async getTeam(projectId, organizationId) {
    try {
      const result = await this.db.query(queries.project.getProjectTeam, [
        projectId,
        organizationId
      ]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Update team member role
  async updateTeamMember(projectId, userId, organizationId, updateData) {
    try {
      const result = await this.db.query(queries.project.updateTeamMemberRole, [
        projectId,
        userId,
        organizationId,
        updateData.role,
        updateData.hourly_rate,
        updateData.start_date,
        updateData.end_date
      ]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Remove team member
  async removeTeamMember(projectId, userId, organizationId) {
    try {
      const result = await this.db.query(queries.project.removeTeamMember, [
        projectId,
        userId,
        organizationId
      ]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // === PROJECT TIMELINE & MILESTONES METHODS ===

  // Create milestone
  async createMilestone(milestoneData) {
    try {
      const result = await this.db.query(queries.project.createMilestone, [
        milestoneData.project_id,
        milestoneData.title,
        milestoneData.description,
        milestoneData.due_date,
        milestoneData.status,
        milestoneData.priority,
        milestoneData.assigned_to,
        milestoneData.dependencies,
        milestoneData.organization_id
      ]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get project milestones
  async getMilestones(projectId, organizationId, options = {}) {
    const { status, page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.project.getProjectMilestones, [
        projectId,
        organizationId,
        status,
        limit,
        offset
      ]);

      const countResult = await this.db.query(queries.project.countProjectMilestones, [
        projectId,
        organizationId,
        status
      ]);

      return {
        milestones: result.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: parseInt(countResult.rows[0].count, 10),
          totalPages: Math.ceil(parseInt(countResult.rows[0].count, 10) / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get milestone by ID
  async getMilestoneById(id, organizationId) {
    try {
      const result = await this.db.query(queries.project.findMilestoneById, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Update milestone
  async updateMilestone(id, organizationId, updateData) {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      // Build dynamic update query
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          setClause.push(`${key} = $${paramIndex}`);
          values.push(updateData[key]);
          paramIndex++;
        }
      });

      if (setClause.length === 0) {
        return null;
      }

      values.push(new Date(), organizationId, id);
      const query = `
        UPDATE project_milestones
        SET ${setClause.join(', ')}, updated_at = $${paramIndex}
        WHERE organization_id = $${paramIndex + 1} AND id = $${paramIndex + 2} AND is_active = true
        RETURNING *
      `;

      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Delete milestone
  async deleteMilestone(id, organizationId) {
    try {
      const result = await this.db.query(queries.project.deleteMilestone, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Update milestone status
  async updateMilestoneStatus(id, organizationId, status, completionNotes) {
    try {
      const result = await this.db.query(queries.project.updateMilestoneStatus, [
        id,
        organizationId,
        status,
        completionNotes
      ]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // === PROJECT STATISTICS METHODS ===

  // Get project statistics
  async getStatistics(organizationId) {
    try {
      const result = await this.db.query(queries.project.getProjectStatistics, [organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Get project cost statistics
  async getCostStatistics(projectId) {
    try {
      const result = await this.db.query(queries.project.getProjectCostStatistics, [
        projectId
      ]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProjectRepository;
