import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, RefreshCw, Search } from 'lucide-react';

const SearchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/history');
      setHistory(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching search history:', error);
      setError('Failed to load search history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <History className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Search History</h3>
            <p className="text-sm text-gray-500">Your recent searches</p>
          </div>
        </div>
        <button 
          onClick={fetchSearchHistory}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          title="Refresh history"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-red-700 text-sm">{error}</span>
            <button 
              onClick={fetchSearchHistory}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="space-y-3">
        {loading ? (
          // Skeleton loading
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse flex items-center space-x-3">
              <div className="bg-gray-200 rounded-full h-8 w-8"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : history.length > 0 ? (
          history.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <div className="bg-blue-100 p-2 rounded-full">
                <Search className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.term}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{item.resultCount || 0} results</span>
                  <span>•</span>
                  <span>{formatDate(item.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Empty state
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-600 mb-1">No search history yet</p>
            <p className="text-sm text-gray-500">Your searches will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHistory;