import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class BaseAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.axios = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor for authentication
    this.axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('access_token');
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async request(endpoint, options = {}) {
    try {
      const response = await this.axios({
        url: endpoint,
        ...options
      });
      return response.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error.response?.data || error;
    }
  }

  // Common CRUD operations
  async get(endpoint, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${endpoint}?${queryParams}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      data
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      data
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      data
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  // File upload helper
  async upload(endpoint, file, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request(endpoint, {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: onProgress
    });
  }

  // Batch operations
  async batch(operations) {
    return this.request('/batch', {
      method: 'POST',
      data: { operations }
    });
  }

  // Search helper
  async search(endpoint, searchTerm, filters = {}) {
    const params = {
      q: searchTerm,
      ...filters
    };
    return this.get(endpoint, params);
  }

  // Pagination helper
  async getPaginated(endpoint, page = 1, limit = 10, filters = {}) {
    const params = {
      page,
      limit,
      ...filters
    };
    return this.get(endpoint, params);
  }
}

// Create singleton instance
const api = new BaseAPI();

// Create common API methods
const commonAPI = {
  // Authentication
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),

  // Profile
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),

  // Organization
  getOrganization: () => api.get('/organizations/current'),
  updateOrganization: (data) => api.put('/organizations/current', data),
  inviteUser: (data) => api.post('/organizations/invite', data),

  // File upload
  uploadFile: (file, onProgress) => api.upload('/upload', file, onProgress),
  uploadImage: (file, onProgress) => api.upload('/upload/image', file, onProgress),
  uploadDocument: (file, onProgress) => api.upload('/upload/document', file, onProgress),

  // Export
  exportData: (endpoint, format = 'csv', filters = {}) =>
    api.get(`${endpoint}/export`, { format, ...filters }),

  // Health check
  healthCheck: () => api.get('/health'),

  // Base methods for inheritance
  get: api.get.bind(api),
  post: api.post.bind(api),
  put: api.put.bind(api),
  patch: api.patch.bind(api),
  delete: api.delete.bind(api),
  search: api.search.bind(api),
  getPaginated: api.getPaginated.bind(api),
  batch: api.batch.bind(api)
};

export { commonAPI };
export default api;
