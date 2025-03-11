// src/components/ListView/EnhancedProducerGrid.tsx
import React, { useState } from 'react';
import { Producer } from '../../types/Producer';
import { Star, Clock, Heart, MessageCircle, MapPin, Shield } from 'lucide-react';

// Category color mapping (consistent across the app)
const CATEGORY_COLORS = {
  baker: '#FF5252',     // Red
  gardener: '#4CAF50',  // Green
  eggs: '#FFC107',      // Amber/Yellow
  homecook: '#9C27B0',  // Purple
  specialty: '#FF9800', // Orange
  default: '#2196F3'    // Blue (fallback)
};

interface EnhancedProducerGridProps {
  producers: Producer[];
}

const EnhancedProducerGrid: React.FC<EnhancedProducerGridProps> = ({ producers }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {producers.map((producer, index) => (
        <div 
          key={producer.id}
          className="animate-slideUp"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <EnhancedProducerGridCard producer={producer} />
        </div>
      ))}
    </div>
  );
};

// The individual card component used in the grid
interface EnhancedProducerGridCardProps {
  producer: Producer;
}

const EnhancedProducerGridCard: React.FC<EnhancedProducerGridCardProps> = ({ producer }) => {
  const [favorited, setFavorited] = useState(false);
  const [animateHeart, setAnimateHeart] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  
  // Availability badge color and text
  const getAvailabilityInfo = () => {
    switch (producer.availability) {
      case 'now':
        return { text: 'Available now', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.9)' };
      case 'tomorrow':
        return { text: 'Available tomorrow', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.9)' };
      case 'weekend':
        return { text: 'Available this weekend', color: '#9C27B0', bgColor: 'rgba(156, 39, 176, 0.9)' };
      default:
        return { text: 'Check availability', color: '#757575', bgColor: 'rgba(117, 117, 117, 0.9)' };
    }
  };
  
  const availability = getAvailabilityInfo();
  
  // Get category color
  const categoryColor = CATEGORY_COLORS[producer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
  
  // Toggle favorite status with animation
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorited(prev => !prev);
    
    // Trigger heart animation
    setAnimateHeart(true);
    setTimeout(() => setAnimateHeart(false), 500);
  };
  
  // Random viewers count for social proof
  const viewersCount = Math.floor(Math.random() * 5) + 1;
  
  // Format category name
  const getCategoryName = (type: string) => {
    switch(type) {
      case 'baker': return 'Baker';
      case 'gardener': return 'Gardener';
      case 'eggs': return 'Eggs';
      case 'homecook': return 'Home Cook';
      case 'specialty': return 'Specialty';
      default: return type;
    }
  };
  
  return (
    <div 
      className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1"
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => {
        setCardHovered(false);
        setShowQuickActions(false);
      }}
    >
      {/* Card header with image */}
      <div className="relative h-56">
        {producer.images && producer.images.length > 0 ? (
          <img 
            src={producer.images[0]} 
            alt={producer.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${cardHovered ? 'scale-105' : 'scale-100'}`}
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ backgroundColor: `${categoryColor}20` }}
          >
            {producer.icon}
          </div>
        )}
        
        {/* Semi-transparent gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Category indicator */}
        <div 
          className="absolute top-3 left-3 text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1 bg-white/90 shadow-sm"
          style={{ color: categoryColor }}
        >
          <span className="text-lg">{producer.icon}</span>
          <span>{getCategoryName(producer.type)}</span>
        </div>
        
        {/* Favorite button with animation */}
        <button 
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center ${
            favorited ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
          } shadow-sm transition-all duration-300 ${animateHeart ? 'animate-heartbeat' : ''}`}
          onClick={toggleFavorite}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          style={{ transform: cardHovered ? 'scale(1.1)' : 'scale(1)' }}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>
        
        {/* Quick action buttons - appear on hover */}
        <div 
          className={`absolute bottom-20 right-3 transition-all duration-300 ${
            cardHovered ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-10'
          }`}
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickActions(!showQuickActions);
            }}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center mb-2"
          >
            <MessageCircle className="w-5 h-5 text-primary" />
          </button>
          
          {/* We could add more quick action buttons here */}
        </div>
        
        {/* Producer info on the bottom of the image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-xl drop-shadow-sm">{producer.name}</h3>
          
          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center text-white">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span>{producer.rating}</span>
              <span className="mx-1 opacity-70">·</span>
              <span>{producer.reviews} reviews</span>
            </div>
            
            <div className="flex items-center text-white text-sm">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              <span>{producer.walkTime} min</span>
            </div>
          </div>
        </div>
        
        {/* Availability badge */}
        <div 
          className="absolute bottom-[-12px] left-4 text-xs px-3 py-1.5 rounded-full font-medium text-white shadow-md flex items-center"
          style={{ backgroundColor: availability.bgColor }}
        >
          <span className="w-2 h-2 rounded-full mr-1.5 bg-white"></span>
          {availability.text}
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-4 pt-6">
        <p className="text-gray-600 text-sm line-clamp-2 mb-3 h-10 leading-tight">
          {producer.description}
        </p>
        
        {/* Available items preview */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {producer.items.slice(0, 3).map((item, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 bg-gray-100 rounded-full truncate hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {item}
            </span>
          ))}
          {producer.items.length > 3 && (
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
              +{producer.items.length - 3} more
            </span>
          )}
        </div>
        
        {/* Viewers indicator */}
        <div className="text-xs text-gray-500 flex items-center mb-4">
          <span className="w-2 h-2 bg-red-400 rounded-full mr-1.5 animate-pulse"></span>
          {viewersCount} {viewersCount === 1 ? 'person' : 'people'} viewing now
        </div>
        
        {/* Action button */}
        <button className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors transform hover:-translate-y-0.5">
          View Profile
        </button>
      </div>
      
      {/* Quick action panel that appears when message button is clicked */}
      {showQuickActions && (
        <div className="absolute right-4 bottom-20 bg-white p-3 rounded-lg shadow-lg z-10 w-48 animate-fadeIn">
          <div className="text-xs font-medium text-gray-500 mb-2">QUICK ACTIONS</div>
          <div className="space-y-2">
            <button className="w-full text-left text-sm p-2 hover:bg-gray-100 rounded flex items-center">
              <MessageCircle className="w-4 h-4 mr-2 text-primary" />
              Send Message
            </button>
            <button className="w-full text-left text-sm p-2 hover:bg-gray-100 rounded flex items-center">
              <Shield className="w-4 h-4 mr-2 text-primary" />
              View Products ({producer.items.length})
            </button>
          </div>
        </div>
      )}
      
      {/* Animation styles */}
      <style jsx>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(1); }
          75% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        
        .animate-heartbeat {
          animation: heartbeat 0.5s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EnhancedProducerGrid;