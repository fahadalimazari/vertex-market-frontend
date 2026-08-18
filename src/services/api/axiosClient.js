import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';
const TIMEOUT = Number(import.meta.env.VITE_TIMEOUT) || 10000;

// Dev Logging helper
const logDev = (msg, data = '') => {
  if (import.meta.env.DEV) {
    console.log(`[API LOG] ${msg}`, data);
  }
};

const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Network offline detection
    if (!navigator.onLine) {
      toast.error('Network offline! Please verify your internet connection.');
      return Promise.reject(new Error('Network offline'));
    }

    // Token Injection
    const authData = localStorage.getItem('vertex_session_v1');
    if (authData) {
      const { token } = JSON.parse(authData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    logDev(`Request: ${config.method.toUpperCase()} ${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    logDev(`Response: ${response.status} ${response.config.url}`, response.data || '');
    return response.data;
  },
  async (error) => {
    // Check if request was cancelled
    if (axios.isCancel(error)) {
      logDev('Request cancelled');
      return Promise.reject(error);
    }

    const status = error.response ? error.response.status : null;
    const msg = error.response?.data?.message || 'Something went wrong';

    logDev(`Error: ${status || 'Network Error'}`, error);

    // Global Error Handling Toasts
    if (status === 400) {
      toast.error(`Bad Request: ${msg}`);
    } else if (status === 401) {
      toast.error('Session expired or unauthorized! Redirecting to login...');
      localStorage.removeItem('vertex_session_v1');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      toast.error('Forbidden: You lack permissions for this operation.');
    } else if (status === 404) {
      toast.error('Resource not found');
    } else if (status === 422) {
      toast.error(`Validation Error: ${msg}`);
    } else if (status === 429) {
      toast.error('Too many requests. Please slow down.');
    } else if (status >= 500) {
      toast.error('Internal Server Error. Please contact support.');
    } else {
      toast.error('Network error. Verify connection.');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
