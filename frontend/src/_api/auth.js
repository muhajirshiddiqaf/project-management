import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

class AuthAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('access_token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...options
    };

    try {
      const response = await axios(url, config);
      return response.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error.response?.data || error;
    }
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      data: userData
    });
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      data: credentials
    });

    // Handle the correct response structure
    if (response.data?.tokens?.accessToken) {
      localStorage.setItem('access_token', response.data.tokens.accessToken);
      localStorage.setItem('refresh_token', response.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return { data: response };
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(userData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      data: userData
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      data: passwordData
    });
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request('/auth/refresh-token', {
      method: 'POST',
      data: { refresh_token: refreshToken }
    });

    if (response.data?.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }

    return response;
  }

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new AuthAPI();
