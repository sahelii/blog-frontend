import axios from 'axios';
import { auth } from '../firebase';

const isProduction = process.env.NODE_ENV === 'production' && process.env.REACT_APP_API_URL;
// Render free tier cold start can take 30–60s so longer timeout in production
const timeout = isProduction ? 30000 : 10000;

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers['x-auth-token'] = token;
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const user = auth.currentUser;
      if (user) {
        try {
          const token = await user.getIdToken(true); // Force refresh
          originalRequest.headers['x-auth-token'] = token;
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, redirect to login
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    // Handle network errors (often Render cold start: backend waking up)
    if (!error.response) {
      const isGet = originalRequest.method?.toUpperCase() === 'GET';
      const isRetry = originalRequest._coldStartRetry;
      if (isGet && !isRetry) {
        originalRequest._coldStartRetry = true;
        await new Promise((r) => setTimeout(r, 4000));
        return api(originalRequest);
      }
      error.message = 'The server is starting up. Please wait a moment and try again.';
    }

    return Promise.reject(error);
  },
);

export default api;
