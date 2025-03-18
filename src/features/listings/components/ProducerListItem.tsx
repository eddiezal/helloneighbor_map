// src/features/listings/components/ProducerListItem.tsx

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Producer } from '../../../core/types/Producer';
import { Star, Heart, MessageCircle, ChevronDown, MapPin, Shield, Share2, Award } from 'lucide-react';
import { CATEGORY_COLORS } from '../../map/constants';

interface ProducerListItemProps {
  producer: Producer;
}

const ProducerListItem: React.FC<ProducerListItemProps> = ({ producer }) => {
  const [expanded, setExpanded] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [animateHeart, setAnimateHeart] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Generate stable random viewers count (won't change on re-renders)
  const viewersCount = useMemo(() => Math.floor(Math.random() * 5) + 1, []);
  
  // For 3D tilt effect
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  
  // Availability badge color and text
  const getAvailabilityInfo = () => {
    switch (producer.availability) {
      case 'now':
        return { text: 'Available now', color: '#4CAF50', bgColor: '#4CAF5020' };
      case 'tomorrow':
        return { text: 'Available tomorrow', color: '#FF9800', bgColor: '#FF980020' };
      case 'weekend':
        return { text: 'Available this weekend', color: '#9C27B0', bgColor: '#9C27B020' };
      default:
        return { text: 'Check availability', color: '#757575', bgColor: '#75757520' };
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
  
  // Handle mouse move for 3D effect (subtle)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element
    
    // Calculate rotation based on mouse position
    // Lower values make the effect more subtle
    const tiltX = ((y / rect.height) - 0.5) * 3; // Vertical tilt (3 degrees max)
    const tiltY = ((x / rect.width) - 0.5) * -3; // Horizontal tilt
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.01)`,
      boxShadow: `
        ${-tiltY * 5}px ${tiltX * 5}px 20px rgba(0,0,0,0.1),
        0 4px 8px rgba(0,0,0,0.05)
      `,
      transition: 'none'
    });
  };
  
  // Reset tilt effect when mouse leaves
  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      transition: 'all 0.5s ease-out'
    });
  };
  
  // Toggle expanded state with animation
  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };
  
  // Apply height animation to expanded content
  useEffect(() => {
    if (!expandedContentRef.current) return;
    
    const content = expandedContentRef.current;
    
    if (expanded) {
      const height = content.scrollHeight;
      content.style.maxHeight = `${height}px`;
    } else {
      content.style.maxHeight = '0px';
    }
  }, [expanded]);
  
  // Create image grid for gallery
  const createImageGrid = () => {
    if (!producer.images || producer.images.length === 0) {
      return (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div 
            className="aspect-square rounded-lg flex items-center justify-center text-2xl"
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
          <div 
            key={index} 
            className="aspect-square rounded-lg overflow-hidden transform transition-transform hover:scale-105"
          >
            <img 
              src={img} 
              alt={`${producer.name} product ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback for image loading errors
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f5f5f5'/%3E%3C/svg%3E";
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  // Navigate to producer detail
  const viewProfile = () => {
    navigate(`/producer/${producer.id}`);
  };
  
  // Generate stable random item quantities
  const getItemQuantity = useMemo(() => {
    const quantities: Record<string, number> = {};
    producer.items.forEach(item => {
      quantities[item] = Math.floor(Math.random() * 10) + 1;
    });
    return quantities;
  }, [producer.items]);
  
  return (
    <div 
      ref={cardRef}
      className="relative rounded-xl overflow-hidden transition-all duration-300 bg-white"
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Colored category indicator at the top */}
      <div 
        className="h-1.5 w-full"
        style={{ backgroundColor: categoryColor }}
      />
      
      <div 
        className="p-4 cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-start">
          {/* Producer image with elevation on hover */}
          <div className="w-20 h-20 rounded-xl mr-4 overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center transform transition-transform hover:scale-105 hover:shadow-md">
            {producer.images && producer.images.length > 0 ? (
              <img 
                src={producer.images[0]} 
                alt={producer.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback for image loading errors
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f5f5f5'/%3E%3C/svg%3E";
                }}
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
                  <Star className="text-yellow-500 w-4 h-4 mr-1 fill-current" />
                  <span>{producer.rating}</span>
                  <span className="mx-1 text-gray-400">·</span>
                  <span>{producer.reviews} reviews</span>
                </div>
              </div>
              
              <div className="flex items-center">
                {/* Featured badge if applicable */}
                {producer.featured && (
                  <span className="flex items-center mr-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    <Award className="w-3 h-3 mr-1" />
                    Featured
                  </span>
                )}
                
                {/* Availability badge */}
                <span 
                  className="text-xs px-2 py-1 rounded-full font-medium flex items-center mr-2"
                  style={{ backgroundColor: availability.bgColor, color: availability.color }}
                >
                  <span 
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: availability.color }}
                  ></span>
                  {availability.text}
                </span>
                
                {/* Expand/collapse button with animation */}
                <button 
                  className="text-gray-400 hover:text-gray-600 transition-transform duration-300"
                  style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mt-1 line-clamp-2 leading-relaxed">{producer.description}</p>
            
            <div className="flex items-center justify-between mt-2 text-sm">
              <div className="flex items-center text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{producer.walkTime} min walk</span>
              </div>
              
              {/* Viewers count */}
              <div className="text-xs text-gray-500 flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-1 animate-pulse"></span>
                {viewersCount} {viewersCount === 1 ? 'person' : 'people'} viewing
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expanded content with height animation */}
      <div 
        ref={expandedContentRef}
        className="overflow-hidden transition-all duration-500"
        style={{ maxHeight: 0 }}
      >
        <div className="p-4 pt-0 border-t mt-2">
          {/* Available items with interactive hover effects */}
          <div className="text-sm font-medium text-gray-700 mt-2 mb-2 flex items-center">
            <Shield className="w-4 h-4 mr-1 text-primary" />
            Available Items:
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {producer.items.map((item, index) => (
              <div 
                key={index} 
                className="bg-gray-50 px-3 py-2 rounded-md text-sm hover:shadow-sm hover:bg-gray-100 transition-all cursor-pointer"
              >
                {item}
                <span className="ml-2 text-xs bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">
                  {getItemQuantity[item]}
                </span>
              </div>
            ))}
          </div>
          
          {/* Photo gallery with hover animations */}
          {producer.images && producer.images.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Gallery:</div>
              {createImageGrid()}
            </div>
          )}
          
          {/* Action buttons with micro-interactions */}
          <div className="flex space-x-2 mt-4">
            <button 
              className="flex-1 bg-primary text-white py-2.5 px-4 rounded-xl text-sm font-medium transform transition-transform hover:translate-y-[-2px] hover:shadow-md active:translate-y-0"
              onClick={viewProfile}
            >
              View Profile
            </button>
            <button className="flex-1 border border-gray-300 py-2.5 px-4 rounded-xl text-sm font-medium text-gray-600 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <MessageCircle className="w-4 h-4 mr-1.5" />
              Message
            </button>
            <button 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                favorited 
                  ? 'bg-red-50 text-red-500' 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              } ${animateHeart ? 'animate-heartbeat' : ''}`}
              onClick={toggleFavorite}
              aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
            </button>
            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Animation styles */}
      <style>
        {`
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
        `}
      </style>
    </div>
  );
};

export default ProducerListItem;