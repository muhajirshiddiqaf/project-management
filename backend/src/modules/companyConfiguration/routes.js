const routes = (handler, auth) => [
  {
    method: 'GET',
    path: '/company-configuration',
    handler: handler.getCompanyConfiguration,
    options: {
      auth: 'jwt',
      tags: ['api', 'company-configuration'],
      description: 'Get company configuration'
    }
  },
  {
    method: 'POST',
    path: '/company-configuration',
    handler: handler.createCompanyConfiguration,
    options: {
      auth: 'jwt',
      tags: ['api', 'company-configuration'],
      description: 'Create company configuration',
      validate: {
        payload: auth.createCompanyConfiguration
      }
    }
  },
  {
    method: 'PUT',
    path: '/company-configuration/{id}',
    handler: handler.updateCompanyConfiguration,
    options: {
      auth: 'jwt',
      tags: ['api', 'company-configuration'],
      description: 'Update company configuration',
      validate: {
        params: auth.updateCompanyConfiguration,
        payload: auth.updateCompanyConfiguration
      }
    }
  },
  {
    method: 'DELETE',
    path: '/company-configuration/{id}',
    handler: handler.deleteCompanyConfiguration,
    options: {
      auth: 'jwt',
      tags: ['api', 'company-configuration'],
      description: 'Delete company configuration',
      validate: {
        params: auth.deleteCompanyConfiguration
      }
    }
  }
];

module.exports = routes;
