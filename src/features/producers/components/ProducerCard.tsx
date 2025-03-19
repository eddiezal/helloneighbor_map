import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Producer } from '../../core/types/Producer';
import { Heart, Star, Clock, MapPin, MessageCircle, Shield, Award } from 'lucide-react';

// Category colors for consistent styling across the application
const CATEGORY_COLORS = {
  baker: '#FF5252',     // Red
  gardener: '#4CAF50',  // Green
  eggs: '#FFC107',      // Amber/Yellow
  homecook: '#9C27B0',  // Purple
  specialty: '#FF9800', // Orange
  default: '#2196F3'    // Blue (fallback)
};

interface ProducerCardProps {
  producer: Producer;
  variant?: 'compact' | 'standard' | 'featured';
  onFavoriteToggle?: (producer: Producer, isFavorited: boolean) => void;
  showActions?: boolean;
  className?: string;
}

const ProducerCard: React.FC<ProducerCardProps> = ({ 
  producer, 
  variant = 'standard',
  onFavoriteToggle,
  showActions = true,
  className = ''
}) => {
  const [favorited, setFavorited] = useState(false);
  const [animateHeart, setAnimateHeart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  // Generate stable random viewers count for social proof
  const [viewersCount] = useState(() => Math.floor(Math.random() * 5) + 1);
  
  // Get availability info with appropriate colors
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
  
  // Get category color based on producer type
  const categoryColor = CATEGORY_COLORS[producer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
  
  // Format category name for display
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
  
  // Toggle favorite status with animation
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !favorited;
    setFavorited(newState);
    
    // Trigger heart animation
    setAnimateHeart(true);
    setTimeout(() => setAnimateHeart(false), 500);
    
    // Call the parent handler if provided
    if (onFavoriteToggle) {
      onFavoriteToggle(producer, newState);
    }
  };
  
  // Navigate to producer detail page
  const viewProfile = () => {
    navigate(`/producer/${producer.id}`);
  };
  
  // Handle message button click
  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would open a message dialog or navigate to messaging
    console.log('Send message to:', producer.name);
  };
  
  // Render compact card variant (smaller, horizontal layout)
  const renderCompactCard = () => {
    return (
      <div 
        className={`rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${className}`}
        onClick={viewProfile}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex">
          {/* Image or icon container */}
          <div className="w-20 h-20 flex-shrink-0">
            {producer.images && producer.images.length > 0 ? (
              <img 
                src={producer.images[0]} 
                alt={producer.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23${categoryColor.substring(1)}'/%3E%3Ctext x='50' y='50' font-size='24' text-anchor='middle' dominant-baseline='middle' fill='white'%3E${producer.icon}%3C/text%3E%3C/svg%3E`;
                }}
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: `${categoryColor}20` }}
              >
                <span className="text-2xl">{producer.icon}</span>
              </div>
            )}
          </div>
          
          {/* Content container */}
          <div className="p-3 flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-sm text-gray-900 truncate">{producer.name}</h3>
              <div className="flex items-center text-xs">
                <Star className="text-yellow-500 w-3 h-3 mr-0.5 fill-current" />
                <span>{producer.rating}</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 line-clamp-1 mt-1">{producer.description}</p>
            
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs flex items-center text-gray-500">
                <MapPin className="w-3 h-3 mr-0.5" />
                {producer.walkTime} min
              </span>
              
              <span 
                className="text-xs px-1.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: availability.color }}
              >
                {availability.text.replace('Available ', '')}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render standard card variant (most common usage)
  const renderStandardCard = () => {
    return (
      <div 
        className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white cursor-pointer ${className}`}
        onClick={viewProfile}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card header with image */}
        <div className="relative h-48">
          {producer.images && producer.images.length > 0 ? (
            <img 
              src={producer.images[0]} 
              alt={producer.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23${categoryColor.substring(1)}20'/%3E%3Ctext x='50' y='50' font-size='24' text-anchor='middle' dominant-baseline='middle' fill='%23${categoryColor.substring(1)}'%3E${producer.icon}%3C/text%3E%3C/svg%3E`;
              }}
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
          
          {/* Featured badge if applicable */}
          {producer.featured && (
            <div className="absolute top-3 right-12 text-xs px-2 py-1 rounded-full font-medium flex items-center bg-yellow-400 text-yellow-900">
              <Award className="w-3 h-3 mr-1" />
              <span>Featured</span>
            </div>
          )}
          
          {/* Favorite button with animation */}
          <button 
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center ${
              favorited ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
            } shadow-sm transition-all duration-300 ${animateHeart ? 'animate-heartbeat' : ''}`}
            onClick={toggleFavorite}
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
          
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
          <div className="flex flex-wrap gap-1.5 mb-4">
            {producer.items.slice(0, 3).map((item, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 rounded-full truncate hover:bg-gray-200 transition-colors"
              >
                {item}
              </span>
            ))}
            {producer.items.length > 3 && (
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                +{producer.items.length - 3} more
              </span>
            )}
          </div>
          
          {/* Viewers indicator for social proof */}
          <div className="text-xs text-gray-500 flex items-center mb-3">
            <span className="w-2 h-2 bg-red-400 rounded-full mr-1.5 animate-pulse"></span>
            {viewersCount} {viewersCount === 1 ? 'person' : 'people'} viewing now
          </div>
          
          {/* Action buttons */}
          {showActions && (
            <div className="flex gap-2">
              <button 
                className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  viewProfile();
                }}
              >
                View Profile
              </button>
              
              <button 
                className="w-10 flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                onClick={handleMessage}
                aria-label="Message"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render featured card variant (larger, more prominent display)
  const renderFeaturedCard = () => {
    return (
      <div 
        className={`rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-white cursor-pointer border-2 ${className}`}
        style={{ borderColor: categoryColor }}
        onClick={viewProfile}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image section */}
          <div className="relative h-48 md:w-1/2 md:h-auto">
            {producer.images && producer.images.length > 0 ? (
              <img 
                src={producer.images[0]} 
                alt={producer.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23${categoryColor.substring(1)}20'/%3E%3Ctext x='50' y='50' font-size='24' text-anchor='middle' dominant-baseline='middle' fill='%23${categoryColor.substring(1)}'%3E${producer.icon}%3C/text%3E%3C/svg%3E`;
                }}
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-6xl"
                style={{ backgroundColor: `${categoryColor}20` }}
              >
                {producer.icon}
              </div>
            )}
            
            {/* Featured badge */}
            <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full flex items-center shadow-md">
              <Award className="w-4 h-4 mr-1.5" />
              <span className="font-medium">Featured Neighbor</span>
            </div>
            
            {/* Availability badge */}
            <div 
              className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full font-medium text-white shadow-md flex items-center"
              style={{ backgroundColor: availability.bgColor }}
            >
              <span className="w-2 h-2 rounded-full mr-1.5 bg-white"></span>
              {availability.text}
            </div>
            
            {/* Category badge */}
            <div 
              className="absolute top-3 right-3 text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1 bg-white/90 shadow-sm"
              style={{ color: categoryColor }}
            >
              <span className="text-lg">{producer.icon}</span>
              <span>{getCategoryName(producer.type)}</span>
            </div>
          </div>
          
          {/* Content section */}
          <div className="p-5 md:w-1/2 flex flex-col">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-900">{producer.name}</h3>
              <button 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  favorited ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${animateHeart ? 'animate-heartbeat' : ''}`}
                onClick={toggleFavorite}
                aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            <div className="flex items-center mt-1 mb-3">
              <Star className="text-yellow-500 w-4 h-4 mr-1 fill-current" />
              <span className="font-medium">{producer.rating}</span>
              <span className="mx-1 text-gray-400">·</span>
              <span className="text-gray-600">{producer.reviews} reviews</span>
            </div>
            
            <p className="text-gray-600 text-sm flex-grow mb-4">
              {producer.description}
            </p>
            
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-1.5 text-primary" />
                Available Items:
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {producer.items.map((item, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-1 bg-gray-100 rounded-full truncate hover:bg-gray-200 transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{producer.walkTime} min walk</span>
              </div>
              
              <div className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-1.5 animate-pulse"></span>
                <span className="text-xs">{viewersCount} viewing</span>
              </div>
            </div>
            
            {showActions && (
              <div className="flex gap-2">
                <button 
                  className="flex-1 bg-primary text-white py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    viewProfile();
                  }}
                >
                  View Profile
                </button>
                
                <button 
                  className="flex-1 border border-gray-300 py-2.5 rounded-full text-sm font-medium text-gray-600 flex items-center justify-center hover:bg-gray-50"
                  onClick={handleMessage}
                >
                  <MessageCircle className="w-4 h-4 mr-1.5" />
                  Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Render the appropriate card variant based on the prop
  if (variant === 'compact') return renderCompactCard();
  if (variant === 'featured') return renderFeaturedCard();
  return renderStandardCard();
};

export default ProducerCard;

// This custom CSS is needed for the heart animation
// In your global styles, add:
/*
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
*/