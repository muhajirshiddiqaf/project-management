const routes = (handler, auth) => [
  // === PROJECT CRUD ROUTES ===
  {
    method: 'GET',
    path: '/projects',
    handler: handler.getProjects,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getProjects
      },
      tags: ['projects']
    }
  },
  {
    method: 'GET',
    path: '/projects/{id}',
    handler: handler.getProjectById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: auth.getProjectById
      },
      tags: ['projects']
    }
  },
  {
    method: 'POST',
    path: '/projects',
    handler: handler.createProject,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['project:create']) }
      ],
      validate: {
        payload: auth.createProject
      },
      tags: ['projects']
    }
  },
  {
    method: 'PUT',
    path: '/projects/{id}',
    handler: handler.updateProject,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['project:update']) }
      ],
      validate: {
        params: auth.getProjectById,
        payload: auth.updateProject
      },
      tags: ['projects']
    }
  },
  {
    method: 'DELETE',
    path: '/projects/{id}',
    handler: handler.deleteProject,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['project:delete']) }
      ],
      validate: {
        params: auth.deleteProject
      },
      tags: ['projects']
    }
  },
  {
    method: 'GET',
    path: '/projects/search',
    handler: handler.searchProjects,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.searchProjects
      },
      tags: ['projects']
    }
  },
  {
    method: 'PUT',
    path: '/projects/{id}/status',
    handler: handler.updateProjectStatus,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['project:update_status']) }
      ],
      validate: {
        params: auth.getProjectById,
        payload: auth.updateProjectStatus
      },
      tags: ['projects']
    }
  },
  {
    method: 'PUT',
    path: '/projects/{id}/assign',
    handler: handler.assignProject,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['project:assign']) }
      ],
      validate: {
        params: auth.getProjectById,
        payload: auth.assignProject
      },
      tags: ['projects']
    }
  },

  // === PROJECT COST CALCULATION ROUTES ===
  {
    method: 'POST',
    path: '/projects/calculate-cost',
    handler: handler.calculateProjectCost,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['project:calculate_cost']) }
      ],
      validate: {
        payload: auth.calculateProjectCost
      },
      tags: ['project-cost']
    }
  },
  {
    method: 'GET',
    path: '/projects/cost-breakdown',
    handler: handler.getProjectCostBreakdown,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getProjectCostBreakdown
      },
      tags: ['project-cost']
    }
  },
  {
    method: 'PUT',
    path: '/projects/cost-calculations/{calculation_id}',
    handler: handler.updateProjectCostCalculation,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['project:update_cost']) }
      ],
      validate: {
        params: auth.updateProjectCostCalculation,
        payload: auth.updateProjectCostCalculation
      },
      tags: ['project-cost']
    }
  },

  // === PROJECT TEAM MANAGEMENT ROUTES ===
  {
    method: 'POST',
    path: '/projects/assign-team',
    handler: handler.assignTeamToProject,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['project:assign_team']) }
      ],
      validate: {
        payload: auth.assignTeamToProject
      },
      tags: ['project-team']
    }
  },
  {
    method: 'GET',
    path: '/projects/team',
    handler: handler.getProjectTeam,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getProjectTeam
      },
      tags: ['project-team']
    }
  },
  {
    method: 'PUT',
    path: '/projects/team/update-role',
    handler: handler.updateTeamMemberRole,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['project:update_team_role']) }
      ],
      validate: {
        payload: auth.updateTeamMemberRole
      },
      tags: ['project-team']
    }
  },
  {
    method: 'DELETE',
    path: '/projects/team/remove-member',
    handler: handler.removeTeamMember,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['project:remove_team_member']) }
      ],
      validate: {
        payload: auth.removeTeamMember
      },
      tags: ['project-team']
    }
  },

  // === PROJECT TIMELINE & MILESTONES ROUTES ===
  {
    method: 'POST',
    path: '/milestones',
    handler: handler.createMilestone,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['milestone:create']) }
      ],
      validate: {
        payload: auth.createMilestone
      },
      tags: ['milestones']
    }
  },
  {
    method: 'GET',
    path: '/milestones',
    handler: handler.getProjectMilestones,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getProjectMilestones
      },
      tags: ['milestones']
    }
  },
  {
    method: 'GET',
    path: '/milestones/{id}',
    handler: handler.getMilestoneById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: auth.getMilestoneById
      },
      tags: ['milestones']
    }
  },
  {
    method: 'PUT',
    path: '/milestones/{id}',
    handler: handler.updateMilestone,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['milestone:update']) }
      ],
      validate: {
        params: auth.getMilestoneById,
        payload: auth.updateMilestone
      },
      tags: ['milestones']
    }
  },
  {
    method: 'DELETE',
    path: '/milestones/{id}',
    handler: handler.deleteMilestone,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['milestone:delete']) }
      ],
      validate: {
        params: auth.deleteMilestone
      },
      tags: ['milestones']
    }
  },
  {
    method: 'PUT',
    path: '/milestones/{id}/status',
    handler: handler.updateMilestoneStatus,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['milestone:update_status']) }
      ],
      validate: {
        params: auth.getMilestoneById,
        payload: auth.updateMilestoneStatus
      },
      tags: ['milestones']
    }
  },

  // === PROJECT STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/projects/statistics',
    handler: handler.getProjectStatistics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getProjectStatistics
      },
      tags: ['project-statistics']
    }
  },
  {
    method: 'GET',
    path: '/projects/cost-statistics',
    handler: handler.getProjectCostStatistics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getProjectCostStatistics
      },
      tags: ['project-statistics']
    }
  }
];

module.exports = routes;
