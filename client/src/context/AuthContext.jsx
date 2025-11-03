import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
  }, []);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/auth/currentUser');
      
      if (response.data && response.data.id) {
        setUser(response.data);
        setError('');
        console.log('✅ User authenticated:', response.data.name);
      } else {
        setUser(null);
        console.log('ℹ️ No user session found');
      }
    } catch (error) {
      console.log('🔐 Not authenticated:', error.response?.data?.error || error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function (redirects to OAuth providers)
  const loginWithProvider = (provider) => {
    console.log(`🔐 Attempting ${provider} OAuth login...`);
    clearError();
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/${provider}`;
  };

  // Logout function - FIXED VERSION (without useNavigate)
  const logout = async () => {
    try {
      console.log('👋 Logging out user...');
      await axios.get('/auth/logout');
      
      // Clear user state immediately
      setUser(null);
      setError('');
      
      // Force a hard redirect to login page
      window.location.href = '/login';
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      setError('Logout failed');
      
      // Even if there's an error, clear user and redirect
      setUser(null);
      window.location.href = '/login';
    }
  };

  // Clear errors
  const clearError = () => setError('');

  // Context value
  const value = {
    user,
    loading,
    error,
    loginWithProvider,
    logout,
    checkAuthStatus,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};