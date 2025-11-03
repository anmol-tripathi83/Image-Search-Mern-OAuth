import axios from 'axios';

// API utility functions
export const api = {
  // Get top searches
  getTopSearches: () => axios.get('/api/topSearches'),
  
  // Search images
  searchImages: (term) => axios.post('/api/search', { term }),
  
  // Get search history
  getSearchHistory: () => axios.get('/api/history'),
  
  // Get current user
  getCurrentUser: () => axios.get('/auth/currentUser'),
  
  // Logout
  logout: () => axios.get('/auth/logout')
};

// Response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);