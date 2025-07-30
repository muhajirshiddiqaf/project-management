import api from './common';

class InvoiceAPI {
  constructor() {
    this.endpoint = '/invoices';
  }

  // Get all invoices with pagination and filters
  async getAllInvoices(params = {}) {
    return api.getPaginated(this.endpoint, params.page, params.limit, params);
  }

  // Get invoice by ID
  async getInvoiceById(id) {
    return api.get(`${this.endpoint}/${id}`);
  }

  // Create new invoice
  async createInvoice(invoiceData) {
    return api.post(this.endpoint, invoiceData);
  }

  // Update invoice
  async updateInvoice(id, invoiceData) {
    return api.put(`${this.endpoint}/${id}`, invoiceData);
  }

  // Delete invoice
  async deleteInvoice(id) {
    return api.delete(`${this.endpoint}/${id}`);
  }

  // Search invoices
  async searchInvoices(searchTerm, filters = {}) {
    return api.search(this.endpoint, searchTerm, filters);
  }

  // Get invoice statistics
  async getInvoiceStats() {
    return api.get(`${this.endpoint}/stats`);
  }

  // Export invoices
  async exportInvoices(format = 'csv', filters = {}) {
    return api.exportData(this.endpoint, format, filters);
  }

  // Update invoice status
  async updateInvoiceStatus(id, status) {
    return api.patch(`${this.endpoint}/${id}/status`, { status });
  }

  // Generate PDF
  async generatePDF(id) {
    return api.post(`${this.endpoint}/${id}/pdf`);
  }

  // Send invoice
  async sendInvoice(id, emailData) {
    return api.post(`${this.endpoint}/${id}/send`, emailData);
  }

  // Get invoice items
  async getInvoiceItems(invoiceId) {
    return api.get(`${this.endpoint}/${invoiceId}/items`);
  }

  // Add invoice item
  async addInvoiceItem(invoiceId, itemData) {
    return api.post(`${this.endpoint}/${invoiceId}/items`, itemData);
  }

  // Update invoice item
  async updateInvoiceItem(invoiceId, itemId, itemData) {
    return api.put(`${this.endpoint}/${invoiceId}/items/${itemId}`, itemData);
  }

  // Delete invoice item
  async deleteInvoiceItem(invoiceId, itemId) {
    return api.delete(`${this.endpoint}/${invoiceId}/items/${itemId}`);
  }

  // Get invoice history
  async getInvoiceHistory(id) {
    return api.get(`${this.endpoint}/${id}/history`);
  }

  // Add invoice note
  async addInvoiceNote(id, noteData) {
    return api.post(`${this.endpoint}/${id}/notes`, noteData);
  }

  // Get invoice notes
  async getInvoiceNotes(id) {
    return api.get(`${this.endpoint}/${id}/notes`);
  }

  // Update invoice note
  async updateInvoiceNote(id, noteId, noteData) {
    return api.put(`${this.endpoint}/${id}/notes/${noteId}`, noteData);
  }

  // Delete invoice note
  async deleteInvoiceNote(id, noteId) {
    return api.delete(`${this.endpoint}/${id}/notes/${noteId}`);
  }

  // Record payment
  async recordPayment(id, paymentData) {
    return api.post(`${this.endpoint}/${id}/payments`, paymentData);
  }

  // Get invoice payments
  async getInvoicePayments(id) {
    return api.get(`${this.endpoint}/${id}/payments`);
  }

  // Void invoice
  async voidInvoice(id, reason) {
    return api.post(`${this.endpoint}/${id}/void`, { reason });
  }

  // Duplicate invoice
  async duplicateInvoice(id) {
    return api.post(`${this.endpoint}/${id}/duplicate`);
  }
}

export default new InvoiceAPI();
