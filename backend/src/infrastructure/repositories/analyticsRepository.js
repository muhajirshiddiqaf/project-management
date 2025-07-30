const { queries } = require('../database/queries');

class AnalyticsRepository {
  constructor(db) {
    this.db = db;
    this.queries = queries.analytics;
  }

  // === DASHBOARD OVERVIEW METHODS ===
  async getDashboardOverview(organizationId, filters = {}) {
    try {
      // Get basic metrics
      const overviewQuery = this.queries.getDashboardOverview;
      const overviewResult = await this.db.query(overviewQuery, [organizationId]);
      const overview = overviewResult.rows[0] || {};

      // Get recent data
      const [recentClients, recentProjects, recentOrders] = await Promise.all([
        this.db.query(this.queries.getRecentClients, [organizationId]),
        this.db.query(this.queries.getRecentProjects, [organizationId]),
        this.db.query(this.queries.getRecentOrders, [organizationId])
      ]);

      return {
        ...overview,
        recentClients: recentClients.rows,
        recentProjects: recentProjects.rows,
        recentOrders: recentOrders.rows,
        revenueData: [], // Will be populated by revenue analytics
        projectStatusData: [] // Will be populated by project analytics
      };
    } catch (error) {
      console.error('Error getting dashboard overview:', error);
      throw error;
    }
  }

  // === REVENUE ANALYTICS METHODS ===
  async getRevenueAnalytics(organizationId, filters = {}) {
    const query = this.queries.getRevenueAnalytics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  // === CLIENT ANALYTICS METHODS ===
  async getClientAnalytics(organizationId, filters = {}) {
    const query = this.queries.getClientAnalytics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  // === ORDER ANALYTICS METHODS ===
  async getOrderAnalytics(organizationId, filters = {}) {
    const query = this.queries.getOrderAnalytics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  // === TICKET ANALYTICS METHODS ===
  async getTicketAnalytics(organizationId, filters = {}) {
    const query = this.queries.getTicketAnalytics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  // === PROJECT ANALYTICS METHODS ===
  async getProjectAnalytics(organizationId, filters = {}) {
    const query = this.queries.getProjectAnalytics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  // === SERVICE ANALYTICS METHODS ===
  async getServiceAnalytics(organizationId, filters = {}) {
    const query = this.queries.getServiceAnalytics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  // === QUOTATION ANALYTICS METHODS ===
  async getQuotationAnalytics(organizationId, filters = {}) {
    const query = this.queries.getQuotationAnalytics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  // === INVOICE ANALYTICS METHODS ===
  async getInvoiceAnalytics(organizationId, filters = {}) {
    const query = this.queries.getInvoiceAnalytics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  // === PERFORMANCE METRICS METHODS ===
  async getPerformanceMetrics(organizationId, filters = {}) {
    const query = this.queries.getPerformanceMetrics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // === GROWTH ANALYTICS METHODS ===
  async getGrowthAnalytics(organizationId, filters = {}) {
    const query = this.queries.getGrowthAnalytics;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  // === CUSTOM ANALYTICS METHODS ===
  async getCustomAnalytics(organizationId, options = {}) {
    const { query_type, filters = {}, group_by = [], sort_by, sort_order = 'desc', limit = 100 } = options;

    // Build dynamic query based on query_type
    let query;
    let values = [organizationId];

    switch (query_type) {
      case 'revenue':
        query = this.queries.getCustomRevenueAnalytics;
        break;
      case 'clients':
        query = this.queries.getCustomClientAnalytics;
        break;
      case 'orders':
        query = this.queries.getCustomOrderAnalytics;
        break;
      case 'tickets':
        query = this.queries.getCustomTicketAnalytics;
        break;
      case 'projects':
        query = this.queries.getCustomProjectAnalytics;
        break;
      case 'services':
        query = this.queries.getCustomServiceAnalytics;
        break;
      case 'quotations':
        query = this.queries.getCustomQuotationAnalytics;
        break;
      case 'invoices':
        query = this.queries.getCustomInvoiceAnalytics;
        break;
      default:
        throw new Error('Invalid query type');
    }

    // Add limit to values
    values.push(limit);

    const result = await this.db.query(query, values);
    return result.rows;
  }

  // === EXPORT ANALYTICS METHODS ===
  async exportAnalyticsData(organizationId, options = {}) {
    const { query_type, format = 'csv', filters = {}, include_headers = true } = options;

    // Get data based on query_type
    const data = await this.getCustomAnalytics(organizationId, {
      query_type,
      filters,
      limit: 10000 // Large limit for export
    });

    // Format data based on export format
    switch (format.toLowerCase()) {
      case 'csv':
        return this.formatAsCSV(data, include_headers);
      case 'excel':
        return this.formatAsExcel(data, include_headers);
      case 'json':
        return JSON.stringify(data, null, 2);
      default:
        return this.formatAsCSV(data, include_headers);
    }
  }

  // === REAL-TIME ANALYTICS METHODS ===
  async getRealTimeDashboard(organizationId, options = {}) {
    const query = this.queries.getRealTimeDashboard;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async getActivityFeed(organizationId, filters = {}, pagination = {}) {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    const query = this.queries.getActivityFeed;
    const values = [organizationId, limit, offset];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countActivityFeed(organizationId, filters = {}) {
    const query = this.queries.countActivityFeed;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async getAlertsAndNotifications(organizationId, filters = {}, pagination = {}) {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    const query = this.queries.getAlertsAndNotifications;
    const values = [organizationId, limit, offset];

    const result = await this.db.query(query, values);
    return result.rows;
  }

  async countAlertsAndNotifications(organizationId, filters = {}) {
    const query = this.queries.countAlertsAndNotifications;
    const values = [organizationId];

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  // === HELPER METHODS ===
  formatAsCSV(data, includeHeaders = true) {
    if (!data || data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    let csv = '';

    if (includeHeaders) {
      csv += headers.join(',') + '\n';
    }

    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      });
      csv += values.join(',') + '\n';
    });

    return csv;
  }

  formatAsExcel(data, includeHeaders = true) {
    // This is a simplified Excel format
    // In a real implementation, you'd use a library like 'xlsx'
    return this.formatAsCSV(data, includeHeaders);
  }
}

module.exports = AnalyticsRepository;
