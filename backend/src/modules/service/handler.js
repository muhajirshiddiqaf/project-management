const Boom = require('@hapi/boom');

class ServiceHandler {
  constructor() {
    this.serviceRepository = null;
  }

  // Set repository (dependency injection)
  setServiceRepository(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  // === SERVICE CRUD METHODS ===
  async getServices(request, h) {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC', category_id, is_active, unit_type } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { category_id, is_active, unit_type };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sortBy, sortOrder };

      const services = await this.serviceRepository.findAll(organizationId, filters, pagination);
      const total = await this.serviceRepository.countServices(organizationId, filters);

      return h.response({
        success: true,
        data: services,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      }).code(200);
    } catch (error) {
      console.error('Error getting services:', error);
      throw Boom.internal('Failed to get services');
    }
  }

  async getServiceById(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const service = await this.serviceRepository.findById(id, organizationId);
      if (!service) {
        throw Boom.notFound('Service not found');
      }

      return h.response({
        success: true,
        data: service
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error getting service:', error);
      throw Boom.internal('Failed to get service');
    }
  }

  async createService(request, h) {
    try {
      const serviceData = {
        ...request.payload,
        organization_id: request.auth.credentials.organization_id,
        created_by: request.auth.credentials.user_id
      };

      const service = await this.serviceRepository.create(serviceData);

      return h.response({
        success: true,
        message: 'Service created successfully',
        data: service
      }).code(201);
    } catch (error) {
      console.error('Error creating service:', error);
      throw Boom.internal('Failed to create service');
    }
  }

  async updateService(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;
      const updateData = request.payload;

      const service = await this.serviceRepository.update(id, organizationId, updateData);
      if (!service) {
        throw Boom.notFound('Service not found');
      }

      return h.response({
        success: true,
        message: 'Service updated successfully',
        data: service
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error updating service:', error);
      throw Boom.internal('Failed to update service');
    }
  }

  async deleteService(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const service = await this.serviceRepository.delete(id, organizationId);
      if (!service) {
        throw Boom.notFound('Service not found');
      }

      return h.response({
        success: true,
        message: 'Service deleted successfully'
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error deleting service:', error);
      throw Boom.internal('Failed to delete service');
    }
  }

  async searchServices(request, h) {
    try {
      const { q, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      if (!q) {
        throw Boom.badRequest('Search query is required');
      }

      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sortBy, sortOrder };
      const services = await this.serviceRepository.search(organizationId, q, {}, pagination);
      const total = await this.serviceRepository.countSearchServices(organizationId, q, {});

      return h.response({
        success: true,
        data: services,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error searching services:', error);
      throw Boom.internal('Failed to search services');
    }
  }

  async updateServiceStatus(request, h) {
    try {
      const { id } = request.params;
      const { is_active } = request.payload;
      const organizationId = request.auth.credentials.organization_id;

      const service = await this.serviceRepository.updateStatus(id, organizationId, is_active);
      if (!service) {
        throw Boom.notFound('Service not found');
      }

      return h.response({
        success: true,
        message: 'Service status updated successfully',
        data: service
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error updating service status:', error);
      throw Boom.internal('Failed to update service status');
    }
  }

  // === SERVICE CATEGORIES METHODS ===
  async getServiceCategories(request, h) {
    try {
      const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC', parent_id, is_active } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { parent_id, is_active };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sortBy, sortOrder };

      const categories = await this.serviceRepository.getCategories(organizationId, filters, pagination);
      const total = await this.serviceRepository.countCategories(organizationId, filters);

      return h.response({
        success: true,
        data: categories,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      }).code(200);
    } catch (error) {
      console.error('Error getting service categories:', error);
      throw Boom.internal('Failed to get service categories');
    }
  }

  async getServiceCategoryById(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const category = await this.serviceRepository.getCategoryById(id, organizationId);
      if (!category) {
        throw Boom.notFound('Service category not found');
      }

      return h.response({
        success: true,
        data: category
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error getting service category:', error);
      throw Boom.internal('Failed to get service category');
    }
  }

  async createServiceCategory(request, h) {
    try {
      const categoryData = {
        ...request.payload,
        organization_id: request.auth.credentials.organization_id,
        created_by: request.auth.credentials.user_id
      };

      const category = await this.serviceRepository.createCategory(categoryData);

      return h.response({
        success: true,
        message: 'Service category created successfully',
        data: category
      }).code(201);
    } catch (error) {
      console.error('Error creating service category:', error);
      throw Boom.internal('Failed to create service category');
    }
  }

  async updateServiceCategory(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;
      const updateData = request.payload;

      const category = await this.serviceRepository.updateCategory(id, organizationId, updateData);
      if (!category) {
        throw Boom.notFound('Service category not found');
      }

      return h.response({
        success: true,
        message: 'Service category updated successfully',
        data: category
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error updating service category:', error);
      throw Boom.internal('Failed to update service category');
    }
  }

  async deleteServiceCategory(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const category = await this.serviceRepository.deleteCategory(id, organizationId);
      if (!category) {
        throw Boom.notFound('Service category not found');
      }

      return h.response({
        success: true,
        message: 'Service category deleted successfully'
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error deleting service category:', error);
      throw Boom.internal('Failed to delete service category');
    }
  }

  // === SERVICE PRICING METHODS ===
  async getServicePricing(request, h) {
    try {
      const { service_id } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      if (!service_id) {
        throw Boom.badRequest('Service ID is required');
      }

      const pricing = await this.serviceRepository.getServicePricing(service_id, organizationId);
      const total = await this.serviceRepository.countServicePricing(service_id, organizationId);

      return h.response({
        success: true,
        data: pricing,
        total
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error getting service pricing:', error);
      throw Boom.internal('Failed to get service pricing');
    }
  }

  async getServicePricingById(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const pricing = await this.serviceRepository.getServicePricingById(id, organizationId);
      if (!pricing) {
        throw Boom.notFound('Service pricing not found');
      }

      return h.response({
        success: true,
        data: pricing
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error getting service pricing:', error);
      throw Boom.internal('Failed to get service pricing');
    }
  }

  async createServicePricing(request, h) {
    try {
      const pricingData = {
        ...request.payload,
        organization_id: request.auth.credentials.organization_id,
        created_by: request.auth.credentials.user_id
      };

      const pricing = await this.serviceRepository.createServicePricing(pricingData);

      return h.response({
        success: true,
        message: 'Service pricing created successfully',
        data: pricing
      }).code(201);
    } catch (error) {
      console.error('Error creating service pricing:', error);
      throw Boom.internal('Failed to create service pricing');
    }
  }

  async updateServicePricing(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;
      const updateData = request.payload;

      const pricing = await this.serviceRepository.updateServicePricing(id, organizationId, updateData);
      if (!pricing) {
        throw Boom.notFound('Service pricing not found');
      }

      return h.response({
        success: true,
        message: 'Service pricing updated successfully',
        data: pricing
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error updating service pricing:', error);
      throw Boom.internal('Failed to update service pricing');
    }
  }

  async deleteServicePricing(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const pricing = await this.serviceRepository.deleteServicePricing(id, organizationId);
      if (!pricing) {
        throw Boom.notFound('Service pricing not found');
      }

      return h.response({
        success: true,
        message: 'Service pricing deleted successfully'
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error deleting service pricing:', error);
      throw Boom.internal('Failed to delete service pricing');
    }
  }

  // === SERVICE TEMPLATES METHODS ===
  async getServiceTemplates(request, h) {
    try {
      const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC', category_id, is_active } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { category_id, is_active };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10), sortBy, sortOrder };

      const templates = await this.serviceRepository.getServiceTemplates(organizationId, filters, pagination);
      const total = await this.serviceRepository.countServiceTemplates(organizationId, filters);

      return h.response({
        success: true,
        data: templates,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      }).code(200);
    } catch (error) {
      console.error('Error getting service templates:', error);
      throw Boom.internal('Failed to get service templates');
    }
  }

  async getServiceTemplateById(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const template = await this.serviceRepository.getServiceTemplateById(id, organizationId);
      if (!template) {
        throw Boom.notFound('Service template not found');
      }

      return h.response({
        success: true,
        data: template
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error getting service template:', error);
      throw Boom.internal('Failed to get service template');
    }
  }

  async createServiceTemplate(request, h) {
    try {
      const templateData = {
        ...request.payload,
        organization_id: request.auth.credentials.organization_id,
        created_by: request.auth.credentials.user_id
      };

      const template = await this.serviceRepository.createServiceTemplate(templateData);

      return h.response({
        success: true,
        message: 'Service template created successfully',
        data: template
      }).code(201);
    } catch (error) {
      console.error('Error creating service template:', error);
      throw Boom.internal('Failed to create service template');
    }
  }

  async updateServiceTemplate(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;
      const updateData = request.payload;

      const template = await this.serviceRepository.updateServiceTemplate(id, organizationId, updateData);
      if (!template) {
        throw Boom.notFound('Service template not found');
      }

      return h.response({
        success: true,
        message: 'Service template updated successfully',
        data: template
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error updating service template:', error);
      throw Boom.internal('Failed to update service template');
    }
  }

  async deleteServiceTemplate(request, h) {
    try {
      const { id } = request.params;
      const organizationId = request.auth.credentials.organization_id;

      const template = await this.serviceRepository.deleteServiceTemplate(id, organizationId);
      if (!template) {
        throw Boom.notFound('Service template not found');
      }

      return h.response({
        success: true,
        message: 'Service template deleted successfully'
      }).code(200);
    } catch (error) {
      if (error.isBoom) throw error;
      console.error('Error deleting service template:', error);
      throw Boom.internal('Failed to delete service template');
    }
  }

  // === SERVICE STATISTICS METHODS ===
  async getServiceStatistics(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { period = 'month', category_id } = request.query;

      const statistics = await this.serviceRepository.getServiceStatistics(organizationId, { period, category_id });

      return h.response({
        success: true,
        data: statistics
      }).code(200);
    } catch (error) {
      console.error('Error getting service statistics:', error);
      throw Boom.internal('Failed to get service statistics');
    }
  }

  async getServiceCategoryStatistics(request, h) {
    try {
      const organizationId = request.auth.credentials.organization_id;
      const { period = 'month' } = request.query;

      const statistics = await this.serviceRepository.getServiceCategoryStatistics(organizationId, { period });

      return h.response({
        success: true,
        data: statistics
      }).code(200);
    } catch (error) {
      console.error('Error getting service category statistics:', error);
      throw Boom.internal('Failed to get service category statistics');
    }
  }
}

module.exports = new ServiceHandler();
