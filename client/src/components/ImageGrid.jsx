import React from 'react';
import { Check } from 'lucide-react';

const ImageGrid = ({ images, selectedImages, onImageSelect, loading }) => {
  const handleImageClick = (imageId) => {
    if (loading) return;
    
    const newSelected = selectedImages.includes(imageId)
      ? selectedImages.filter(id => id !== imageId)
      : [...selectedImages, imageId];
    
    onImageSelect(newSelected);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading images...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div 
          key={image.id} 
          className={`relative group cursor-pointer transform transition-all duration-200 hover:scale-105 ${
            selectedImages.includes(image.id) ? 'ring-2 ring-blue-500 ring-offset-2' : ''
          }`}
          onClick={() => handleImageClick(image.id)}
        >
          {/* Selection Checkbox */}
          <div className={`absolute top-2 left-2 z-10 transition-opacity duration-200 ${
            selectedImages.includes(image.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              selectedImages.includes(image.id) 
                ? 'bg-blue-500' 
                : 'bg-white bg-opacity-80'
            }`}>
              {selectedImages.includes(image.id) && (
                <Check className="h-4 w-4 text-white" />
              )}
            </div>
          </div>

          {/* Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-200">
            <img
              src={image.urls.small}
              alt={image.altDescription || image.description || 'Unsplash image'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-end">
            <div className="p-3 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0">
                    <img
                      src={image.user.profileImage}
                      alt={image.user.name}
                      className="h-6 w-6 rounded-full flex-shrink-0"
                    />
                    <span className="text-xs font-medium text-gray-900 truncate">
                      {image.user.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <span>❤️</span>
                    <span>{image.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;