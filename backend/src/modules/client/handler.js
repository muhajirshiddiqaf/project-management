const Boom = require('@hapi/boom');

class ClientHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // Bind all methods to preserve 'this' context
    this.getClients = this.getClients.bind(this);
    this.getClientById = this.getClientById.bind(this);
    this.createClient = this.createClient.bind(this);
    this.updateClient = this.updateClient.bind(this);
    this.deleteClient = this.deleteClient.bind(this);
    this.searchClients = this.searchClients.bind(this);
    this.getClientContacts = this.getClientContacts.bind(this);
    this.getClientContactById = this.getClientContactById.bind(this);
    this.createClientContact = this.createClientContact.bind(this);
    this.updateClientContact = this.updateClientContact.bind(this);
    this.deleteClientContact = this.deleteClientContact.bind(this);
    this.getClientCommunications = this.getClientCommunications.bind(this);
    this.getClientCommunicationById = this.getClientCommunicationById.bind(this);
    this.createClientCommunication = this.createClientCommunication.bind(this);
    this.updateClientCommunication = this.updateClientCommunication.bind(this);
    this.deleteClientCommunication = this.deleteClientCommunication.bind(this);
    this.importClients = this.importClients.bind(this);
    this.exportClients = this.exportClients.bind(this);
  }

  // Get all clients
  async getClients(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { page = 1, limit = 10 } = request.query;

      const clients = await this._service.findAll(organizationId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
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
      const { organizationId } = request.auth.credentials;
      const { id } = request.params;

      const client = await this._service.findById(id, organizationId);

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
      const { organizationId } = request.auth.credentials;
      const clientData = request.payload;

      const client = await this._service.create({
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
      const { organizationId } = request.auth.credentials;
      const { id } = request.params;
      const updateData = request.payload;

      const client = await this._service.update(id, organizationId, updateData);

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
      const { organizationId } = request.auth.credentials;
      const { id } = request.params;

      const deleted = await this._service.delete(id, organizationId);

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
      const { organizationId } = request.auth.credentials;
      const { q, page = 1, limit = 10 } = request.query;

      const clients = await this._service.search(organizationId, q, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
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

  // === CLIENT CONTACTS ===

  // Get client contacts
  async getClientContacts(request, h) {
    try {
      const { organizationId } = request;
      const { client_id } = request.query;
      const { page = 1, limit = 10 } = request.query;

      const contacts = await this._service.getContacts(client_id, organizationId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
      });

      return h.response({
        success: true,
        message: 'Client contacts retrieved successfully',
        data: contacts
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve client contacts');
    }
  }

  // Get client contact by ID
  async getClientContactById(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const contact = await this._service.getContactById(id, organizationId);

      if (!contact) {
        throw Boom.notFound('Client contact not found');
      }

      return h.response({
        success: true,
        message: 'Client contact retrieved successfully',
        data: contact
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to retrieve client contact');
    }
  }

  // Create client contact
  async createClientContact(request, h) {
    try {
      const { organizationId } = request;
      const contactData = request.payload;

      const contact = await this._service.createContact({
        ...contactData,
        organization_id: organizationId
      });

      return h.response({
        success: true,
        message: 'Client contact created successfully',
        data: contact
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to create client contact');
    }
  }

  // Update client contact
  async updateClientContact(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const updateData = request.payload;

      const contact = await this._service.updateContact(id, organizationId, updateData);

      if (!contact) {
        throw Boom.notFound('Client contact not found');
      }

      return h.response({
        success: true,
        message: 'Client contact updated successfully',
        data: contact
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update client contact');
    }
  }

  // Delete client contact
  async deleteClientContact(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const deleted = await this._service.deleteContact(id, organizationId);

      if (!deleted) {
        throw Boom.notFound('Client contact not found');
      }

      return h.response({
        success: true,
        message: 'Client contact deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete client contact');
    }
  }

  // === CLIENT COMMUNICATIONS ===

  // Get client communications
  async getClientCommunications(request, h) {
    try {
      const { organizationId } = request;
      const { client_id, type, direction, page = 1, limit = 10 } = request.query;

      const communications = await this._service.getCommunications(client_id, organizationId, {
        type,
        direction,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
      });

      return h.response({
        success: true,
        message: 'Client communications retrieved successfully',
        data: communications
      });
    } catch (error) {
      throw Boom.internal('Failed to retrieve client communications');
    }
  }

  // Get client communication by ID
  async getClientCommunicationById(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const communication = await this._service.getCommunicationById(id, organizationId);

      if (!communication) {
        throw Boom.notFound('Client communication not found');
      }

      return h.response({
        success: true,
        message: 'Client communication retrieved successfully',
        data: communication
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to retrieve client communication');
    }
  }

  // Create client communication
  async createClientCommunication(request, h) {
    try {
      const { organizationId, userId } = request;
      const communicationData = request.payload;

      const communication = await this._service.createCommunication({
        ...communicationData,
        organization_id: organizationId,
        created_by: userId
      });

      return h.response({
        success: true,
        message: 'Client communication created successfully',
        data: communication
      }).code(201);
    } catch (error) {
      throw Boom.internal('Failed to create client communication');
    }
  }

  // Update client communication
  async updateClientCommunication(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;
      const updateData = request.payload;

      const communication = await this._service.updateCommunication(id, organizationId, updateData);

      if (!communication) {
        throw Boom.notFound('Client communication not found');
      }

      return h.response({
        success: true,
        message: 'Client communication updated successfully',
        data: communication
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to update client communication');
    }
  }

  // Delete client communication
  async deleteClientCommunication(request, h) {
    try {
      const { organizationId } = request;
      const { id } = request.params;

      const deleted = await this._service.deleteCommunication(id, organizationId);

      if (!deleted) {
        throw Boom.notFound('Client communication not found');
      }

      return h.response({
        success: true,
        message: 'Client communication deleted successfully'
      });
    } catch (error) {
      if (error.isBoom) throw error;
      throw Boom.internal('Failed to delete client communication');
    }
  }

  // === CLIENT IMPORT/EXPORT ===

  // Import clients
  async importClients(request, h) {
    try {
      const { organizationId } = request;
      const { file } = request.payload;

      const result = await this._service.importClients(file, organizationId);

      return h.response({
        success: true,
        message: 'Clients imported successfully',
        data: result
      });
    } catch (error) {
      throw Boom.internal('Failed to import clients');
    }
  }

  // Export clients
  async exportClients(request, h) {
    try {
      const { organizationId } = request;
      const { format = 'csv', filters } = request.query;

      const result = await this._service.exportClients(organizationId, format, filters);

      return h.response(result.data)
        .header('Content-Type', result.contentType)
        .header('Content-Disposition', `attachment; filename="${result.filename}"`);
    } catch (error) {
      throw Boom.internal('Failed to export clients');
    }
  }
}

module.exports = ClientHandler;
