import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

class ClientAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('access_token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...options
    };

    try {
      const response = await axios(url, config);
      return response.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error.response?.data || error;
    }
  }

  async getAllClients(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`/clients?${queryParams}`);
  }

  async getClientById(id) {
    return this.request(`/clients/${id}`);
  }

  async createClient(clientData) {
    return this.request('/clients', {
      method: 'POST',
      data: clientData
    });
  }

  async updateClient(id, clientData) {
    return this.request(`/clients/${id}`, {
      method: 'PUT',
      data: clientData
    });
  }

  async deleteClient(id) {
    return this.request(`/clients/${id}`, {
      method: 'DELETE'
    });
  }

  async searchClients(searchTerm) {
    return this.request(`/clients/search?q=${encodeURIComponent(searchTerm)}`);
  }
}

export default new ClientAPI();
