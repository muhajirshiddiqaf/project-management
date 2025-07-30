import api from './common';

class AnalyticsAPI {
  constructor() {
    this.endpoint = '/analytics';
  }

  // Get dashboard analytics
  async getDashboardAnalytics(params = {}) {
    return api.get(`${this.endpoint}/dashboard`, params);
  }

  // Get revenue analytics
  async getRevenueAnalytics(params = {}) {
    return api.get(`${this.endpoint}/revenue`, params);
  }

  // Get client analytics
  async getClientAnalytics(params = {}) {
    return api.get(`${this.endpoint}/clients`, params);
  }

  // Get order analytics
  async getOrderAnalytics(params = {}) {
    return api.get(`${this.endpoint}/orders`, params);
  }

  // Get project analytics
  async getProjectAnalytics(params = {}) {
    return api.get(`${this.endpoint}/projects`, params);
  }

  // Get ticket analytics
  async getTicketAnalytics(params = {}) {
    return api.get(`${this.endpoint}/tickets`, params);
  }

  // Get service analytics
  async getServiceAnalytics(params = {}) {
    return api.get(`${this.endpoint}/services`, params);
  }

  // Get quotation analytics
  async getQuotationAnalytics(params = {}) {
    return api.get(`${this.endpoint}/quotations`, params);
  }

  // Get invoice analytics
  async getInvoiceAnalytics(params = {}) {
    return api.get(`${this.endpoint}/invoices`, params);
  }

  // Get performance metrics
  async getPerformanceMetrics(params = {}) {
    return api.get(`${this.endpoint}/performance`, params);
  }

  // Get growth analytics
  async getGrowthAnalytics(params = {}) {
    return api.get(`${this.endpoint}/growth`, params);
  }

  // Get custom analytics
  async getCustomAnalytics(queryData) {
    return api.post(`${this.endpoint}/custom`, queryData);
  }

  // Export analytics data
  async exportAnalyticsData(exportData) {
    return api.post(`${this.endpoint}/export`, exportData);
  }

  // Get real-time dashboard
  async getRealTimeDashboard(params = {}) {
    return api.get(`${this.endpoint}/realtime`, params);
  }

  // Get activity feed
  async getActivityFeed(params = {}) {
    return api.get(`${this.endpoint}/activity-feed`, params);
  }

  // Get alerts and notifications
  async getAlertsAndNotifications(params = {}) {
    return api.get(`${this.endpoint}/alerts`, params);
  }

  // Get user activity
  async getUserActivity(userId, params = {}) {
    return api.get(`${this.endpoint}/users/${userId}/activity`, params);
  }

  // Get organization analytics
  async getOrganizationAnalytics(params = {}) {
    return api.get(`${this.endpoint}/organization`, params);
  }

  // Get financial reports
  async getFinancialReports(params = {}) {
    return api.get(`${this.endpoint}/financial`, params);
  }

  // Get sales reports
  async getSalesReports(params = {}) {
    return api.get(`${this.endpoint}/sales`, params);
  }

  // Get customer reports
  async getCustomerReports(params = {}) {
    return api.get(`${this.endpoint}/customers`, params);
  }

  // Get operational reports
  async getOperationalReports(params = {}) {
    return api.get(`${this.endpoint}/operational`, params);
  }
}

export default new AnalyticsAPI();
