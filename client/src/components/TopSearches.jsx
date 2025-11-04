import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, RefreshCw } from 'lucide-react';

const TopSearches = () => {
  const [topSearches, setTopSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTopSearches();
  }, []);

  const fetchTopSearches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/topSearches');
      setTopSearches(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching top searches:', error);
      setError('Failed to load top searches');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin">
              <RefreshCw className="h-4 w-4" />
            </div>
            <span className="text-sm">Loading trending searches...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>{error}</span>
            </div>
            <button 
              onClick={fetchTopSearches}
              className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold">Trending Searches:</span>
            <div className="flex items-center space-x-4">
              {topSearches.length > 0 ? (
                topSearches.map((search, index) => (
                  <div key={search.term} className="flex items-center space-x-2">
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm font-medium">
                      #{index + 1} {search.term} ({search.count})
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-sm opacity-90">No searches yet. Be the first to search!</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSearches;