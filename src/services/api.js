import axios from 'axios';
import { toast } from 'react-toastify';

const isDev = import.meta.env.MODE === 'development';
const API_URL = isDev 
  ? 'http://localhost:5000'
  : 'https://evoback-c2a4.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(isDev && {
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Credentials': 'true'
    })
  },
  withCredentials: false
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error:', error);
      toast.error('Unable to connect to server');
    } else if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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
