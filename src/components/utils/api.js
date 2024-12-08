// src/utils/api.js
import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env?.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}/api`;
  }
  return 'http://localhost:3000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request has already been retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Attempt to refresh token
      const response = await api.post('/auth/refresh');
      
      if (response.data?.data?.token) {
        // Store new token
        localStorage.setItem('token', response.data.data.token);
        
        // Update authorization header
        originalRequest.headers.Authorization = 
          `Bearer ${response.data.data.token}`;
        
        // Retry original request
        return api(originalRequest);
      }
    } catch (refreshError) {
      // If refresh fails, clear auth state and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

// API wrapper methods with error handling
const apiWrapper = {
  async get(url, config = {}) {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async post(url, data = {}, config = {}) {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async put(url, data = {}, config = {}) {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async delete(url, config = {}) {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  handleError(error) {
    // Extract error message from response
    const message = 
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    // Create error object with additional context
    const enhancedError = new Error(message);
    enhancedError.status = error.response?.status;
    enhancedError.code = error.response?.data?.code;
    enhancedError.details = error.response?.data?.details;
    enhancedError.originalError = error;

    // Log error in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Error:', {
        message,
        status: error.response?.status,
        details: error.response?.data
      });
    }

    return enhancedError;
  }
};

// Auth specific methods
const auth = {
  async login(email, password) {
    const response = await apiWrapper.post('/auth/login', { email, password });
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  async register(userData) {
    const response = await apiWrapper.post('/auth/register', userData);
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  async logout() {
    try {
      await apiWrapper.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async refreshToken() {
    const response = await apiWrapper.post('/auth/refresh');
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// User specific methods
const user = {
  async getProfile() {
    return await apiWrapper.get('/profile');
  },

  async updateProfile(data) {
    return await apiWrapper.put('/profile', data);
  },

  async changePassword(currentPassword, newPassword) {
    return await apiWrapper.put('/change-password', {
      currentPassword,
      newPassword
    });
  },

  async deleteAccount() {
    return await apiWrapper.delete('/account');
  }
};

// Combine all methods
const combinedApi = {
  ...apiWrapper,
  auth,
  user
};

export default combinedApi;