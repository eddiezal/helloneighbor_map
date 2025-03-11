// src/components/ListView/ProducerGrid.tsx
import React from 'react';
import { Producer } from '../../types/Producer';
import { Star, Clock, Heart } from 'lucide-react';

// Category color mapping (should be consistent across the app)
const CATEGORY_COLORS = {
  baker: '#FF5252',     // Red
  gardener: '#4CAF50',  // Green
  eggs: '#FFC107',      // Amber/Yellow
  homecook: '#9C27B0',  // Purple
  specialty: '#FF9800', // Orange
  default: '#2196F3'    // Blue (fallback)
};

interface ProducerGridProps {
  producers: Producer[];
}

const ProducerGrid: React.FC<ProducerGridProps> = ({ producers }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {producers.map(producer => (
        <ProducerGridCard key={producer.id} producer={producer} />
      ))}
    </div>
  );
};

// The individual card component used in the grid
interface ProducerGridCardProps {
  producer: Producer;
}

const ProducerGridCard: React.FC<ProducerGridCardProps> = ({ producer }) => {
  const [favorited, setFavorited] = React.useState(false);
  
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
  
  // Random viewers count for social proof
  const viewersCount = Math.floor(Math.random() * 5) + 1;
  
  return (
    <div className="rounded-lg overflow-hidden border bg-white hover:shadow-md transition-shadow duration-200">
      {/* Card header with image */}
      <div className="relative h-48">
        {producer.images && producer.images.length > 0 ? (
          <img 
            src={producer.images[0]} 
            alt={producer.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ backgroundColor: `${categoryColor}20` }}
          >
            {producer.icon}
          </div>
        )}
        
        {/* Category indicator */}
        <div 
          className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-medium"
          style={{ backgroundColor: 'white', color: categoryColor }}
        >
          {(() => {
            switch(producer.type) {
              case 'baker': return 'Baker';
              case 'gardener': return 'Gardener';
              case 'eggs': return 'Eggs';
              case 'homecook': return 'Home Cook';
              case 'specialty': return 'Specialty';
              default: return producer.type;
            }
          })()}
        </div>
        
        {/* Favorite button */}
        <button 
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm ${
            favorited ? 'text-red-500' : 'text-gray-400'
          }`}
          onClick={toggleFavorite}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>
        
        {/* Availability badge */}
        <div 
          className="absolute bottom-3 left-3 text-xs px-2 py-1 rounded-full font-medium flex items-center"
          style={{ backgroundColor: 'white', color: availability.color }}
        >
          <span 
            className="w-2 h-2 rounded-full mr-1"
            style={{ backgroundColor: availability.color }}
          ></span>
          {availability.text}
        </div>
        
        {/* Viewers indicator */}
        <div className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded-full bg-white text-gray-600 flex items-center">
          <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
          {viewersCount}
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 truncate">{producer.name}</h3>
          <div className="flex items-center text-sm">
            <Star className="text-yellow-500 w-4 h-4 mr-1" />
            <span>{producer.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mt-1 line-clamp-2 h-10">
          {producer.description}
        </p>
        
        {/* Available items preview */}
        <div className="mt-3 flex flex-wrap gap-1">
          {producer.items.slice(0, 3).map((item, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 bg-gray-100 rounded-full truncate max-w-[140px]"
            >
              {item}
            </span>
          ))}
          {producer.items.length > 3 && (
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
              +{producer.items.length - 3} more
            </span>
          )}
        </div>
        
        {/* Walking time */}
        <div className="mt-3 text-sm text-gray-500 flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>{producer.walkTime} min walk</span>
        </div>
        
        {/* Action button */}
        <button className="mt-3 w-full bg-primary text-white py-2 rounded-full text-sm font-medium">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ProducerGrid;