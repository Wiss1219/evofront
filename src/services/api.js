import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add auth token to requests if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
};

export const cartAPI = {
  get: () => axiosInstance.get('/cart'),
  add: (productId, quantity) => axiosInstance.post('/cart/add', { productId, quantity }),
  increment: (itemId) => axiosInstance.put(`/cart/increment/${itemId}`),
  decrement: (itemId) => axiosInstance.put(`/cart/decrement/${itemId}`),
  remove: (itemId) => axiosInstance.delete(`/cart/${itemId}`),
  clear: () => axiosInstance.delete('/cart'),
};

export const productsAPI = {
  getAll: () => axiosInstance.get('/products'),
  getOne: (id) => axiosInstance.get(`/products/${id}`),
};
