import api from './common';

class ClientAPI {
  constructor() {
    this.endpoint = '/clients';
  }

  // Get all clients with pagination and filters
  async getAllClients(params = {}) {
    return api.getPaginated(this.endpoint, params.page, params.limit, params);
  }

  // Get client by ID
  async getClientById(id) {
    return api.get(`${this.endpoint}/${id}`);
  }

  // Create new client
  async createClient(clientData) {
    return api.post(this.endpoint, clientData);
  }

  // Update client
  async updateClient(id, clientData) {
    return api.put(`${this.endpoint}/${id}`, clientData);
  }

  // Delete client
  async deleteClient(id) {
    return api.delete(`${this.endpoint}/${id}`);
  }

  // Search clients
  async searchClients(searchTerm, filters = {}) {
    return api.search(this.endpoint, searchTerm, filters);
  }

  // Get client statistics
  async getClientStats() {
    return api.get(`${this.endpoint}/stats`);
  }

  // Export clients
  async exportClients(format = 'csv', filters = {}) {
    return api.exportData(this.endpoint, format, filters);
  }

  // Import clients
  async importClients(file, onProgress) {
    return api.upload(`${this.endpoint}/import`, file, onProgress);
  }

  // Get client activity
  async getClientActivity(id) {
    return api.get(`${this.endpoint}/${id}/activity`);
  }

  // Get client orders
  async getClientOrders(id, params = {}) {
    return api.getPaginated(`${this.endpoint}/${id}/orders`, params.page, params.limit, params);
  }

  // Get client invoices
  async getClientInvoices(id, params = {}) {
    return api.getPaginated(`${this.endpoint}/${id}/invoices`, params.page, params.limit, params);
  }

  // Get client projects
  async getClientProjects(id, params = {}) {
    return api.getPaginated(`${this.endpoint}/${id}/projects`, params.page, params.limit, params);
  }

  // Get client tickets
  async getClientTickets(id, params = {}) {
    return api.getPaginated(`${this.endpoint}/${id}/tickets`, params.page, params.limit, params);
  }
}

export default new ClientAPI();
