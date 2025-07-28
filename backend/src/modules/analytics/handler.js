const Boom = require('@hapi/boom');
const moment = require('moment');

class AnalyticsHandler {
  constructor() {
    this.analyticsRepository = null;
  }

  // Set repository (dependency injection)
  setAnalyticsRepository(analyticsRepository) {
    this.analyticsRepository = analyticsRepository;
  }

  // === DASHBOARD OVERVIEW METHODS ===
  async getDashboardOverview(request, h) {
    try {
      const { period = 'month', start_date, end_date } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { period, start_date, end_date };
      const overview = await this.analyticsRepository.getDashboardOverview(organizationId, filters);

      return h.response({
        success: true,
        data: overview
      }).code(200);
    } catch (error) {
      console.error('Error getting dashboard overview:', error);
      throw Boom.internal('Failed to get dashboard overview');
    }
  }

  // === REVENUE ANALYTICS METHODS ===
  async getRevenueAnalytics(request, h) {
    try {
      const { period = 'month', start_date, end_date, group_by = 'month', include_projections = false } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { period, start_date, end_date, group_by, include_projections };
      const analytics = await this.analyticsRepository.getRevenueAnalytics(organizationId, filters);

      return h.response({
        success: true,
        data: analytics
      }).code(200);
    } catch (error) {
      console.error('Error getting revenue analytics:', error);
      throw Boom.internal('Failed to get revenue analytics');
    }
  }

  // === CLIENT ANALYTICS METHODS ===
  async getClientAnalytics(request, h) {
    try {
      const { period = 'month', start_date, end_date, group_by = 'client', include_activity = true } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { period, start_date, end_date, group_by, include_activity };
      const analytics = await this.analyticsRepository.getClientAnalytics(organizationId, filters);

      return h.response({
        success: true,
        data: analytics
      }).code(200);
    } catch (error) {
      console.error('Error getting client analytics:', error);
      throw Boom.internal('Failed to get client analytics');
    }
  }

  // === ORDER ANALYTICS METHODS ===
  async getOrderAnalytics(request, h) {
    try {
      const { period = 'month', start_date, end_date, status, group_by = 'month' } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { period, start_date, end_date, status, group_by };
      const analytics = await this.analyticsRepository.getOrderAnalytics(organizationId, filters);

      return h.response({
        success: true,
        data: analytics
      }).code(200);
    } catch (error) {
      console.error('Error getting order analytics:', error);
      throw Boom.internal('Failed to get order analytics');
    }
  }

  // === TICKET ANALYTICS METHODS ===
  async getTicketAnalytics(request, h) {
    try {
      const { period = 'month', start_date, end_date, priority, status, group_by = 'month' } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { period, start_date, end_date, priority, status, group_by };
      const analytics = await this.analyticsRepository.getTicketAnalytics(organizationId, filters);

      return h.response({
        success: true,
        data: analytics
      }).code(200);
    } catch (error) {
      console.error('Error getting ticket analytics:', error);
      throw Boom.internal('Failed to get ticket analytics');
    }
  }

  // === PROJECT ANALYTICS METHODS ===
  async getProjectAnalytics(request, h) {
    try {
      const { period = 'month', start_date, end_date, status, group_by = 'month' } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { period, start_date, end_date, status, group_by };
      const analytics = await this.analyticsRepository.getProjectAnalytics(organizationId, filters);

      return h.response({
        success: true,
        data: analytics
      }).code(200);
    } catch (error) {
      console.error('Error getting project analytics:', error);
      throw Boom.internal('Failed to get project analytics');
    }
  }

  // === SERVICE ANALYTICS METHODS ===
  async getServiceAnalytics(request, h) {
    try {
      const { period = 'month', start_date, end_date, category_id, group_by = 'month' } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { period, start_date, end_date, category_id, group_by };
      const analytics = await this.analyticsRepository.getServiceAnalytics(organizationId, filters);

      return h.response({
        success: true,
        data: analytics
      }).code(200);
    } catch (error) {
      console.error('Error getting service analytics:', error);
      throw Boom.internal('Failed to get service analytics');
    }
  }

  // === QUOTATION ANALYTICS METHODS ===
  async getQuotationAnalytics(request, h) {
    try {
      const { period = 'month', start_date, end_date, status, group_by = 'month' } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { period, start_date, end_date, status, group_by };
      const analytics = await this.analyticsRepository.getQuotationAnalytics(organizationId, filters);

      return h.response({
        success: true,
        data: analytics
      }).code(200);
    } catch (error) {
      console.error('Error getting quotation analytics:', error);
      throw Boom.internal('Failed to get quotation analytics');
    }
  }

  // === INVOICE ANALYTICS METHODS ===
  async getInvoiceAnalytics(request, h) {
    try {
      const { period = 'month', start_date, end_date, status, group_by = 'month' } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { period, start_date, end_date, status, group_by };
      const analytics = await this.analyticsRepository.getInvoiceAnalytics(organizationId, filters);

      return h.response({
        success: true,
        data: analytics
      }).code(200);
    } catch (error) {
      console.error('Error getting invoice analytics:', error);
      throw Boom.internal('Failed to get invoice analytics');
    }
  }

  // === PERFORMANCE METRICS METHODS ===
  async getPerformanceMetrics(request, h) {
    try {
      const { period = 'month', start_date, end_date, include_comparison = true } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { period, start_date, end_date, include_comparison };
      const metrics = await this.analyticsRepository.getPerformanceMetrics(organizationId, filters);

      return h.response({
        success: true,
        data: metrics
      }).code(200);
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      throw Boom.internal('Failed to get performance metrics');
    }
  }

  // === GROWTH ANALYTICS METHODS ===
  async getGrowthAnalytics(request, h) {
    try {
      const { period = 'month', start_date, end_date, metric, include_forecast = false } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { period, start_date, end_date, metric, include_forecast };
      const analytics = await this.analyticsRepository.getGrowthAnalytics(organizationId, filters);

      return h.response({
        success: true,
        data: analytics
      }).code(200);
    } catch (error) {
      console.error('Error getting growth analytics:', error);
      throw Boom.internal('Failed to get growth analytics');
    }
  }

  // === CUSTOM ANALYTICS METHODS ===
  async getCustomAnalytics(request, h) {
    try {
      const { query_type, filters = {}, group_by = [], sort_by, sort_order = 'desc', limit = 100 } = request.payload;
      const organizationId = request.auth.credentials.organization_id;

      const analytics = await this.analyticsRepository.getCustomAnalytics(organizationId, {
        query_type,
        filters,
        group_by,
        sort_by,
        sort_order,
        limit
      });

      return h.response({
        success: true,
        data: analytics
      }).code(200);
    } catch (error) {
      console.error('Error getting custom analytics:', error);
      throw Boom.internal('Failed to get custom analytics');
    }
  }

  // === EXPORT ANALYTICS METHODS ===
  async exportAnalyticsData(request, h) {
    try {
      const { query_type, format = 'csv', filters = {}, include_headers = true } = request.payload;
      const organizationId = request.auth.credentials.organization_id;

      const exportData = await this.analyticsRepository.exportAnalyticsData(organizationId, {
        query_type,
        format,
        filters,
        include_headers
      });

      const headers = {
        'Content-Type': this.getContentType(format),
        'Content-Disposition': `attachment; filename="analytics_${query_type}_${moment().format('YYYY-MM-DD')}.${format}"`
      };

      return h.response(exportData)
        .code(200)
        .header('Content-Type', headers['Content-Type'])
        .header('Content-Disposition', headers['Content-Disposition']);
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      throw Boom.internal('Failed to export analytics data');
    }
  }

  // === REAL-TIME ANALYTICS METHODS ===
  async getRealTimeDashboard(request, h) {
    try {
      const { include_activity = true, include_alerts = true, refresh_interval = 30 } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const dashboard = await this.analyticsRepository.getRealTimeDashboard(organizationId, {
        include_activity,
        include_alerts,
        refresh_interval
      });

      return h.response({
        success: true,
        data: dashboard
      }).code(200);
    } catch (error) {
      console.error('Error getting real-time dashboard:', error);
      throw Boom.internal('Failed to get real-time dashboard');
    }
  }

  async getActivityFeed(request, h) {
    try {
      const { page = 1, limit = 20, activity_type, user_id, start_date, end_date } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { activity_type, user_id, start_date, end_date };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10) };

      const activities = await this.analyticsRepository.getActivityFeed(organizationId, filters, pagination);
      const total = await this.analyticsRepository.countActivityFeed(organizationId, filters);

      return h.response({
        success: true,
        data: activities,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      }).code(200);
    } catch (error) {
      console.error('Error getting activity feed:', error);
      throw Boom.internal('Failed to get activity feed');
    }
  }

  async getAlertsAndNotifications(request, h) {
    try {
      const { alert_type, priority, status, page = 1, limit = 20 } = request.query;
      const organizationId = request.auth.credentials.organization_id;

      const filters = { alert_type, priority, status };
      const pagination = { page: parseInt(page, 10), limit: parseInt(limit, 10) };

      const alerts = await this.analyticsRepository.getAlertsAndNotifications(organizationId, filters, pagination);
      const total = await this.analyticsRepository.countAlertsAndNotifications(organizationId, filters);

      return h.response({
        success: true,
        data: alerts,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      }).code(200);
    } catch (error) {
      console.error('Error getting alerts and notifications:', error);
      throw Boom.internal('Failed to get alerts and notifications');
    }
  }

  // === HELPER METHODS ===
  getContentType(format) {
    switch (format.toLowerCase()) {
      case 'csv':
        return 'text/csv';
      case 'excel':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'json':
        return 'application/json';
      default:
        return 'text/csv';
    }
  }
}

module.exports = new AnalyticsHandler();
