import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Use environment variable
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get(`${API_URL}/api/auth/verify`);
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          clearAuthState();
        }
      } else {
        clearAuthState();
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const clearAuthState = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const login = async (credentials) => {
    try {
      if (!credentials?.email?.trim() || !credentials?.password?.trim()) {
        throw new Error('Email and password are required');
      }

      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: credentials.email.trim(),
        password: credentials.password.trim()
      });

      const { token, user: userData } = response.data;

      if (!token || !userData) {
        throw new Error('Invalid response from server');
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      clearAuthState();
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    clearAuthState();
    window.location.href = '/login';
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    clearAuthState,
    checkAuth: () => !!localStorage.getItem('token')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Fix: Export `useAuth` properly
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
