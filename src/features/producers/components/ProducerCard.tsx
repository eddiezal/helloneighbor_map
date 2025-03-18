// src/features/producers/components/ProducerCard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Producer } from '../../../core/types/Producer';
import { Star, MapPin, Heart } from 'lucide-react';
import { CATEGORY_COLORS } from '../../map/constants';

interface ProducerCardProps {
  producer: Producer;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Reusable card component for displaying a producer
 * Can be used in various contexts across the app
 */
const ProducerCard: React.FC<ProducerCardProps> = ({ 
  producer, 
  size = 'medium' 
}) => {
  const [favorited, setFavorited] = useState(false);
  const navigate = useNavigate();
  
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
  
  // Format category name
  const getCategoryName = (type: string) => {
    switch(type) {
      case 'baker': return 'Baker';
      case 'gardener': return 'Gardener';
      case 'eggs': return 'Eggs';
      case 'homecook': return 'Home Cook';
      case 'specialty': return 'Specialty';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  // Navigate to producer detail page
  const handleClick = () => {
    navigate(`/producer/${producer.id}`);
  };
  
  // Size-dependent class names
  const getImageHeight = () => {
    switch(size) {
      case 'small': return 'h-32';
      case 'large': return 'h-64';
      default: return 'h-48';
    }
  };
  
  const getTextSize = () => {
    switch(size) {
      case 'small': return 'text-sm';
      case 'large': return 'text-xl';
      default: return 'text-base';
    }
  };
  
  return (
    <div 
      className="rounded-lg overflow-hidden border bg-white hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleClick}
    >
      {/* Card header with image */}
      <div className={`relative ${getImageHeight()}`}>
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
          {getCategoryName(producer.type)}
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
      </div>
      
      {/* Card content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className={`font-semibold text-gray-900 truncate ${getTextSize()}`}>{producer.name}</h3>
          <div className="flex items-center text-sm">
            <Star className="text-yellow-500 w-4 h-4 mr-1 fill-current" />
            <span>{producer.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {producer.description}
        </p>
        
        {/* Walking time */}
        <div className="mt-3 text-sm text-gray-500 flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{producer.walkTime} min walk</span>
        </div>
      </div>
    </div>
  );
};

export default ProducerCard;

// src/features/producers/components/ProducerDetails.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Producer } from '../../../core/types/Producer';
import { 
  Star, 
  Clock, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Share2, 
  Calendar, 
  Info 
} from 'lucide-react';
import { CATEGORY_COLORS } from '../../map/constants';

interface ProducerDetailsProps {
  producer: Producer;
}

/**
 * Component for displaying detailed information about a producer
 */
const ProducerDetails: React.FC<ProducerDetailsProps> = ({ producer }) => {
  const [favorited, setFavorited] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    producer.images && producer.images.length > 0 ? producer.images[0] : null
  );
  const navigate = useNavigate();
  
  // Toggle favorite status
  const toggleFavorite = () => {
    setFavorited(!favorited);
  };
  
  // Get availability text and color
  const getAvailabilityInfo = (availability: string) => {
    switch (availability) {
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
  
  // Get category info
  const categoryColor = CATEGORY_COLORS[producer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
  const availability = getAvailabilityInfo(producer.availability);
  
  // Get category name
  const getCategoryName = (type: string) => {
    switch(type) {
      case 'baker': return 'Baker';
      case 'gardener': return 'Gardener';
      case 'eggs': return 'Eggs';
      case 'homecook': return 'Home Cook';
      case 'specialty': return 'Specialty';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  return (
    <div className="bg-gray-50">
      {/* Image gallery */}
      <div className="mb-6">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          {/* Main image */}
          <div className="relative aspect-video">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt={producer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-6xl"
                style={{ backgroundColor: `${categoryColor}20` }}
              >
                {producer.icon}
              </div>
            )}
            
            {/* Category badge */}
            <div 
              className="absolute top-4 left-4 text-sm px-3 py-1 rounded-full font-medium"
              style={{ backgroundColor: 'white', color: categoryColor }}
            >
              {getCategoryName(producer.type)}
            </div>
            
            {/* Availability badge */}
            <div 
              className="absolute bottom-4 left-4 text-sm px-3 py-1 rounded-full font-medium flex items-center"
              style={{ backgroundColor: 'white', color: availability.color }}
            >
              <span 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: availability.color }}
              ></span>
              {availability.text}
            </div>
          </div>
          
          {/* Thumbnail gallery */}
          {producer.images && producer.images.length > 1 && (
            <div className="p-4 flex space-x-2 overflow-x-auto">
              {producer.images.map((img, index) => (
                <button
                  key={index}
                  className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition ${
                    selectedImage === img ? `border-${categoryColor}` : 'border-transparent'
                  }`}
                  style={{ borderColor: selectedImage === img ? categoryColor : 'transparent' }}
                  onClick={() => setSelectedImage(img)}
                >
                  <img 
                    src={img} 
                    alt={`${producer.name} image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Producer info */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{producer.name}</h1>
            <div className="flex items-center mt-1">
              <Star className="text-yellow-500 w-5 h-5 mr-1 fill-current" />
              <span className="font-medium">{producer.rating}</span>
              <span className="mx-1 text-gray-400">·</span>
              <span className="text-gray-600">{producer.reviews} reviews</span>
            </div>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-1" />
            <span>{producer.walkTime} min walk</span>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">{producer.description}</p>
        
        {/* Key info grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center bg-gray-50 p-3 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-500 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Joined</div>
              <div className="font-medium">March 2023</div>
            </div>
          </div>
          <div className="flex items-center bg-gray-50 p-3 rounded-lg">
            <Info className="w-5 h-5 text-gray-500 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Response Rate</div>
              <div className="font-medium">Usually responds in 1 hour</div>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-primary text-white py-2 px-4 rounded-full font-medium text-sm flex items-center justify-center">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </button>
          <button 
            className={`flex items-center justify-center ${
              favorited 
                ? 'bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-full text-sm font-medium' 
                : 'border border-gray-300 px-4 py-2 rounded-full text-sm font-medium text-gray-600'
            }`}
            onClick={toggleFavorite}
          >
            <Heart className={`w-4 h-4 mr-2 ${favorited ? 'fill-current' : ''}`} />
            {favorited ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
      
      {/* Available items */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Available Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {producer.items.map((item, index) => (
            <div 
              key={index}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
            >
              <span>{item}</span>
              <span className="bg-primary bg-opacity-10 text-primary text-sm px-2 py-1 rounded-full">
                {/* Random quantity */}
                {Math.floor(Math.random() * 10) + 1} available
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProducerDetails;

// src/features/producers/hooks/useProducers.ts
import { useState, useEffect, useMemo } from 'react';
import { Producer } from '../../../core/types/Producer';
import { SortOption } from '../../../core/types/ui.types';

interface UseProducersProps {
  apiUrl?: string;
  initialProducers?: Producer[];
}

/**
 * Hook for managing producers data and state
 */
export const useProducers = ({ 
  apiUrl = '/api/producers', 
  initialProducers = [] 
}: UseProducersProps = {}) => {
  const [producers, setProducers] = useState<Producer[]>(initialProducers);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch producers from API
  const fetchProducers = async () => {
    // If we have initial producers, don't fetch
    if (initialProducers.length > 0) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // For demo purposes, we're not actually making an API call
      // In a real app, this would be:
      // const response = await fetch(apiUrl);
      // const data = await response.json();
      // setProducers(data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data
      setProducers(initialProducers);
    } catch (err) {
      setError('Failed to fetch producers');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch producers on mount
  useEffect(() => {
    fetchProducers();
  }, []);
  
  // Get producers by category
  const getProducersByCategory = (category: string) => {
    if (category === 'all') {
      return producers;
    }
    return producers.filter(p => p.type === category);
  };
  
  // Get producers by availability
  const getProducersByAvailability = (availability: string) => {
    if (availability === 'all') {
      return producers;
    }
    return producers.filter(p => p.availability === availability);
  };
  
  // Get producer by ID
  const getProducerById = (id: number) => {
    return producers.find(p => p.id === id) || null;
  };
  
  // Sort producers
  const sortProducers = (producersToSort: Producer[], sortBy: SortOption) => {
    return [...producersToSort].sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'availability': {
          const priority = { now: 0, tomorrow: 1, weekend: 2 };
          return (
            priority[a.availability as keyof typeof priority] - 
            priority[b.availability as keyof typeof priority]
          );
        }
        default:
          return a.distance - b.distance;
      }
    });
  };
  
  // Get featured producers
  const featuredProducers = useMemo(() => {
    return producers.filter(p => p.featured);
  }, [producers]);
  
  return {
    producers,
    isLoading,
    error,
    fetchProducers,
    getProducersByCategory,
    getProducersByAvailability,
    getProducerById,
    sortProducers,
    featuredProducers
  };
};