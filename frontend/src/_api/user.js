import api from './common';

class UserAPI {
  constructor() {
    this.endpoint = '/users';
  }

  // Get all users with pagination and filters
  async getAllUsers(params = {}) {
    return api.getPaginated(this.endpoint, params.page, params.limit, params);
  }

  // Get user by ID
  async getUserById(id) {
    return api.get(`${this.endpoint}/${id}`);
  }

  // Create new user
  async createUser(userData) {
    return api.post(this.endpoint, userData);
  }

  // Update user
  async updateUser(id, userData) {
    return api.put(`${this.endpoint}/${id}`, userData);
  }

  // Delete user
  async deleteUser(id) {
    return api.delete(`${this.endpoint}/${id}`);
  }

  // Search users
  async searchUsers(searchTerm, filters = {}) {
    return api.search(this.endpoint, searchTerm, filters);
  }

  // Get user statistics
  async getUserStats() {
    return api.get(`${this.endpoint}/stats`);
  }

  // Get current user profile
  async getCurrentUser() {
    return api.get(`${this.endpoint}/profile`);
  }

  // Update current user profile
  async updateCurrentUser(userData) {
    return api.put(`${this.endpoint}/profile`, userData);
  }

  // Change password
  async changePassword(passwordData) {
    return api.put(`${this.endpoint}/change-password`, passwordData);
  }
}

export default new UserAPI();
