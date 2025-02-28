import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const API_URL = 'https://evoback-c2a4.onrender.com';
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
          const response = await authAPI.verify(); // Use authAPI instead of direct axios call
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
  };

  const login = async (credentials) => {
    try {
      if (!credentials?.email?.trim() || !credentials?.password?.trim()) {
        toast.error('Email and password are required');
        return { success: false, error: 'Email and password are required' };
      }

      const response = await authAPI.login({
        email: credentials.email.trim(),
        password: credentials.password.trim()
      });

      const { token, user: userData } = response.data;

      if (!token || !userData) {
        toast.error('Invalid response from server');
        return { success: false, error: 'Invalid response from server' };
      }

      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);
      toast.success('Login successful!');

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      clearAuthState();
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Login failed';
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
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
