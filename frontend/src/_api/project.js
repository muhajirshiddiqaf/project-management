import api from './common';

class ProjectAPI {
  constructor() {
    this.endpoint = '/projects';
  }

  // Get all projects with pagination and filters
  async getAllProjects(params = {}) {
    return api.getPaginated(this.endpoint, params.page, params.limit, params);
  }

  // Get project by ID
  async getProjectById(id) {
    return api.get(`${this.endpoint}/${id}`);
  }

  // Create new project
  async createProject(projectData) {
    return api.post(this.endpoint, projectData);
  }

  // Update project
  async updateProject(id, projectData) {
    return api.put(`${this.endpoint}/${id}`, projectData);
  }

  // Delete project
  async deleteProject(id) {
    return api.delete(`${this.endpoint}/${id}`);
  }

  // Search projects
  async searchProjects(searchTerm, filters = {}) {
    return api.search(this.endpoint, searchTerm, filters);
  }

  // Get project statistics
  async getProjectStats() {
    return api.get(`${this.endpoint}/stats`);
  }

  // Export projects
  async exportProjects(format = 'csv', filters = {}) {
    return api.exportData(this.endpoint, format, filters);
  }

  // Get project costs
  async getProjectCosts(id) {
    return api.get(`${this.endpoint}/${id}/costs`);
  }

  // Calculate project cost
  async calculateProjectCost(projectData) {
    return api.post(`${this.endpoint}/calculate-cost`, projectData);
  }

  // Get project team
  async getProjectTeam(id) {
    return api.get(`${this.endpoint}/${id}/team`);
  }

  // Add team member to project
  async addTeamMember(id, memberData) {
    return api.post(`${this.endpoint}/${id}/team`, memberData);
  }

  // Remove team member from project
  async removeTeamMember(id, memberId) {
    return api.delete(`${this.endpoint}/${id}/team/${memberId}`);
  }

  // Get project timeline
  async getProjectTimeline(id) {
    return api.get(`${this.endpoint}/${id}/timeline`);
  }

  // Update project status
  async updateProjectStatus(id, status) {
    return api.patch(`${this.endpoint}/${id}/status`, { status });
  }

  // Get project files
  async getProjectFiles(id) {
    return api.get(`${this.endpoint}/${id}/files`);
  }

  // Upload project file
  async uploadProjectFile(id, file, onProgress) {
    return api.upload(`${this.endpoint}/${id}/files`, file, onProgress);
  }

  // Delete project file
  async deleteProjectFile(id, fileId) {
    return api.delete(`${this.endpoint}/${id}/files/${fileId}`);
  }
}

export default new ProjectAPI();
