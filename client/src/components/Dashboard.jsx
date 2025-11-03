import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TopSearches from './TopSearches';
import SearchComponent from './SearchComponent';
import SearchHistory from './SearchHistory';
import { LogOut, User, Search, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSearchResults = (results) => {
    setSearchResults(results);
    // Reset selections when new search is performed
    setSelectedImages([]);
  };

  const handleSelectionChange = (selectedIds) => {
    setSelectedImages(selectedIds);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Image Search</h1>
                <p className="text-sm text-gray-500">Powered by Unsplash</p>
              </div>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src={user?.profilePhoto}
                  alt={user?.name}
                  className="h-8 w-8 rounded-full border-2 border-gray-200"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=3b82f6&color=fff`;
                  }}
                />
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center space-x-2 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Logout"
              >
                {loggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span className="hidden sm:block text-sm font-medium">
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Top Searches Banner */}
      <TopSearches />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <SearchComponent 
              onSearchResults={handleSearchResults}
              searchResults={searchResults}
              selectedImages={selectedImages}
              onSelectionChange={handleSelectionChange}
            />
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <SearchHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;