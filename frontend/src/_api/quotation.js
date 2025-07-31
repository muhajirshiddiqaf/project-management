import api from './common';

class QuotationAPI {
  constructor() {
    this.endpoint = '/quotations';
  }

  async getAllQuotations(params = {}) {
    return api.getPaginated(this.endpoint, params.page, params.limit, params);
  }

  async getQuotationById(id) {
    return api.get(`${this.endpoint}/${id}`);
  }

  async createQuotation(data) {
    return api.post(this.endpoint, data);
  }

  async updateQuotation(id, data) {
    return api.put(`${this.endpoint}/${id}`, data);
  }

  async deleteQuotation(id) {
    return api.delete(`${this.endpoint}/${id}`);
  }

  async searchQuotations(params = {}) {
    return api.get(`${this.endpoint}/search`, params);
  }

  async generateFromProject(data) {
    return api.post(`${this.endpoint}/generate-from-project`, data);
  }

  async getQuotationItems(quotationId) {
    return api.get(`${this.endpoint}/${quotationId}/items`);
  }

  async createQuotationItem(quotationId, data) {
    return api.post(`${this.endpoint}/${quotationId}/items`, data);
  }

  async updateQuotationItem(quotationId, itemId, data) {
    return api.put(`${this.endpoint}/${quotationId}/items/${itemId}`, data);
  }

  async deleteQuotationItem(quotationId, itemId) {
    return api.delete(`${this.endpoint}/${quotationId}/items/${itemId}`);
  }

  async calculateTotals(quotationId) {
    return api.post(`${this.endpoint}/${quotationId}/calculate-totals`);
  }

  async updateStatus(quotationId, status) {
    return api.patch(`${this.endpoint}/${quotationId}/status`, { status });
  }

  async approveQuotation(quotationId) {
    return api.post(`${this.endpoint}/${quotationId}/approve`);
  }

  async rejectQuotation(quotationId) {
    return api.post(`${this.endpoint}/${quotationId}/reject`);
  }

  async sendQuotation(quotationId, data) {
    return api.post(`${this.endpoint}/${quotationId}/send`, data);
  }

  async getQuotationTemplates(params = {}) {
    return api.getPaginated(`${this.endpoint}/templates`, params.page, params.limit, params);
  }

  async createQuotationTemplate(data) {
    return api.post(`${this.endpoint}/templates`, data);
  }

  async updateQuotationTemplate(id, data) {
    return api.put(`${this.endpoint}/templates/${id}`, data);
  }

  async deleteQuotationTemplate(id) {
    return api.delete(`${this.endpoint}/templates/${id}`);
  }

  async getQuotationStatistics(params = {}) {
    return api.get(`${this.endpoint}/statistics`, params);
  }
}

export default new QuotationAPI();
