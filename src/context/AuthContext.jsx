import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

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
          // Configure axios to use the token
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify token with backend
          const response = await axios.get('http://localhost:5000/api/auth/verify');
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
      // Basic validation
      if (!credentials?.email?.trim() || !credentials?.password?.trim()) {
        throw new Error('Email and password are required');
      }

      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: credentials.email.trim(),
        password: credentials.password.trim()
      });

      const { token, user: userData } = response.data;
      
      if (!token || !userData) {
        throw new Error('Invalid response from server');
      }

      // Set axios default authorization header
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
