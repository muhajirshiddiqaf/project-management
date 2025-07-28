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
      sortBy = 'created_at',
      sortOrder = 'desc',
      status,
      priority,
      category,
      client_id,
      assigned_to,
      created_by
    } = options;

    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.project.findAll, [
        organizationId,
        status,
        priority,
        category,
        client_id,
        assigned_to,
        created_by,
        limit,
        offset,
        sortBy,
        sortOrder
      ]);

      const countResult = await this.db.query(queries.project.countProjects, [
        organizationId,
        status,
        priority,
        category,
        client_id,
        assigned_to,
        created_by
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
        projectData.title,
        projectData.description,
        projectData.client_id,
        projectData.status,
        projectData.priority,
        projectData.category,
        projectData.start_date,
        projectData.end_date,
        projectData.budget,
        projectData.currency,
        projectData.assigned_to,
        projectData.tags,
        projectData.attachments,
        projectData.notes,
        projectData.organization_id,
        projectData.created_by
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
        WHERE organization_id = $${paramIndex + 1} AND id = $${paramIndex + 2} AND is_active = true
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
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.project.searchProjects, [
        organizationId,
        searchTerm,
        limit,
        offset,
        sortBy,
        sortOrder
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
  async updateStatus(id, organizationId, status, notes) {
    try {
      const result = await this.db.query(queries.project.updateProjectStatus, [
        id,
        organizationId,
        status,
        notes
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
        services,
        materials,
        overhead_percentage,
        profit_margin_percentage,
        tax_rate,
        discount_percentage,
        organization_id
      } = costData;

      // Calculate services cost
      let servicesCost = 0;
      const serviceDetails = [];
      for (const service of services) {
        const serviceCost = service.quantity * service.unit_price;
        servicesCost += serviceCost;
        serviceDetails.push({
          ...service,
          total_cost: serviceCost
        });
      }

      // Calculate materials cost
      let materialsCost = 0;
      const materialDetails = [];
      if (materials && materials.length > 0) {
        for (const material of materials) {
          const materialCost = material.quantity * material.unit_price;
          materialsCost += materialCost;
          materialDetails.push({
            ...material,
            total_cost: materialCost
          });
        }
      }

      // Calculate totals
      const subtotal = servicesCost + materialsCost;
      const overheadAmount = (subtotal * overhead_percentage) / 100;
      const subtotalWithOverhead = subtotal + overheadAmount;
      const profitAmount = (subtotalWithOverhead * profit_margin_percentage) / 100;
      const subtotalWithProfit = subtotalWithOverhead + profitAmount;
      const discountAmount = (subtotalWithProfit * discount_percentage) / 100;
      const subtotalAfterDiscount = subtotalWithProfit - discountAmount;
      const taxAmount = (subtotalAfterDiscount * tax_rate) / 100;
      const grandTotal = subtotalAfterDiscount + taxAmount;

      // Save calculation to database
      const result = await this.db.query(queries.project.createProjectCostCalculation, [
        project_id,
        JSON.stringify(serviceDetails),
        JSON.stringify(materialDetails),
        servicesCost,
        materialsCost,
        subtotal,
        overhead_percentage,
        overheadAmount,
        subtotalWithOverhead,
        profit_margin_percentage,
        profitAmount,
        subtotalWithProfit,
        discount_percentage,
        discountAmount,
        subtotalAfterDiscount,
        tax_rate,
        taxAmount,
        grandTotal,
        organization_id
      ]);

      return {
        calculation_id: result.rows[0].id,
        project_id,
        services: serviceDetails,
        materials: materialDetails,
        calculations: {
          services_cost: servicesCost,
          materials_cost: materialsCost,
          subtotal,
          overhead_percentage,
          overhead_amount: overheadAmount,
          subtotal_with_overhead: subtotalWithOverhead,
          profit_margin_percentage,
          profit_amount: profitAmount,
          subtotal_with_profit: subtotalWithProfit,
          discount_percentage,
          discount_amount: discountAmount,
          subtotal_after_discount: subtotalAfterDiscount,
          tax_rate,
          tax_amount: taxAmount,
          grand_total: grandTotal
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get project cost breakdown
  async getCostBreakdown(projectId, organizationId) {
    try {
      const result = await this.db.query(queries.project.getProjectCostBreakdown, [
        projectId,
        organizationId
      ]);

      if (result.rows.length === 0) {
        return null;
      }

      const calculation = result.rows[0];
      return {
        calculation_id: calculation.id,
        project_id: calculation.project_id,
        services: JSON.parse(calculation.services || '[]'),
        materials: JSON.parse(calculation.materials || '[]'),
        calculations: {
          services_cost: parseFloat(calculation.services_cost),
          materials_cost: parseFloat(calculation.materials_cost),
          subtotal: parseFloat(calculation.subtotal),
          overhead_percentage: parseFloat(calculation.overhead_percentage),
          overhead_amount: parseFloat(calculation.overhead_amount),
          subtotal_with_overhead: parseFloat(calculation.subtotal_with_overhead),
          profit_margin_percentage: parseFloat(calculation.profit_margin_percentage),
          profit_amount: parseFloat(calculation.profit_amount),
          subtotal_with_profit: parseFloat(calculation.subtotal_with_profit),
          discount_percentage: parseFloat(calculation.discount_percentage),
          discount_amount: parseFloat(calculation.discount_amount),
          subtotal_after_discount: parseFloat(calculation.subtotal_after_discount),
          tax_rate: parseFloat(calculation.tax_rate),
          tax_amount: parseFloat(calculation.tax_amount),
          grand_total: parseFloat(calculation.grand_total)
        },
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
  async getCostStatistics(projectId, organizationId) {
    try {
      const result = await this.db.query(queries.project.getProjectCostStatistics, [
        projectId,
        organizationId
      ]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProjectRepository;
