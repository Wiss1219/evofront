const API_URL = import.meta.env.VITE_API_URL; // Use environment variable

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
