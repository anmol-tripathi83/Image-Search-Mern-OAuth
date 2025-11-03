import React, { useState } from 'react';
import axios from 'axios';
import ImageGrid from './ImageGrid';
import { Search, X, Loader } from 'lucide-react';

const SearchComponent = ({ 
  onSearchResults, 
  searchResults, 
  selectedImages, 
  onSelectionChange 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastSearchTerm, setLastSearchTerm] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/search', { 
        term: searchTerm.trim() 
      });
      
      onSearchResults(response.data.results);
      setLastSearchTerm(searchTerm.trim());
      setError('');
    } catch (error) {
      console.error('Search error:', error);
      setError(
        error.response?.data?.error || 
        'Failed to search images. Please try again.'
      );
      onSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setLastSearchTerm('');
    onSearchResults([]);
    onSelectionChange([]);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="card p-6">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for images (e.g., nature, mountains, animals...)"
              className="input-field pl-10 pr-10"
              disabled={loading}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={loading}
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <button 
            type="submit" 
            disabled={loading || !searchTerm.trim()}
            className="btn-primary flex items-center space-x-2 min-w-[120px] justify-center"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-700">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Search Results Header */}
      {lastSearchTerm && searchResults.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Search results for "{lastSearchTerm}" 
            <span className="text-gray-600 ml-2">- {searchResults.length} images found</span>
          </h2>
        </div>
      )}

      {/* Selection Counter */}
      {selectedImages.length > 0 && (
        <div className="card p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <div className="h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{selectedImages.length}</span>
                </div>
              </div>
              <span className="text-blue-800 font-medium">
                Selected {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button 
              onClick={() => onSelectionChange([])}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {lastSearchTerm && searchResults.length === 0 && !loading && !error && (
        <div className="card p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No images found for "{lastSearchTerm}"
            </h3>
            <p className="text-gray-600">
              Try searching with different keywords or check your spelling.
            </p>
          </div>
        </div>
      )}

      {/* Image Grid */}
      <ImageGrid 
        images={searchResults}
        selectedImages={selectedImages}
        onImageSelect={onSelectionChange}
        loading={loading}
      />
    </div>
  );
};

export default SearchComponent;