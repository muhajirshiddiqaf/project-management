const Boom = require('@hapi/boom');

class ProjectHandler {
  constructor() {
    this.projectRepository = null;
  }

  // Set repository (dependency injection)
  setProjectRepository(projectRepository) {
    this.projectRepository = projectRepository;
  }

  // === PROJECT CRUD METHODS ===

  // Get all projects
  async getProjects(request, h) {
    try {
      const { organizationId } = request;
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc', status, priority, category, client_id, assigned_to, created_by } = request.query;

      const projects = await this.projectRepository.findAll(organizationId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sortBy,
        sortOrder,
        status,
        priority,
        category,
        client_id,
        assigned_to,
        created_by
      });

      return h.response({
        success: true,
        message: 'Projects retrieved successfully',
        data: projects
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve projects');
    }
  }

  // Get project by ID
  async getProjectById(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const project = await this.projectRepository.findById(id, organizationId);

      if (!project) {
        throw Boom.notFound('Project not found');
      }

      return h.response({
        success: true,
        message: 'Project retrieved successfully',
        data: project
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to retrieve project');
    }
  }

  // Create new project
  async createProject(request, h) {
    try {
      const { organizationId, userId } = request;
      const projectData = request.payload;

      const project = await this.projectRepository.create({
        ...projectData,
        organization_id: organizationId,
        created_by: userId
      });

      return h.response({
        success: true,
        message: 'Project created successfully',
        data: project
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to create project');
    }
  }

  // Update project
  async updateProject(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const updateData = request.payload;

      const project = await this.projectRepository.update(id, organizationId, updateData);

      if (!project) {
        throw Boom.notFound('Project not found');
      }

      return h.response({
        success: true,
        message: 'Project updated successfully',
        data: project
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update project');
    }
  }

  // Delete project
  async deleteProject(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const deleted = await this.projectRepository.delete(id, organizationId);

      if (!deleted) {
        throw Boom.notFound('Project not found');
      }

      return h.response({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete project');
    }
  }

  // Search projects
  async searchProjects(request, h) {
    try {
      const { organizationId } = request;
      const { q, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = request.query;

      const projects = await this.projectRepository.search(organizationId, q, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sortBy,
        sortOrder
      });

      return h.response({
        success: true,
        message: 'Projects search completed',
        data: projects
      });
    } catch (error) {
      throw Boom.internal('Failed to search projects');
    }
  }

  // Update project status
  async updateProjectStatus(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const { status, notes } = request.payload;

      const project = await this.projectRepository.updateStatus(id, organizationId, status, notes);

      if (!project) {
        throw Boom.notFound('Project not found');
      }

      return h.response({
        success: true,
        message: 'Project status updated successfully',
        data: project
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update project status');
    }
  }

  // Assign project
  async assignProject(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const { assigned_to } = request.payload;

      const project = await this.projectRepository.assign(id, organizationId, assigned_to);

      if (!project) {
        throw Boom.notFound('Project not found');
      }

      return h.response({
        success: true,
        message: 'Project assigned successfully',
        data: project
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to assign project');
    }
  }

  // === PROJECT COST CALCULATION METHODS ===

  // Calculate project cost
  async calculateProjectCost(request, h) {
    try {
      const { organizationId } = request;
      const costData = request.payload;

      const calculation = await this.projectRepository.calculateCost({
        ...costData,
        organization_id: organizationId
      });

      return h.response({
        success: true,
        message: 'Project cost calculated successfully',
        data: calculation
      });
    } catch (error) {
      throw Boom.internal('Failed to calculate project cost');
    }
  }

  // Get project cost breakdown
  async getProjectCostBreakdown(request, h) {
    try {
      const { organizationId } = request;
      const { project_id } = request.query;

      const breakdown = await this.projectRepository.getCostBreakdown(project_id, organizationId);

      return h.response({
        success: true,
        message: 'Project cost breakdown retrieved successfully',
        data: breakdown
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve project cost breakdown');
    }
  }

  // Update project cost calculation
  async updateProjectCostCalculation(request, h) {
    try {
      const { organizationId } = request;
      const { calculation_id } = request.params;
      const updateData = request.payload;

      const calculation = await this.projectRepository.updateCostCalculation(calculation_id, organizationId, updateData);

      if (!calculation) {
        throw Boom.notFound('Cost calculation not found');
      }

      return h.response({
        success: true,
        message: 'Project cost calculation updated successfully',
        data: calculation
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update project cost calculation');
    }
  }

  // === PROJECT TEAM MANAGEMENT METHODS ===

  // Assign team to project
  async assignTeamToProject(request, h) {
    try {
      const { organizationId } = request;
      const { project_id, team_members } = request.payload;

      const team = await this.projectRepository.assignTeam(project_id, organizationId, team_members);

      return h.response({
        success: true,
        message: 'Team assigned to project successfully',
        data: team
      });
    } catch (error) {
      throw Boom.internal('Failed to assign team to project');
    }
  }

  // Get project team
  async getProjectTeam(request, h) {
    try {
      const { organizationId } = request;
      const { project_id } = request.query;

      const team = await this.projectRepository.getTeam(project_id, organizationId);

      return h.response({
        success: true,
        message: 'Project team retrieved successfully',
        data: team
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve project team');
    }
  }

  // Update team member role
  async updateTeamMemberRole(request, h) {
    try {
      const { organizationId } = request;
      const { project_id, user_id, role, hourly_rate, start_date, end_date } = request.payload;

      const member = await this.projectRepository.updateTeamMember(project_id, user_id, organizationId, {
        role,
        hourly_rate,
        start_date,
        end_date
      });

      if (!member) {
        throw Boom.notFound('Team member not found');
      }

      return h.response({
        success: true,
        message: 'Team member role updated successfully',
        data: member
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update team member role');
    }
  }

  // Remove team member
  async removeTeamMember(request, h) {
    try {
      const { organizationId } = request;
      const { project_id, user_id } = request.payload;

      const removed = await this.projectRepository.removeTeamMember(project_id, user_id, organizationId);

      if (!removed) {
        throw Boom.notFound('Team member not found');
      }

      return h.response({
        success: true,
        message: 'Team member removed successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to remove team member');
    }
  }

  // === PROJECT TIMELINE & MILESTONES METHODS ===

  // Create milestone
  async createMilestone(request, h) {
    try {
      const { organizationId } = request;
      const milestoneData = request.payload;

      const milestone = await this.projectRepository.createMilestone({
        ...milestoneData,
        organization_id: organizationId
      });

      return h.response({
        success: true,
        message: 'Milestone created successfully',
        data: milestone
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to create milestone');
    }
  }

  // Get project milestones
  async getProjectMilestones(request, h) {
    try {
      const { organizationId } = request;
      const { project_id, status, page = 1, limit = 10 } = request.query;

      const milestones = await this.projectRepository.getMilestones(project_id, organizationId, {
        status,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
      });

      return h.response({
        success: true,
        message: 'Project milestones retrieved successfully',
        data: milestones
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve project milestones');
    }
  }

  // Get milestone by ID
  async getMilestoneById(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const milestone = await this.projectRepository.getMilestoneById(id, organizationId);

      if (!milestone) {
        throw Boom.notFound('Milestone not found');
      }

      return h.response({
        success: true,
        message: 'Milestone retrieved successfully',
        data: milestone
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to retrieve milestone');
    }
  }

  // Update milestone
  async updateMilestone(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const updateData = request.payload;

      const milestone = await this.projectRepository.updateMilestone(id, organizationId, updateData);

      if (!milestone) {
        throw Boom.notFound('Milestone not found');
      }

      return h.response({
        success: true,
        message: 'Milestone updated successfully',
        data: milestone
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update milestone');
    }
  }

  // Delete milestone
  async deleteMilestone(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const deleted = await this.projectRepository.deleteMilestone(id, organizationId);

      if (!deleted) {
        throw Boom.notFound('Milestone not found');
      }

      return h.response({
        success: true,
        message: 'Milestone deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete milestone');
    }
  }

  // Update milestone status
  async updateMilestoneStatus(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const { status, completion_notes } = request.payload;

      const milestone = await this.projectRepository.updateMilestoneStatus(id, organizationId, status, completion_notes);

      if (!milestone) {
        throw Boom.notFound('Milestone not found');
      }

      return h.response({
        success: true,
        message: 'Milestone status updated successfully',
        data: milestone
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update milestone status');
    }
  }

  // === PROJECT STATISTICS METHODS ===

  // Get project statistics
  async getProjectStatistics(request, h) {
    try {
      const { organizationId } = request;

      const statistics = await this.projectRepository.getStatistics(organizationId);

      return h.response({
        success: true,
        message: 'Project statistics retrieved successfully',
        data: statistics
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve project statistics');
    }
  }

  // Get project cost statistics
  async getProjectCostStatistics(request, h) {
    try {
      const { organizationId } = request;
      const { project_id } = request.query;

      const statistics = await this.projectRepository.getCostStatistics(project_id, organizationId);

      return h.response({
        success: true,
        message: 'Project cost statistics retrieved successfully',
        data: statistics
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve project cost statistics');
    }
  }
}

module.exports = new ProjectHandler();
