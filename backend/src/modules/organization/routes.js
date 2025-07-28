const organizationHandler = require('./handler');
const organizationValidator = require('./validator');
const { roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // === ORGANIZATION CRUD OPERATIONS ROUTES ===
  {
    method: 'POST',
    path: '/organizations',
    handler: organizationHandler.createOrganization,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['organizations:create']) }
      ],
      validate: {
        payload: organizationValidator.createOrganization
      },
      tags: ['organizations']
    }
  },
  {
    method: 'GET',
    path: '/organizations',
    handler: organizationHandler.getOrganizations,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: organizationValidator.getOrganizations
      },
      tags: ['organizations']
    }
  },
  {
    method: 'GET',
    path: '/organizations/{id}',
    handler: organizationHandler.getOrganizationById,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: organizationValidator.getOrganizationById
      },
      tags: ['organizations']
    }
  },
  {
    method: 'PUT',
    path: '/organizations/{id}',
    handler: organizationHandler.updateOrganization,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['organizations:update']) }
      ],
      validate: {
        params: organizationValidator.getOrganizationById,
        payload: organizationValidator.updateOrganization
      },
      tags: ['organizations']
    }
  },
  {
    method: 'DELETE',
    path: '/organizations/{id}',
    handler: organizationHandler.deleteOrganization,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['organizations:delete']) }
      ],
      validate: {
        params: organizationValidator.deleteOrganization
      },
      tags: ['organizations']
    }
  },

  // === SUBSCRIPTION PLAN MANAGEMENT ROUTES ===
  {
    method: 'POST',
    path: '/subscription-plans',
    handler: organizationHandler.createSubscriptionPlan,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['subscription_plans:create']) }
      ],
      validate: {
        payload: organizationValidator.createSubscriptionPlan
      },
      tags: ['subscription-plans']
    }
  },
  {
    method: 'GET',
    path: '/subscription-plans',
    handler: organizationHandler.getSubscriptionPlans,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: organizationValidator.getSubscriptionPlans
      },
      tags: ['subscription-plans']
    }
  },
  {
    method: 'GET',
    path: '/subscription-plans/{id}',
    handler: organizationHandler.getSubscriptionPlanById,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: organizationValidator.getSubscriptionPlanById
      },
      tags: ['subscription-plans']
    }
  },
  {
    method: 'PUT',
    path: '/subscription-plans/{id}',
    handler: organizationHandler.updateSubscriptionPlan,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['subscription_plans:update']) }
      ],
      validate: {
        params: organizationValidator.getSubscriptionPlanById,
        payload: organizationValidator.updateSubscriptionPlan
      },
      tags: ['subscription-plans']
    }
  },
  {
    method: 'DELETE',
    path: '/subscription-plans/{id}',
    handler: organizationHandler.deleteSubscriptionPlan,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['subscription_plans:delete']) }
      ],
      validate: {
        params: organizationValidator.deleteSubscriptionPlan
      },
      tags: ['subscription-plans']
    }
  },

  // === ORGANIZATION SUBSCRIPTION MANAGEMENT ROUTES ===
  {
    method: 'POST',
    path: '/organizations/assign-subscription',
    handler: organizationHandler.assignSubscriptionToOrganization,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['organizations:assign_subscription']) }
      ],
      validate: {
        payload: organizationValidator.assignSubscriptionToOrganization
      },
      tags: ['organizations', 'subscriptions']
    }
  },
  {
    method: 'PUT',
    path: '/organizations/{organization_id}/subscription',
    handler: organizationHandler.updateOrganizationSubscription,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['organizations:update_subscription']) }
      ],
      validate: {
        params: organizationValidator.getOrganizationSubscription,
        payload: organizationValidator.updateOrganizationSubscription
      },
      tags: ['organizations', 'subscriptions']
    }
  },
  {
    method: 'GET',
    path: '/organizations/{organization_id}/subscription',
    handler: organizationHandler.getOrganizationSubscription,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: organizationValidator.getOrganizationSubscription
      },
      tags: ['organizations', 'subscriptions']
    }
  },
  {
    method: 'POST',
    path: '/organizations/{organization_id}/cancel-subscription',
    handler: organizationHandler.cancelOrganizationSubscription,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['organizations:cancel_subscription']) }
      ],
      validate: {
        params: organizationValidator.getOrganizationSubscription,
        payload: organizationValidator.cancelOrganizationSubscription
      },
      tags: ['organizations', 'subscriptions']
    }
  },

  // === TENANT SETTINGS ROUTES ===
  {
    method: 'GET',
    path: '/organizations/{organization_id}/settings',
    handler: organizationHandler.getTenantSettings,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: organizationValidator.getTenantSettings
      },
      tags: ['organizations', 'settings']
    }
  },
  {
    method: 'PUT',
    path: '/organizations/{organization_id}/settings',
    handler: organizationHandler.updateTenantSettings,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['organizations:update_settings']) }
      ],
      validate: {
        params: organizationValidator.getTenantSettings,
        payload: organizationValidator.updateTenantSettings
      },
      tags: ['organizations', 'settings']
    }
  },

  // === TENANT ONBOARDING ROUTES ===
  {
    method: 'POST',
    path: '/organizations/initiate-onboarding',
    handler: organizationHandler.initiateOnboarding,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['organizations:initiate_onboarding']) }
      ],
      validate: {
        payload: organizationValidator.initiateOnboarding
      },
      tags: ['organizations', 'onboarding']
    }
  },
  {
    method: 'PUT',
    path: '/organizations/update-onboarding',
    handler: organizationHandler.updateOnboardingProgress,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['organizations:update_onboarding']) }
      ],
      validate: {
        payload: organizationValidator.updateOnboardingProgress
      },
      tags: ['organizations', 'onboarding']
    }
  },
  {
    method: 'GET',
    path: '/organizations/{organization_id}/onboarding-status',
    handler: organizationHandler.getOnboardingStatus,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: organizationValidator.getOnboardingStatus
      },
      tags: ['organizations', 'onboarding']
    }
  },

  // === TENANT OFFBOARDING ROUTES ===
  {
    method: 'POST',
    path: '/organizations/initiate-offboarding',
    handler: organizationHandler.initiateOffboarding,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['organizations:initiate_offboarding']) }
      ],
      validate: {
        payload: organizationValidator.initiateOffboarding
      },
      tags: ['organizations', 'offboarding']
    }
  },
  {
    method: 'PUT',
    path: '/organizations/update-offboarding',
    handler: organizationHandler.updateOffboardingProgress,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['organizations:update_offboarding']) }
      ],
      validate: {
        payload: organizationValidator.updateOffboardingProgress
      },
      tags: ['organizations', 'offboarding']
    }
  },
  {
    method: 'GET',
    path: '/organizations/{organization_id}/offboarding-status',
    handler: organizationHandler.getOffboardingStatus,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        params: organizationValidator.getOffboardingStatus
      },
      tags: ['organizations', 'offboarding']
    }
  },

  // === ORGANIZATION STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/organizations/statistics',
    handler: organizationHandler.getOrganizationStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: organizationValidator.getOrganizationStatistics
      },
      tags: ['organizations', 'statistics']
    }
  },

  // === BULK OPERATIONS ROUTES ===
  {
    method: 'PUT',
    path: '/organizations/bulk-update',
    handler: organizationHandler.bulkUpdateOrganizations,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['organizations:bulk_update']) }
      ],
      validate: {
        payload: organizationValidator.bulkUpdateOrganizations
      },
      tags: ['organizations', 'bulk-operations']
    }
  },
  {
    method: 'DELETE',
    path: '/organizations/bulk-delete',
    handler: organizationHandler.bulkDeleteOrganizations,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['organizations:bulk_delete']) }
      ],
      validate: {
        payload: organizationValidator.bulkDeleteOrganizations
      },
      tags: ['organizations', 'bulk-operations']
    }
  },

  // === ORGANIZATION IMPORT/EXPORT ROUTES ===
  {
    method: 'POST',
    path: '/organizations/import',
    handler: organizationHandler.importOrganizations,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin']) },
        { method: permissionBasedAccess(['organizations:import']) }
      ],
      validate: {
        payload: organizationValidator.importOrganizations
      },
      tags: ['organizations', 'import-export']
    }
  },
  {
    method: 'GET',
    path: '/organizations/export',
    handler: organizationHandler.exportOrganizations,
    options: {
      auth: 'jwt',
      pre: [
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['organizations:export']) }
      ],
      validate: {
        query: organizationValidator.exportOrganizations
      },
      tags: ['organizations', 'import-export']
    }
  }
];

module.exports = routes;
