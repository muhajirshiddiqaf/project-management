const Boom = require('@hapi/boom');

class ProjectHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // Bind all methods to preserve 'this' context
    this.getProjects = this.getProjects.bind(this);
    this.getProjectById = this.getProjectById.bind(this);
    this.createProject = this.createProject.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.searchProjects = this.searchProjects.bind(this);
    this.updateProjectStatus = this.updateProjectStatus.bind(this);
    this.assignProject = this.assignProject.bind(this);
    this.calculateProjectCost = this.calculateProjectCost.bind(this);
    this.getProjectCostBreakdown = this.getProjectCostBreakdown.bind(this);
    this.updateProjectCostCalculation = this.updateProjectCostCalculation.bind(this);
    this.assignTeamToProject = this.assignTeamToProject.bind(this);
    this.getProjectTeam = this.getProjectTeam.bind(this);
    this.updateTeamMemberRole = this.updateTeamMemberRole.bind(this);
    this.removeTeamMember = this.removeTeamMember.bind(this);
    this.createMilestone = this.createMilestone.bind(this);
    this.getProjectMilestones = this.getProjectMilestones.bind(this);
    this.getMilestoneById = this.getMilestoneById.bind(this);
    this.updateMilestone = this.updateMilestone.bind(this);
    this.deleteMilestone = this.deleteMilestone.bind(this);
    this.updateMilestoneStatus = this.updateMilestoneStatus.bind(this);
    this.getProjectStatistics = this.getProjectStatistics.bind(this);
    this.getProjectCostStatistics = this.getProjectCostStatistics.bind(this);
  }

  // === PROJECT CRUD METHODS ===

  // Get all projects
  async getProjects(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc', status, priority, category, client_id, assigned_to, created_by } = request.query;

      const projects = await this._service.findAll(organizationId, {
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
      const { organizationId } = request.auth.credentials;
      const { id } = request.params;

      const project = await this._service.findById(id, organizationId);

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
      const { organizationId, userId } = request.auth.credentials;
      const projectData = request.payload;

      console.log('Auth credentials:', request.auth.credentials);
      console.log('Project data:', { ...projectData, organization_id: organizationId, created_by: userId });

      const project = await this._service.create({
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
      console.error('Create project error:', error);
      throw Boom.internal('Failed to create project');
    }
  }

  // Update project
  async updateProject(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { id } = request.params;
      const updateData = request.payload;

      const project = await this._service.update(id, organizationId, updateData);

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
      const { organizationId } = request.auth.credentials;
      const { id } = request.params;

      const deleted = await this._service.delete(id, organizationId);

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
      const { organizationId } = request.auth.credentials;
      const { q, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = request.query;

      const projects = await this._service.search(organizationId, q, {
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
      const { organizationId } = request.auth.credentials;
      const { id } = request.params;
      const { status } = request.payload;

      const project = await this._service.updateStatus(id, organizationId, status);

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
      const { organizationId } = request.auth.credentials;
      const { id } = request.params;
      const { assigned_to } = request.payload;

      const project = await this._service.assign(id, organizationId, assigned_to);

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
      const { organizationId, userId } = request.auth.credentials;
      const costData = request.payload;

      const calculation = await this._service.calculateCost({
        ...costData,
        organization_id: organizationId,
        created_by: userId
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
      const { project_id } = request.query;

      const breakdown = await this._service.getCostBreakdown(project_id);

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
      const { organization_id } = request.auth.credentials;
      const { calculation_id } = request.params;
      const updateData = request.payload;

      const calculation = await this._service.updateCostCalculation(calculation_id, organization_id, updateData);

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
      const { organization_id } = request.auth.credentials;
      const { project_id, team_members } = request.payload;

      const team = await this._service.assignTeam(project_id, organization_id, team_members);

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
      const { organization_id } = request.auth.credentials;
      const { project_id } = request.query;

      const team = await this._service.getTeam(project_id, organization_id);

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
      const { organization_id } = request.auth.credentials;
      const { project_id, user_id, role, hourly_rate, start_date, end_date } = request.payload;

      const member = await this._service.updateTeamMember(project_id, user_id, organization_id, {
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
      const { organization_id } = request.auth.credentials;
      const { project_id, user_id } = request.payload;

      const removed = await this._service.removeTeamMember(project_id, user_id, organization_id);

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
      const { organization_id } = request.auth.credentials;
      const milestoneData = request.payload;

      const milestone = await this._service.createMilestone({
        ...milestoneData,
        organization_id: organization_id
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
      const { organization_id } = request.auth.credentials;
      const { project_id, status, page = 1, limit = 10 } = request.query;

      const milestones = await this._service.getMilestones(project_id, organization_id, {
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
      const { organization_id } = request.auth.credentials;
      const { id } = request.params;

      const milestone = await this._service.getMilestoneById(id, organization_id);

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
      const { organization_id } = request.auth.credentials;
      const { id } = request.params;
      const updateData = request.payload;

      const milestone = await this._service.updateMilestone(id, organization_id, updateData);

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
      const { organization_id } = request.auth.credentials;
      const { id } = request.params;

      const deleted = await this._service.deleteMilestone(id, organization_id);

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
      const { organization_id } = request.auth.credentials;
      const { id } = request.params;
      const { status, completion_notes } = request.payload;

      const milestone = await this._service.updateMilestoneStatus(id, organization_id, status, completion_notes);

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
      const { organizationId } = request.auth.credentials;

      const statistics = await this._service.getStatistics(organizationId);

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
      const { project_id } = request.query;

      const statistics = await this._service.getCostStatistics(project_id);

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

module.exports = ProjectHandler;
