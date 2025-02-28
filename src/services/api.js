import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://evoback-c2a4.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API service objects
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  verify: () => api.get('/api/auth/verify'),
};

export const cartAPI = {
  get: () => api.get('/api/cart'),
  add: (productId, quantity) => api.post('/api/cart', { productId, quantity }),
  increment: (itemId) => api.put(`/api/cart/${itemId}/increment`),
  decrement: (itemId) => api.put(`/api/cart/${itemId}/decrement`),
  remove: (itemId) => api.delete(`/api/cart/${itemId}`),
  clear: () => api.delete('/api/cart'),
};

export const productAPI = {
  getAll: () => api.get('/api/products'),
  getOne: (id) => api.get(`/api/products/${id}`),
};

export default api;
