const routes = (handler, auth) => [
  // === SERVICE CRUD ROUTES ===
  {
    method: 'GET',
    path: '/services',
    handler: handler.getServices,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getServices
      },
      tags: ['services']
    }
  },
  {
    method: 'GET',
    path: '/services/{id}',
    handler: handler.getServiceById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: auth.getServiceById
      },
      tags: ['services']
    }
  },
  {
    method: 'POST',
    path: '/services',
    handler: handler.createService,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['service:create']) }
      ],
      validate: {
        payload: auth.createService
      },
      tags: ['services']
    }
  },
  {
    method: 'PUT',
    path: '/services/{id}',
    handler: handler.updateService,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['service:update']) }
      ],
      validate: {
        params: auth.getServiceById,
        payload: auth.updateService
      },
      tags: ['services']
    }
  },
  {
    method: 'DELETE',
    path: '/services/{id}',
    handler: handler.deleteService,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['service:delete']) }
      ],
      validate: {
        params: auth.deleteService
      },
      tags: ['services']
    }
  },
  {
    method: 'GET',
    path: '/services/search',
    handler: handler.searchServices,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.searchServices
      },
      tags: ['services']
    }
  },
  {
    method: 'PUT',
    path: '/services/{id}/status',
    handler: handler.updateServiceStatus,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['service:update_status']) }
      ],
      validate: {
        params: auth.getServiceById,
        payload: auth.updateServiceStatus
      },
      tags: ['services']
    }
  },

  // === SERVICE CATEGORIES ROUTES ===
  {
    method: 'GET',
    path: '/service-categories',
    handler: handler.getServiceCategories,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getServiceCategories
      },
      tags: ['service-categories']
    }
  },
  {
    method: 'GET',
    path: '/service-categories/{id}',
    handler: handler.getServiceCategoryById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: auth.getServiceCategoryById
      },
      tags: ['service-categories']
    }
  },
  {
    method: 'POST',
    path: '/service-categories',
    handler: handler.createServiceCategory,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['service:create_category']) }
      ],
      validate: {
        payload: auth.createServiceCategory
      },
      tags: ['service-categories']
    }
  },
  {
    method: 'PUT',
    path: '/service-categories/{id}',
    handler: handler.updateServiceCategory,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['service:update_category']) }
      ],
      validate: {
        params: auth.getServiceCategoryById,
        payload: auth.updateServiceCategory
      },
      tags: ['service-categories']
    }
  },
  {
    method: 'DELETE',
    path: '/service-categories/{id}',
    handler: handler.deleteServiceCategory,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['service:delete_category']) }
      ],
      validate: {
        params: auth.deleteServiceCategory
      },
      tags: ['service-categories']
    }
  },

  // === SERVICE PRICING ROUTES ===
  {
    method: 'GET',
    path: '/service-pricing',
    handler: handler.getServicePricing,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getServicePricing
      },
      tags: ['service-pricing']
    }
  },
  {
    method: 'GET',
    path: '/service-pricing/{id}',
    handler: handler.getServicePricingById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: auth.getServicePricingById
      },
      tags: ['service-pricing']
    }
  },
  {
    method: 'POST',
    path: '/service-pricing',
    handler: handler.createServicePricing,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['service:create_pricing']) }
      ],
      validate: {
        payload: auth.createServicePricing
      },
      tags: ['service-pricing']
    }
  },
  {
    method: 'PUT',
    path: '/service-pricing/{id}',
    handler: handler.updateServicePricing,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['service:update_pricing']) }
      ],
      validate: {
        params: auth.getServicePricingById,
        payload: auth.updateServicePricing
      },
      tags: ['service-pricing']
    }
  },
  {
    method: 'DELETE',
    path: '/service-pricing/{id}',
    handler: handler.deleteServicePricing,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['service:delete_pricing']) }
      ],
      validate: {
        params: auth.deleteServicePricing
      },
      tags: ['service-pricing']
    }
  },

  // === SERVICE TEMPLATES ROUTES ===
  {
    method: 'GET',
    path: '/service-templates',
    handler: handler.getServiceTemplates,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        query: auth.getServiceTemplates
      },
      tags: ['service-templates']
    }
  },
  {
    method: 'GET',
    path: '/service-templates/{id}',
    handler: handler.getServiceTemplateById,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager', 'user']) }
      ],
      validate: {
        params: auth.getServiceTemplateById
      },
      tags: ['service-templates']
    }
  },
  {
    method: 'POST',
    path: '/service-templates',
    handler: handler.createServiceTemplate,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['service:create_template']) }
      ],
      validate: {
        payload: auth.createServiceTemplate
      },
      tags: ['service-templates']
    }
  },
  {
    method: 'PUT',
    path: '/service-templates/{id}',
    handler: handler.updateServiceTemplate,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['service:update_template']) }
      ],
      validate: {
        params: auth.getServiceTemplateById,
        payload: auth.updateServiceTemplate
      },
      tags: ['service-templates']
    }
  },
  {
    method: 'DELETE',
    path: '/service-templates/{id}',
    handler: handler.deleteServiceTemplate,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) },
        //{ method: permissionBasedAccess(['service:delete_template']) }
      ],
      validate: {
        params: auth.deleteServiceTemplate
      },
      tags: ['service-templates']
    }
  },

  // === SERVICE STATISTICS ROUTES ===
  {
    method: 'GET',
    path: '/services/statistics',
    handler: handler.getServiceStatistics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getServiceStatistics
      },
      tags: ['service-statistics']
    }
  },
  {
    method: 'GET',
    path: '/service-categories/statistics',
    handler: handler.getServiceCategoryStatistics,
    options: {
      auth: 'jwt',
      pre: [
       // //{ method: tenantIsolation },
        //{ method: roleBasedAccess(['admin', 'manager']) }
      ],
      validate: {
        query: auth.getServiceCategoryStatistics
      },
      tags: ['service-statistics']
    }
  }
];

module.exports = routes;
