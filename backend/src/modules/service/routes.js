const serviceHandler = require('./handler');
const serviceValidator = require('./validator');
const { tenantIsolation, roleBasedAccess, permissionBasedAccess } = require('../../middleware');

const routes = [
  // === SERVICE CRUD ROUTES ===
  {
    method: 'GET',
    path: '/services',
    handler: serviceHandler.getServices,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: serviceValidator.getServices
      },
      tags: ['services']
    }
  },
  {
    method: 'GET',
    path: '/services/{id}',
    handler: serviceHandler.getServiceById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: serviceValidator.getServiceById
      },
      tags: ['services']
    }
  },
  {
    method: 'POST',
    path: '/services',
    handler: serviceHandler.createService,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['service:create']) }
      ],
      validate: {
        payload: serviceValidator.createService
      },
      tags: ['services']
    }
  },
  {
    method: 'PUT',
    path: '/services/{id}',
    handler: serviceHandler.updateService,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['service:update']) }
      ],
      validate: {
        params: serviceValidator.getServiceById,
        payload: serviceValidator.updateService
      },
      tags: ['services']
    }
  },
  {
    method: 'DELETE',
    path: '/services/{id}',
    handler: serviceHandler.deleteService,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['service:delete']) }
      ],
      validate: {
        params: serviceValidator.deleteService
      },
      tags: ['services']
    }
  },
  {
    method: 'GET',
    path: '/services/search',
    handler: serviceHandler.searchServices,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: serviceValidator.searchServices
      },
      tags: ['services']
    }
  },
  {
    method: 'PUT',
    path: '/services/{id}/status',
    handler: serviceHandler.updateServiceStatus,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['service:update_status']) }
      ],
      validate: {
        params: serviceValidator.getServiceById,
        payload: serviceValidator.updateServiceStatus
      },
      tags: ['services']
    }
  },

  // === SERVICE CATEGORIES ROUTES ===
  {
    method: 'GET',
    path: '/service-categories',
    handler: serviceHandler.getServiceCategories,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: serviceValidator.getServiceCategories
      },
      tags: ['service-categories']
    }
  },
  {
    method: 'GET',
    path: '/service-categories/{id}',
    handler: serviceHandler.getServiceCategoryById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: serviceValidator.getServiceCategoryById
      },
      tags: ['service-categories']
    }
  },
  {
    method: 'POST',
    path: '/service-categories',
    handler: serviceHandler.createServiceCategory,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['service:create_category']) }
      ],
      validate: {
        payload: serviceValidator.createServiceCategory
      },
      tags: ['service-categories']
    }
  },
  {
    method: 'PUT',
    path: '/service-categories/{id}',
    handler: serviceHandler.updateServiceCategory,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['service:update_category']) }
      ],
      validate: {
        params: serviceValidator.getServiceCategoryById,
        payload: serviceValidator.updateServiceCategory
      },
      tags: ['service-categories']
    }
  },
  {
    method: 'DELETE',
    path: '/service-categories/{id}',
    handler: serviceHandler.deleteServiceCategory,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['service:delete_category']) }
      ],
      validate: {
        params: serviceValidator.deleteServiceCategory
      },
      tags: ['service-categories']
    }
  },

  // === SERVICE PRICING ROUTES ===
  {
    method: 'GET',
    path: '/service-pricing',
    handler: serviceHandler.getServicePricing,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: serviceValidator.getServicePricing
      },
      tags: ['service-pricing']
    }
  },
  {
    method: 'GET',
    path: '/service-pricing/{id}',
    handler: serviceHandler.getServicePricingById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: serviceValidator.getServicePricingById
      },
      tags: ['service-pricing']
    }
  },
  {
    method: 'POST',
    path: '/service-pricing',
    handler: serviceHandler.createServicePricing,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['service:create_pricing']) }
      ],
      validate: {
        payload: serviceValidator.createServicePricing
      },
      tags: ['service-pricing']
    }
  },
  {
    method: 'PUT',
    path: '/service-pricing/{id}',
    handler: serviceHandler.updateServicePricing,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['service:update_pricing']) }
      ],
      validate: {
        params: serviceValidator.getServicePricingById,
        payload: serviceValidator.updateServicePricing
      },
      tags: ['service-pricing']
    }
  },
  {
    method: 'DELETE',
    path: '/service-pricing/{id}',
    handler: serviceHandler.deleteServicePricing,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['service:delete_pricing']) }
      ],
      validate: {
        params: serviceValidator.deleteServicePricing
      },
      tags: ['service-pricing']
    }
  },

  // === SERVICE TEMPLATES ROUTES ===
  {
    method: 'GET',
    path: '/service-templates',
    handler: serviceHandler.getServiceTemplates,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: serviceValidator.getServiceTemplates
      },
      tags: ['service-templates']
    }
  },
  {
    method: 'GET',
    path: '/service-templates/{id}',
    handler: serviceHandler.getServiceTemplateById,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: serviceValidator.getServiceTemplateById
      },
      tags: ['service-templates']
    }
  },
  {
    method: 'POST',
    path: '/service-templates',
    handler: serviceHandler.createServiceTemplate,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['service:create_template']) }
      ],
      validate: {
        payload: serviceValidator.createServiceTemplate
      },
      tags: ['service-templates']
    }
  },
  {
    method: 'PUT',
    path: '/service-templates/{id}',
    handler: serviceHandler.updateServiceTemplate,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['service:update_template']) }
      ],
      validate: {
        params: serviceValidator.getServiceTemplateById,
        payload: serviceValidator.updateServiceTemplate
      },
      tags: ['service-templates']
    }
  },
  {
    method: 'DELETE',
    path: '/service-templates/{id}',
    handler: serviceHandler.deleteServiceTemplate,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) },
        { method: permissionBasedAccess(['service:delete_template']) }
      ],
      validate: {
        params: serviceValidator.deleteServiceTemplate
      },
      tags: ['service-templates']
    }
  },

  // === SERVICE STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/services/statistics',
    handler: serviceHandler.getServiceStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: serviceValidator.getServiceStatistics
      },
      tags: ['service-statistics']
    }
  },
  {
    method: 'GET',
    path: '/service-categories/statistics',
    handler: serviceHandler.getServiceCategoryStatistics,
    options: {
      auth: 'jwt',
      pre: [
        { method: tenantIsolation },
        { method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: serviceValidator.getServiceCategoryStatistics
      },
      tags: ['service-statistics']
    }
  }
];

module.exports = routes;
