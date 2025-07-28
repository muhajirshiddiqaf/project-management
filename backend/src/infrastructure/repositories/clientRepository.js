const { queries } = require('../database/queries');

class ClientRepository {
  constructor(db) {
    this.db = db;
  }

  // === CLIENT CRUD METHODS ===

  async findAll(organizationId, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const offset = (page - 1) * limit;

      const result = await this.db.query(queries.client.findAllClients, [
        organizationId,
        limit,
        offset
      ]);

      const countResult = await this.db.query(queries.client.countClients, [organizationId]);
      const totalCount = parseInt(countResult.rows[0].count, 10);

      return {
        clients: result.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      throw new Error('Failed to find clients');
    }
  }

  async findById(id, organizationId) {
    try {
      const result = await this.db.query(queries.client.findClientById, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to find client by ID');
    }
  }

  async create(clientData) {
    try {
      const result = await this.db.query(queries.client.createClient, [
        clientData.organization_id,
        clientData.name,
        clientData.company_name,
        clientData.email,
        clientData.phone,
        clientData.address,
        clientData.city,
        clientData.state,
        clientData.country,
        clientData.postal_code,
        clientData.website,
        clientData.industry,
        clientData.client_type,
        clientData.status,
        clientData.source,
        clientData.notes,
        clientData.tags
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to create client');
    }
  }

  async update(id, organizationId, updateData) {
    try {
      const result = await this.db.query(queries.client.updateClient, [
        id,
        organizationId,
        updateData.name,
        updateData.company_name,
        updateData.email,
        updateData.phone,
        updateData.address,
        updateData.city,
        updateData.state,
        updateData.country,
        updateData.postal_code,
        updateData.website,
        updateData.industry,
        updateData.client_type,
        updateData.status,
        updateData.source,
        updateData.notes,
        updateData.tags
      ]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to update client');
    }
  }

  async delete(id, organizationId) {
    try {
      const result = await this.db.query(queries.client.deleteClient, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to delete client');
    }
  }

  async search(organizationId, searchTerm, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const offset = (page - 1) * limit;
      const searchPattern = `%${searchTerm}%`;

      const result = await this.db.query(queries.client.searchClients, [
        organizationId,
        searchPattern,
        limit,
        offset
      ]);

      const countResult = await this.db.query(queries.client.countSearchClients, [
        organizationId,
        searchPattern
      ]);
      const totalCount = parseInt(countResult.rows[0].count, 10);

      return {
        clients: result.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      throw new Error('Failed to search clients');
    }
  }

  // === CLIENT CONTACTS METHODS ===

  async getContacts(clientId, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const offset = (page - 1) * limit;

      const result = await this.db.query(queries.client.findAllClientContacts, [
        clientId,
        limit,
        offset
      ]);

      const countResult = await this.db.query(queries.client.countClientContacts, [clientId]);
      const totalCount = parseInt(countResult.rows[0].count, 10);

      return {
        contacts: result.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      throw new Error('Failed to get client contacts');
    }
  }

  async getContactById(id) {
    try {
      const result = await this.db.query(queries.client.findClientContactById, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to find client contact by ID');
    }
  }

  async createContact(contactData) {
    try {
      const result = await this.db.query(queries.client.createClientContact, [
        contactData.client_id,
        contactData.name,
        contactData.email,
        contactData.phone,
        contactData.position,
        contactData.is_primary
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to create client contact');
    }
  }

  async updateContact(id, organizationId, updateData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(updateData[key]);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      fields.push('updated_at = NOW()');
      values.push(id, organizationId);

      const query = `UPDATE client_contacts SET ${fields.join(', ')} WHERE id = $${paramCount} AND organization_id = $${paramCount + 1} RETURNING *`;
      const result = await this.db.query(query, values);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to update client contact');
    }
  }

  async deleteContact(id, organizationId) {
    try {
      const result = await this.db.query(queries.client.deleteClientContact, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to delete client contact');
    }
  }

  // === CLIENT COMMUNICATIONS METHODS ===

  async getCommunications(clientId, organizationId, options = {}) {
    try {
      const { type, direction, page = 1, limit = 10 } = options;
      const offset = (page - 1) * limit;

      const result = await this.db.query(queries.client.findAllClientCommunications, [
        clientId,
        organizationId,
        type,
        direction,
        limit,
        offset
      ]);

      const countResult = await this.db.query(queries.client.countClientCommunications, [clientId, organizationId, type, direction]);
      const totalCount = parseInt(countResult.rows[0].count, 10);

      return {
        communications: result.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      throw new Error('Failed to get client communications');
    }
  }

  async getCommunicationById(id, organizationId) {
    try {
      const result = await this.db.query(queries.client.findClientCommunicationById, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to find client communication by ID');
    }
  }

  async createCommunication(communicationData) {
    try {
      const result = await this.db.query(queries.client.createClientCommunication, [
        communicationData.client_id,
        communicationData.type,
        communicationData.subject,
        communicationData.content,
        communicationData.direction,
        communicationData.contact_id,
        communicationData.scheduled_follow_up,
        communicationData.notes,
        communicationData.organization_id,
        communicationData.created_by
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to create client communication');
    }
  }

  async updateCommunication(id, organizationId, updateData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(updateData[key]);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      fields.push('updated_at = NOW()');
      values.push(id, organizationId);

      const query = `UPDATE client_communications SET ${fields.join(', ')} WHERE id = $${paramCount} AND organization_id = $${paramCount + 1} RETURNING *`;
      const result = await this.db.query(query, values);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to update client communication');
    }
  }

  async deleteCommunication(id, organizationId) {
    try {
      const result = await this.db.query(queries.client.deleteClientCommunication, [id, organizationId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Failed to delete client communication');
    }
  }

  // === CLIENT IMPORT/EXPORT METHODS ===

  async importClients(file, organizationId) {
    try {
      // This is a placeholder implementation
      // In a real implementation, you would:
      // 1. Parse the uploaded file (CSV, Excel, etc.)
      // 2. Validate the data
      // 3. Insert into database
      // 4. Handle errors and rollback if needed

      return {
        success: true,
        imported: 0,
        errors: [],
        message: 'Import functionality to be implemented'
      };
    } catch (error) {
      throw new Error('Failed to import clients');
    }
  }

  async exportClients(organizationId, format = 'csv', filters = {}) {
    try {
      // This is a placeholder implementation
      // In a real implementation, you would:
      // 1. Query clients based on filters
      // 2. Format data according to format type
      // 3. Generate file and return

      const clients = await this.findAll(organizationId, { page: 1, limit: 1000 });

      let data, contentType, filename;

      switch (format) {
        case 'csv':
          data = this.convertToCSV(clients.clients);
          contentType = 'text/csv';
          filename = `clients_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'xlsx':
          data = this.convertToXLSX(clients.clients);
          contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          filename = `clients_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        case 'json':
          data = JSON.stringify(clients.clients, null, 2);
          contentType = 'application/json';
          filename = `clients_${new Date().toISOString().split('T')[0]}.json`;
          break;
        default:
          throw new Error('Unsupported export format');
      }

      return {
        data,
        contentType,
        filename
      };
    } catch (error) {
      throw new Error('Failed to export clients');
    }
  }

  // Helper methods for export
  convertToCSV(clients) {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Website', 'Created At'];
    const rows = clients.map(client => [
      client.id,
      client.name,
      client.email,
      client.phone || '',
      client.company || '',
      client.website || '',
      client.created_at
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  convertToXLSX(clients) {
    // Placeholder - would use a library like xlsx
    return this.convertToCSV(clients);
  }
}

module.exports = ClientRepository;
