// src/features/producers/components/ProducerCard.tsx
import React, { useState } from 'react';
import { Producer } from '../types/Producer.types';
import { Star, Clock, Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

// Rest of the file stays the same...
// Category color mapping (should be consistent across the app)
const CATEGORY_COLORS = {
  baker: '#FF5252',     // Red
  gardener: '#4CAF50',  // Green
  eggs: '#FFC107',      // Amber/Yellow
  homecook: '#9C27B0',  // Purple
  specialty: '#FF9800', // Orange
  default: '#2196F3'    // Blue (fallback)
};

interface ProducerListItemProps {
  producer: Producer;
}

const ProducerListItem: React.FC<ProducerListItemProps> = ({ producer }) => {
  const [expanded, setExpanded] = useState(false);
  const [favorited, setFavorited] = useState(false);
  
  // Availability badge color and text
  const getAvailabilityInfo = () => {
    switch (producer.availability) {
      case 'now':
        return { text: 'Available now', color: '#4CAF50' };
      case 'tomorrow':
        return { text: 'Available tomorrow', color: '#FF9800' };
      case 'weekend':
        return { text: 'Available this weekend', color: '#9C27B0' };
      default:
        return { text: 'Check availability', color: '#757575' };
    }
  };
  
  const availability = getAvailabilityInfo();
  
  // Get category color
  const categoryColor = CATEGORY_COLORS[producer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
  
  // Toggle favorite status
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorited(!favorited);
  };
  
  // Random viewers count for social proof (in a real app, this would come from the server)
  const viewersCount = Math.floor(Math.random() * 5) + 1;
  
  // Create image grid for info window
  const createImageGrid = () => {
    if (!producer.images || producer.images.length === 0) {
      return (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div 
            className="aspect-square rounded-md flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${categoryColor}20` }}
          >
            {producer.icon}
          </div>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-3 gap-2 mb-4">
        {producer.images.slice(0, 3).map((img, index) => (
          <div key={index} className="aspect-square rounded-md overflow-hidden">
            <img 
              src={img} 
              alt={`${producer.name} product ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div 
      className="border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md bg-white"
      style={{ borderLeftColor: categoryColor, borderLeftWidth: '4px' }}
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start">
          {/* Producer image or icon */}
          <div className="w-16 h-16 rounded-full mr-4 overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
            {producer.images && producer.images.length > 0 ? (
              <img 
                src={producer.images[0]} 
                alt={producer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">{producer.icon}</span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 truncate pr-2">{producer.name}</h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Star className="text-yellow-500 w-4 h-4 mr-1" />
                  <span>{producer.rating}</span>
                  <span className="mx-1 text-gray-400">·</span>
                  <span>{producer.reviews} reviews</span>
                </div>
              </div>
              
              <div className="flex items-center">
                {/* Availability badge */}
                <span 
                  className="text-xs px-2 py-1 rounded-full font-medium flex items-center mr-2"
                  style={{ backgroundColor: `${availability.color}20`, color: availability.color }}
                >
                  <span 
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: availability.color }}
                  ></span>
                  {availability.text}
                </span>
                
                {/* Expand/collapse button */}
                <button className="text-gray-400 hover:text-gray-600">
                  {expanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{producer.description}</p>
            
            <div className="flex items-center justify-between mt-2 text-sm">
              <div className="flex items-center text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>{producer.walkTime} min walk</span>
              </div>
              
              {/* Viewers count */}
              <div className="text-xs text-gray-500 flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                {viewersCount} {viewersCount === 1 ? 'person' : 'people'} viewing
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expanded content */}
      {expanded && (
        <div className="p-4 pt-0 border-t mt-2">
          <div className="text-sm font-medium text-gray-700 mt-2 mb-2">Available Items:</div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {producer.items.map((item, index) => (
              <div 
                key={index} 
                className="bg-gray-50 px-3 py-2 rounded-md text-sm"
              >
                {item}
                <span className="ml-2 text-xs bg-gray-200 px-1 rounded text-gray-600">
                  {/* Random available count */}
                  {Math.floor(Math.random() * 10) + 1}
                </span>
              </div>
            ))}
          </div>
          
          {/* Photo gallery */}
          {producer.images && producer.images.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Gallery:</div>
              {createImageGrid()}
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex space-x-2 mt-3">
            <button className="flex-1 bg-primary text-white py-2 px-4 rounded-full text-sm font-medium">
              View Profile
            </button>
            <button className="flex-1 border border-gray-300 py-2 px-4 rounded-full text-sm font-medium text-gray-600 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              Message
            </button>
            <button 
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                favorited ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400'
              }`}
              onClick={toggleFavorite}
              aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProducerListItem;