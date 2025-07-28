const Boom = require('@hapi/boom');

class ClientHandler {
  constructor() {
    this.clientRepository = null;
  }

  // Set repository (dependency injection)
  setClientRepository(clientRepository) {
    this.clientRepository = clientRepository;
  }

  // Get all clients
  async getClients(request, h) {
    try {
      const { organizationId } = request;
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = request.query;

      const clients = await this.clientRepository.findAll(organizationId, {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
      });

      return h.response({
        success: true,
        message: 'Clients retrieved successfully',
        data: clients
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve clients');
    }
  }

  // Get client by ID
  async getClientById(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const client = await this.clientRepository.findById(id, organizationId);

      if (!client) {
        throw Boom.notFound('Client not found');
      }

      return h.response({
        success: true,
        message: 'Client retrieved successfully',
        data: client
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to retrieve client');
    }
  }

  // Create new client
  async createClient(request, h) {
    try {
      const { organizationId } = request;
      const clientData = request.payload;

      const client = await this.clientRepository.create({
        ...clientData,
        organization_id: organizationId
      });

      return h.response({
        success: true,
        message: 'Client created successfully',
        data: client
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to create client');
    }
  }

  // Update client
  async updateClient(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const updateData = request.payload;

      const client = await this.clientRepository.update(id, organizationId, updateData);

      if (!client) {
        throw Boom.notFound('Client not found');
      }

      return h.response({
        success: true,
        message: 'Client updated successfully',
        data: client
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update client');
    }
  }

  // Delete client
  async deleteClient(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const deleted = await this.clientRepository.delete(id, organizationId);

      if (!deleted) {
        throw Boom.notFound('Client not found');
      }

      return h.response({
        success: true,
        message: 'Client deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete client');
    }
  }

  // Search clients
  async searchClients(request, h) {
    try {
      const { organizationId } = request;
      const { q, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = request.query;

      const clients = await this.clientRepository.search(organizationId, q, {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
      });

      return h.response({
        success: true,
        message: 'Clients search completed',
        data: clients
      });
    } catch (error) {
      throw Boom.internal('Failed to search clients');
    }
  }
}

module.exports = new ClientHandler();
