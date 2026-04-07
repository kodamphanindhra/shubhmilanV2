import axios, { AxiosInstance, AxiosError } from 'axios';

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_APP_API_BASE_URL || 'https://shubhmilan-backend-k5p7.onrender.com',
  // BASE_URL: import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
  MOCK_MODE: false,
};

// Create Axios instance
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    registerSuperadmin: '/auth/superadmin/register',
    loginSuperadmin: '/auth/superadmin/login',
    loginUser: '/api/client/login',
    // registerUser: '/auth/user/register', // Not in backend doc
  },

  // Profile
  profile: {
    create: '/api/profile/create',
    update: (id: string) => `/api/profile/${id}`,
    get: (id: string) => `/api/profile/${id}`,
    list: '/api/profile/all',
    delete: (id: string) => `/api/profile/${id}`,
    match: (id: string) => `/api/profiles/${id}/match`,
  },

  // Dashboard
  dashboard: {
    get: '/api/client/dashboard',
  },

  // Support (not in backend doc, left as is)
  support: {
    tickets: '/support/tickets',
    create: '/support/tickets',
  },

  // Subscription (not in backend doc, left as is)
  subscription: {
    list: '/subscriptions',
    assign: '/subscriptions/assign',
  },

  // Admin & Access (not in backend doc, left as is)
  admin: {
    users: '/admin/users',
    updateAccess: (userId: string) => `/admin/users/${userId}/access`,
  },
};

// API Middleware
export async function apiMiddleware<T>(
  apiFn: () => Promise<{ data: T }>
): Promise<T | { success: false; message: string }> {
  try {
    const response = await apiFn();
    return response.data;
  } catch (error: any) {
    console.error('API Middleware Error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'An error occurred',
    };
  }
}

// Mock delay helper
export const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));
