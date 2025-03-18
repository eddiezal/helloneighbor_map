import React from 'react';
import { Producer } from '../../producers/types/Producer.types';
import { Star, Clock, Heart } from 'lucide-react';

interface ProducerGridProps {
  producers: Producer[];
}

const ProducerGrid: React.FC<ProducerGridProps> = ({ producers }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {producers.map(producer => (
        <ProducerGridItem key={producer.id} producer={producer} />
      ))}
    </div>
  );
};

// Individual grid item component
const ProducerGridItem: React.FC<{ producer: Producer }> = ({ producer }) => {
  const [favorited, setFavorited] = React.useState(false);
  
  // Toggle favorite status
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setFavorited(!favorited);
  };
  
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
  
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 bg-white">
      {/* Image section */}
      <div className="relative aspect-video">
        {producer.images && producer.images.length > 0 ? (
          <img 
            src={producer.images[0]} 
            alt={producer.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-4xl">
            {producer.icon}
          </div>
        )}
        
        {/* Favorite button */}
        <button 
          className={`absolute top-2 right-2 p-2 rounded-full ${
            favorited ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
          }`}
          onClick={toggleFavorite}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>
        
        {/* Availability badge */}
        <div 
          className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded-full font-medium flex items-center bg-black/70 text-white"
        >
          <span 
            className="w-2 h-2 rounded-full mr-1"
            style={{ backgroundColor: availability.color }}
          ></span>
          {availability.text}
        </div>
      </div>
      
      {/* Content section */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-gray-900">{producer.name}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <Star className="text-yellow-500 w-4 h-4 mr-1" />
            <span>{producer.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{producer.description}</p>
        
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          <span>{producer.walkTime} min walk</span>
        </div>
        
        {/* Available items preview */}
        <div className="mt-3 flex flex-wrap gap-1">
          {producer.items.slice(0, 3).map((item, index) => (
            <span 
              key={index}
              className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700"
            >
              {item}
            </span>
          ))}
          {producer.items.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700">
              +{producer.items.length - 3} more
            </span>
          )}
        </div>
        
        {/* Action button */}
        <button className="mt-3 w-full py-2 rounded-lg bg-primary text-white text-sm font-medium">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ProducerGrid;