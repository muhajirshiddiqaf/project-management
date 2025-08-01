const Boom = require('@hapi/boom');
const { getCredentials, getUserId, getOrganizationId } = require('../../utils/auth');

class CompanyConfigurationHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // Bind all methods to preserve 'this' context
    this.getCompanyConfiguration = this.getCompanyConfiguration.bind(this);
    this.createCompanyConfiguration = this.createCompanyConfiguration.bind(this);
    this.updateCompanyConfiguration = this.updateCompanyConfiguration.bind(this);
    this.deleteCompanyConfiguration = this.deleteCompanyConfiguration.bind(this);
  }

  // Get company configuration
  async getCompanyConfiguration(request, h) {
    try {
      const organizationId = getOrganizationId(request);

      const configuration = await this._service.getByOrganizationId(organizationId);

      if (!configuration) {
        return h.response({
          success: false,
          message: 'Company configuration not found'
        }).code(404);
      }

      return h.response({
        success: true,
        data: configuration
      });
    } catch (error) {
      console.error('Error getting company configuration:', error);
      throw Boom.internal('Failed to get company configuration');
    }
  }

  // Create company configuration
  async createCompanyConfiguration(request, h) {
    try {
      const { organizationId, userId } = request.auth.credentials;
      const configurationData = request.payload;

      const configuration = await this._service.create({
        ...configurationData,
        organization_id: organizationId,
        created_by: userId
      });

      return h.response({
        success: true,
        message: 'Company configuration created successfully',
        data: configuration
      }).code(201);
    } catch (error) {
      console.error('Error creating company configuration:', error);
      throw Boom.internal('Failed to create company configuration');
    }
  }

  // Update company configuration
  async updateCompanyConfiguration(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { id } = request.params;
      const updateData = request.payload;

      // Check if configuration exists
      const existingConfig = await this._service.getByOrganizationId(organizationId);
      if (!existingConfig) {
        throw Boom.notFound('Company configuration not found');
      }

      const configuration = await this._service.update(id, updateData);

      return h.response({
        success: true,
        message: 'Company configuration updated successfully',
        data: configuration
      });
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error updating company configuration:', error);
      throw Boom.internal('Failed to update company configuration');
    }
  }

  // Delete company configuration
  async deleteCompanyConfiguration(request, h) {
    try {
      const { id } = request.params;

      const configuration = await this._service.delete(id);

      return h.response({
        success: true,
        message: 'Company configuration deleted successfully',
        data: configuration
      });
    } catch (error) {
      console.error('Error deleting company configuration:', error);
      throw Boom.internal('Failed to delete company configuration');
    }
  }
}

module.exports = CompanyConfigurationHandler;
