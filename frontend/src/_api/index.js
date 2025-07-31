// Export all API modules
import analyticsAPI from './analytics';
import clientAPI from './client';
import { default as api, default as commonAPI } from './common';
import invoiceAPI from './invoice';
import orderAPI from './order';
import projectAPI from './project';
import quotationAPI from './quotation';
import userAPI from './user';

// Export individual API classes for testing or advanced usage
export { default as AnalyticsAPI } from './analytics';
export { default as ClientAPI } from './client';
export { default as CommonAPI } from './common';
export { default as InvoiceAPI } from './invoice';
export { default as OrderAPI } from './order';
export { default as ProjectAPI } from './project';
export { default as QuotationAPI } from './quotation';
export { default as UserAPI } from './user';

// Export API utilities
export const APIUtils = {
  // Helper function to create API instance with custom config
  createAPI: (config = {}) => {
    const api = new BaseAPI();
    if (config.baseURL) api.baseURL = config.baseURL;
    if (config.timeout) api.axios.defaults.timeout = config.timeout;
    return api;
  },

  // Helper function to handle API errors
  handleError: (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('access_token');
      window.location.href = '/auth/login';
    }
    return error;
  },

  // Helper function to format API response
  formatResponse: (response) => {
    return {
      success: true,
      data: response.data || response,
      message: response.message || 'Success'
    };
  },

  // Helper function to format API error
  formatError: (error) => {
    return {
      success: false,
      error: error.message || 'An error occurred',
      status: error.response?.status || 500
    };
  }
};

// Export all APIs
export { analyticsAPI, api, clientAPI, commonAPI, invoiceAPI, orderAPI, projectAPI, quotationAPI, userAPI };

// Default export for convenience
export default {
  api,
  commonAPI,
  clientAPI,
  projectAPI,
  orderAPI,
  invoiceAPI,
  analyticsAPI,
  userAPI,
  quotationAPI,
  APIUtils
};
