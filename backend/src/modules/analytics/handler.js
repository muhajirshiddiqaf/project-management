const Boom = require('@hapi/boom');

class AnalyticsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // Bind all methods to preserve 'this' context
    this.testService = this.testService.bind(this);
    this.getDashboardAnalytics = this.getDashboardAnalytics.bind(this);
    this.getRevenueAnalytics = this.getRevenueAnalytics.bind(this);
    this.getClientAnalytics = this.getClientAnalytics.bind(this);
    this.getOrderAnalytics = this.getOrderAnalytics.bind(this);
    this.getProjectAnalytics = this.getProjectAnalytics.bind(this);
    this.getTicketAnalytics = this.getTicketAnalytics.bind(this);
  }

  // Test service method
  async testService(request, h) {
    try {
      const { organizationId } = request.auth.credentials;

      console.log('Testing analytics service for organization:', organizationId);

      const result = await this._service.testService(organizationId);

      return h.response({
        success: true,
        message: 'Analytics service test completed',
        data: result
      });
    } catch (error) {
      console.error('Error in testService handler:', error);

      return h.response({
        success: false,
        message: 'Analytics service test failed',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }).code(500);
    }
  }

  // Get dashboard analytics
  async getDashboardAnalytics(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { period = 'month' } = request.query;

      console.log('Getting dashboard analytics for organization:', organizationId, 'period:', period);

      const analytics = await this._service.getDashboardAnalytics(organizationId, period);

      console.log('Dashboard analytics retrieved successfully:', analytics);

      return h.response({
        success: true,
        message: 'Dashboard analytics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      console.error('Error in getDashboardAnalytics handler:', error);

      // Return a more detailed error response
      return h.response({
        success: false,
        message: 'Failed to retrieve dashboard analytics',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }).code(500);
    }
  }

  // Get revenue analytics
  async getRevenueAnalytics(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { period = 'month', startDate, endDate } = request.query;

      const analytics = await this._service.getRevenueAnalytics(organizationId, {
        period,
        startDate,
        endDate
      });

      return h.response({
        success: true,
        message: 'Revenue analytics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      console.error('Error in getRevenueAnalytics handler:', error);

      return h.response({
        success: false,
        message: 'Failed to retrieve revenue analytics',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }).code(500);
    }
  }

  // Get client analytics
  async getClientAnalytics(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { period = 'month' } = request.query;

      const analytics = await this._service.getClientAnalytics(organizationId, period);

      return h.response({
        success: true,
        message: 'Client analytics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      console.error('Error in getClientAnalytics handler:', error);

      return h.response({
        success: false,
        message: 'Failed to retrieve client analytics',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }).code(500);
    }
  }

  // Get order analytics
  async getOrderAnalytics(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { period = 'month' } = request.query;

      const analytics = await this._service.getOrderAnalytics(organizationId, period);

      return h.response({
        success: true,
        message: 'Order analytics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      console.error('Error in getOrderAnalytics handler:', error);

      return h.response({
        success: false,
        message: 'Failed to retrieve order analytics',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }).code(500);
    }
  }

  // Get project analytics
  async getProjectAnalytics(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { period = 'month' } = request.query;

      const analytics = await this._service.getProjectAnalytics(organizationId, period);

      return h.response({
        success: true,
        message: 'Project analytics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      console.error('Error in getProjectAnalytics handler:', error);

      return h.response({
        success: false,
        message: 'Failed to retrieve project analytics',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }).code(500);
    }
  }

  // Get ticket analytics
  async getTicketAnalytics(request, h) {
    try {
      const { organizationId } = request.auth.credentials;
      const { period = 'month' } = request.query;

      const analytics = await this._service.getTicketAnalytics(organizationId, period);

      return h.response({
        success: true,
        message: 'Ticket analytics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      console.error('Error in getTicketAnalytics handler:', error);

      return h.response({
        success: false,
        message: 'Failed to retrieve ticket analytics',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }).code(500);
    }
  }
}

module.exports = AnalyticsHandler;
