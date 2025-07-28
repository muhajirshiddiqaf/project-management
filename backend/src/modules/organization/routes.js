const routes = (handler, auth) => [
  // === ORGANIZATION CRUD OPERATIONS ROUTES ===
  {
    method: 'POST',
    path: '/organizations',
    handler: handler.createOrganization,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['organizations:create']) }
      ],
      validate: {
        payload: auth.createOrganization
      },
      tags: ['organizations']
    }
  },
  {
    method: 'GET',
    path: '/organizations',
    handler: handler.getOrganizations,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getOrganizations
      },
      tags: ['organizations']
    }
  },
  {
    method: 'GET',
    path: '/organizations/{id}',
    handler: handler.getOrganizationById,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getOrganizationById
      },
      tags: ['organizations']
    }
  },
  {
    method: 'PUT',
    path: '/organizations/{id}',
    handler: handler.updateOrganization,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['organizations:update']) }
      ],
      validate: {
        params: auth.getOrganizationById,
        payload: auth.updateOrganization
      },
      tags: ['organizations']
    }
  },
  {
    method: 'DELETE',
    path: '/organizations/{id}',
    handler: handler.deleteOrganization,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['organizations:delete']) }
      ],
      validate: {
        params: auth.deleteOrganization
      },
      tags: ['organizations']
    }
  },

  // === SUBSCRIPTION PLAN MANAGEMENT ROUTES ===
  {
    method: 'POST',
    path: '/subscription-plans',
    handler: handler.createSubscriptionPlan,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['subscription_plans:create']) }
      ],
      validate: {
        payload: auth.createSubscriptionPlan
      },
      tags: ['subscription-plans']
    }
  },
  {
    method: 'GET',
    path: '/subscription-plans',
    handler: handler.getSubscriptionPlans,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getSubscriptionPlans
      },
      tags: ['subscription-plans']
    }
  },
  {
    method: 'GET',
    path: '/subscription-plans/{id}',
    handler: handler.getSubscriptionPlanById,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getSubscriptionPlanById
      },
      tags: ['subscription-plans']
    }
  },
  {
    method: 'PUT',
    path: '/subscription-plans/{id}',
    handler: handler.updateSubscriptionPlan,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['subscription_plans:update']) }
      ],
      validate: {
        params: auth.getSubscriptionPlanById,
        payload: auth.updateSubscriptionPlan
      },
      tags: ['subscription-plans']
    }
  },
  {
    method: 'DELETE',
    path: '/subscription-plans/{id}',
    handler: handler.deleteSubscriptionPlan,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['subscription_plans:delete']) }
      ],
      validate: {
        params: auth.deleteSubscriptionPlan
      },
      tags: ['subscription-plans']
    }
  },

  // === ORGANIZATION SUBSCRIPTION MANAGEMENT ROUTES ===
  {
    method: 'POST',
    path: '/organizations/assign-subscription',
    handler: handler.assignSubscriptionToOrganization,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['organizations:assign_subscription']) }
      ],
      validate: {
        payload: auth.assignSubscriptionToOrganization
      },
      tags: ['organizations', 'subscriptions']
    }
  },
  {
    method: 'PUT',
    path: '/organizations/{organization_id}/subscription',
    handler: handler.updateOrganizationSubscription,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['organizations:update_subscription']) }
      ],
      validate: {
        params: auth.getOrganizationSubscription,
        payload: auth.updateOrganizationSubscription
      },
      tags: ['organizations', 'subscriptions']
    }
  },
  {
    method: 'GET',
    path: '/organizations/{organization_id}/subscription',
    handler: handler.getOrganizationSubscription,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getOrganizationSubscription
      },
      tags: ['organizations', 'subscriptions']
    }
  },
  {
    method: 'POST',
    path: '/organizations/{organization_id}/cancel-subscription',
    handler: handler.cancelOrganizationSubscription,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['organizations:cancel_subscription']) }
      ],
      validate: {
        params: auth.getOrganizationSubscription,
        payload: auth.cancelOrganizationSubscription
      },
      tags: ['organizations', 'subscriptions']
    }
  },

  // === TENANT SETTINGS ROUTES ===
  {
    method: 'GET',
    path: '/organizations/{organization_id}/settings',
    handler: handler.getTenantSettings,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getTenantSettings
      },
      tags: ['organizations', 'settings']
    }
  },
  {
    method: 'PUT',
    path: '/organizations/{organization_id}/settings',
    handler: handler.updateTenantSettings,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['organizations:update_settings']) }
      ],
      validate: {
        params: auth.getTenantSettings,
        payload: auth.updateTenantSettings
      },
      tags: ['organizations', 'settings']
    }
  },

  // === TENANT ONBOARDING ROUTES ===
  {
    method: 'POST',
    path: '/organizations/initiate-onboarding',
    handler: handler.initiateOnboarding,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['organizations:initiate_onboarding']) }
      ],
      validate: {
        payload: auth.initiateOnboarding
      },
      tags: ['organizations', 'onboarding']
    }
  },
  {
    method: 'PUT',
    path: '/organizations/update-onboarding',
    handler: handler.updateOnboardingProgress,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['organizations:update_onboarding']) }
      ],
      validate: {
        payload: auth.updateOnboardingProgress
      },
      tags: ['organizations', 'onboarding']
    }
  },
  {
    method: 'GET',
    path: '/organizations/{organization_id}/onboarding-status',
    handler: handler.getOnboardingStatus,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getOnboardingStatus
      },
      tags: ['organizations', 'onboarding']
    }
  },

  // === TENANT OFFBOARDING ROUTES ===
  {
    method: 'POST',
    path: '/organizations/initiate-offboarding',
    handler: handler.initiateOffboarding,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['organizations:initiate_offboarding']) }
      ],
      validate: {
        payload: auth.initiateOffboarding
      },
      tags: ['organizations', 'offboarding']
    }
  },
  {
    method: 'PUT',
    path: '/organizations/update-offboarding',
    handler: handler.updateOffboardingProgress,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['organizations:update_offboarding']) }
      ],
      validate: {
        payload: auth.updateOffboardingProgress
      },
      tags: ['organizations', 'offboarding']
    }
  },
  {
    method: 'GET',
    path: '/organizations/{organization_id}/offboarding-status',
    handler: handler.getOffboardingStatus,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: auth.getOffboardingStatus
      },
      tags: ['organizations', 'offboarding']
    }
  },

  // === ORGANIZATION STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/organizations/statistics',
    handler: handler.getOrganizationStatistics,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getOrganizationStatistics
      },
      tags: ['organizations', 'statistics']
    }
  },

  // === BULK OPERATIONS ROUTES ===
  {
    method: 'PUT',
    path: '/organizations/bulk-update',
    handler: handler.bulkUpdateOrganizations,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['organizations:bulk_update']) }
      ],
      validate: {
        payload: auth.bulkUpdateOrganizations
      },
      tags: ['organizations', 'bulk-operations']
    }
  },
  {
    method: 'DELETE',
    path: '/organizations/bulk-delete',
    handler: handler.bulkDeleteOrganizations,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['organizations:bulk_delete']) }
      ],
      validate: {
        payload: auth.bulkDeleteOrganizations
      },
      tags: ['organizations', 'bulk-operations']
    }
  },

  // === ORGANIZATION IMPORT/EXPORT ROUTES ===
  {
    method: 'POST',
    path: '/organizations/import',
    handler: handler.importOrganizations,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin']) },
        //{ method: permissionBasedAccess(['organizations:import']) }
      ],
      validate: {
        payload: auth.importOrganizations
      },
      tags: ['organizations', 'import-export']
    }
  },
  {
    method: 'GET',
    path: '/organizations/export',
    handler: handler.exportOrganizations,
    options: {
      auth: 'jwt',
      pre: [
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['organizations:export']) }
      ],
      validate: {
        query: auth.exportOrganizations
      },
      tags: ['organizations', 'import-export']
    }
  }
];

module.exports = routes;
