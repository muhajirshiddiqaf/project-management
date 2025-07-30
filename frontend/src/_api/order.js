import api from './common';

class OrderAPI {
  constructor() {
    this.endpoint = '/orders';
  }

  // Get all orders with pagination and filters
  async getAllOrders(params = {}) {
    return api.getPaginated(this.endpoint, params.page, params.limit, params);
  }

  // Get order by ID
  async getOrderById(id) {
    return api.get(`${this.endpoint}/${id}`);
  }

  // Create new order
  async createOrder(orderData) {
    return api.post(this.endpoint, orderData);
  }

  // Update order
  async updateOrder(id, orderData) {
    return api.put(`${this.endpoint}/${id}`, orderData);
  }

  // Delete order
  async deleteOrder(id) {
    return api.delete(`${this.endpoint}/${id}`);
  }

  // Search orders
  async searchOrders(searchTerm, filters = {}) {
    return api.search(this.endpoint, searchTerm, filters);
  }

  // Get order statistics
  async getOrderStats() {
    return api.get(`${this.endpoint}/stats`);
  }

  // Export orders
  async exportOrders(format = 'csv', filters = {}) {
    return api.exportData(this.endpoint, format, filters);
  }

  // Update order status
  async updateOrderStatus(id, status) {
    return api.patch(`${this.endpoint}/${id}/status`, { status });
  }

  // Get order items
  async getOrderItems(orderId) {
    return api.get(`${this.endpoint}/${orderId}/items`);
  }

  // Add order item
  async addOrderItem(orderId, itemData) {
    return api.post(`${this.endpoint}/${orderId}/items`, itemData);
  }

  // Update order item
  async updateOrderItem(orderId, itemId, itemData) {
    return api.put(`${this.endpoint}/${orderId}/items/${itemId}`, itemData);
  }

  // Delete order item
  async deleteOrderItem(orderId, itemId) {
    return api.delete(`${this.endpoint}/${orderId}/items/${itemId}`);
  }

  // Get order history
  async getOrderHistory(id) {
    return api.get(`${this.endpoint}/${id}/history`);
  }

  // Add order note
  async addOrderNote(id, noteData) {
    return api.post(`${this.endpoint}/${id}/notes`, noteData);
  }

  // Get order notes
  async getOrderNotes(id) {
    return api.get(`${this.endpoint}/${id}/notes`);
  }

  // Update order note
  async updateOrderNote(id, noteId, noteData) {
    return api.put(`${this.endpoint}/${id}/notes/${noteId}`, noteData);
  }

  // Delete order note
  async deleteOrderNote(id, noteId) {
    return api.delete(`${this.endpoint}/${id}/notes/${noteId}`);
  }

  // Generate order PDF
  async generateOrderPDF(id) {
    return api.post(`${this.endpoint}/${id}/pdf`);
  }

  // Send order email
  async sendOrderEmail(id, emailData) {
    return api.post(`${this.endpoint}/${id}/send-email`, emailData);
  }
}

export default new OrderAPI();
