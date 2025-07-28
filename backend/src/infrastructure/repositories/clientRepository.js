const { queries } = require('../database/queries');

class ClientRepository {
  constructor(db) {
    this.db = db;
  }

  // Find all clients for organization
  async findAll(organizationId, options = {}) {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.client.findAllClients, [
        organizationId,
        limit,
        offset,
        sortBy,
        sortOrder
      ]);

      const countResult = await this.db.query(queries.client.countClients, [organizationId]);
      const total = parseInt(countResult.rows[0].count);

      return {
        clients: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error('Failed to retrieve clients');
    }
  }

  // Find client by ID
  async findById(id, organizationId) {
    try {
      const result = await this.db.query(queries.client.findClientById, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to retrieve client');
    }
  }

  // Create new client
  async create(clientData) {
    try {
      const result = await this.db.query(queries.client.createClient, [
        clientData.name,
        clientData.email,
        clientData.phone,
        clientData.address,
        clientData.company,
        clientData.website,
        clientData.notes,
        clientData.organization_id
      ]);

      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to create client');
    }
  }

  // Update client
  async update(id, organizationId, updateData) {
    try {
      const result = await this.db.query(queries.client.updateClient, [
        id,
        organizationId,
        updateData.name,
        updateData.email,
        updateData.phone,
        updateData.address,
        updateData.company,
        updateData.website,
        updateData.notes
      ]);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to update client');
    }
  }

  // Delete client
  async delete(id, organizationId) {
    try {
      const result = await this.db.query(queries.client.deleteClient, [id, organizationId]);
      return result.rowCount > 0;
    } catch (error) {
      throw new Error('Failed to delete client');
    }
  }

  // Search clients
  async search(organizationId, searchTerm, options = {}) {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;

    try {
      const result = await this.db.query(queries.client.searchClients, [
        organizationId,
        searchTerm,
        limit,
        offset,
        sortBy,
        sortOrder
      ]);

      const countResult = await this.db.query(queries.client.countSearchClients, [organizationId, searchTerm]);
      const total = parseInt(countResult.rows[0].count);

      return {
        clients: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error('Failed to search clients');
    }
  }
}

module.exports = ClientRepository;
