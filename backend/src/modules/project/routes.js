const projectHandler = require('./handler');
const projectValidator = require('./validator');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // === PROJECT CRUD ROUTES ===
  {
    method: 'GET',
    path: '/projects',
    handler: projectHandler.getProjects,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: projectValidator.getProjects
      },
      tags: ['projects']
    }
  },
  {
    method: 'GET',
    path: '/projects/{id}',
    handler: projectHandler.getProjectById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: projectValidator.getProjectById
      },
      tags: ['projects']
    }
  },
  {
    method: 'POST',
    path: '/projects',
    handler: projectHandler.createProject,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['project:create']) }
      ],
      validate: {
        payload: projectValidator.createProject
      },
      tags: ['projects']
    }
  },
  {
    method: 'PUT',
    path: '/projects/{id}',
    handler: projectHandler.updateProject,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['project:update']) }
      ],
      validate: {
        params: projectValidator.getProjectById,
        payload: projectValidator.updateProject
      },
      tags: ['projects']
    }
  },
  {
    method: 'DELETE',
    path: '/projects/{id}',
    handler: projectHandler.deleteProject,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['project:delete']) }
      ],
      validate: {
        params: projectValidator.deleteProject
      },
      tags: ['projects']
    }
  },
  {
    method: 'GET',
    path: '/projects/search',
    handler: projectHandler.searchProjects,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: projectValidator.searchProjects
      },
      tags: ['projects']
    }
  },
  {
    method: 'PUT',
    path: '/projects/{id}/status',
    handler: projectHandler.updateProjectStatus,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['project:update_status']) }
      ],
      validate: {
        params: projectValidator.getProjectById,
        payload: projectValidator.updateProjectStatus
      },
      tags: ['projects']
    }
  },
  {
    method: 'PUT',
    path: '/projects/{id}/assign',
    handler: projectHandler.assignProject,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['project:assign']) }
      ],
      validate: {
        params: projectValidator.getProjectById,
        payload: projectValidator.assignProject
      },
      tags: ['projects']
    }
  },

  // === PROJECT COST CALCULATION ROUTES ===
  {
    method: 'POST',
    path: '/projects/calculate-cost',
    handler: projectHandler.calculateProjectCost,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['project:calculate_cost']) }
      ],
      validate: {
        payload: projectValidator.calculateProjectCost
      },
      tags: ['project-cost']
    }
  },
  {
    method: 'GET',
    path: '/projects/cost-breakdown',
    handler: projectHandler.getProjectCostBreakdown,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: projectValidator.getProjectCostBreakdown
      },
      tags: ['project-cost']
    }
  },
  {
    method: 'PUT',
    path: '/projects/cost-calculations/{calculation_id}',
    handler: projectHandler.updateProjectCostCalculation,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['project:update_cost']) }
      ],
      validate: {
        params: projectValidator.updateProjectCostCalculation,
        payload: projectValidator.updateProjectCostCalculation
      },
      tags: ['project-cost']
    }
  },

  // === PROJECT TEAM MANAGEMENT ROUTES ===
  {
    method: 'POST',
    path: '/projects/assign-team',
    handler: projectHandler.assignTeamToProject,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['project:assign_team']) }
      ],
      validate: {
        payload: projectValidator.assignTeamToProject
      },
      tags: ['project-team']
    }
  },
  {
    method: 'GET',
    path: '/projects/team',
    handler: projectHandler.getProjectTeam,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: projectValidator.getProjectTeam
      },
      tags: ['project-team']
    }
  },
  {
    method: 'PUT',
    path: '/projects/team/update-role',
    handler: projectHandler.updateTeamMemberRole,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['project:update_team_role']) }
      ],
      validate: {
        payload: projectValidator.updateTeamMemberRole
      },
      tags: ['project-team']
    }
  },
  {
    method: 'DELETE',
    path: '/projects/team/remove-member',
    handler: projectHandler.removeTeamMember,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['project:remove_team_member']) }
      ],
      validate: {
        payload: projectValidator.removeTeamMember
      },
      tags: ['project-team']
    }
  },

  // === PROJECT TIMELINE & MILESTONES ROUTES ===
  {
    method: 'POST',
    path: '/milestones',
    handler: projectHandler.createMilestone,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['milestone:create']) }
      ],
      validate: {
        payload: projectValidator.createMilestone
      },
      tags: ['milestones']
    }
  },
  {
    method: 'GET',
    path: '/milestones',
    handler: projectHandler.getProjectMilestones,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: projectValidator.getProjectMilestones
      },
      tags: ['milestones']
    }
  },
  {
    method: 'GET',
    path: '/milestones/{id}',
    handler: projectHandler.getMilestoneById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: projectValidator.getMilestoneById
      },
      tags: ['milestones']
    }
  },
  {
    method: 'PUT',
    path: '/milestones/{id}',
    handler: projectHandler.updateMilestone,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['milestone:update']) }
      ],
      validate: {
        params: projectValidator.getMilestoneById,
        payload: projectValidator.updateMilestone
      },
      tags: ['milestones']
    }
  },
  {
    method: 'DELETE',
    path: '/milestones/{id}',
    handler: projectHandler.deleteMilestone,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['milestone:delete']) }
      ],
      validate: {
        params: projectValidator.deleteMilestone
      },
      tags: ['milestones']
    }
  },
  {
    method: 'PUT',
    path: '/milestones/{id}/status',
    handler: projectHandler.updateMilestoneStatus,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['milestone:update_status']) }
      ],
      validate: {
        params: projectValidator.getMilestoneById,
        payload: projectValidator.updateMilestoneStatus
      },
      tags: ['milestones']
    }
  },

  // === PROJECT STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/projects/statistics',
    handler: projectHandler.getProjectStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: projectValidator.getProjectStatistics
      },
      tags: ['project-statistics']
    }
  },
  {
    method: 'GET',
    path: '/projects/cost-statistics',
    handler: projectHandler.getProjectCostStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: projectValidator.getProjectCostStatistics
      },
      tags: ['project-statistics']
    }
  }
];

module.exports = routes;
