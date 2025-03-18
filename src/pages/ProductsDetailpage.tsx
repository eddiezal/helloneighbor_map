// src/pages/ProducerDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../core/context/AppContext';
import { Producer } from '../features/producers/types/producer.types';
import { 
  Star, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  Calendar, 
  Info
} from 'lucide-react';

// Category color mapping (should be consistent across the app)
const CATEGORY_COLORS = {
  baker: '#FF5252',     // Red
  gardener: '#4CAF50',  // Green
  eggs: '#FFC107',      // Amber/Yellow
  homecook: '#9C27B0',  // Purple
  specialty: '#FF9800', // Orange
  default: '#2196F3'    // Blue (fallback)
};

/**
 * ProducerDetailPage displays detailed information about a producer/neighbor
 */
const ProducerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { producers, selectedProducer, setSelectedProducer } = useAppContext();
  const [producer, setProducer] = useState<Producer | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch producer data if needed
  useEffect(() => {
    setIsLoading(true);
    
    // If we have a selected producer from context, use it
    if (selectedProducer && selectedProducer.id === Number(id)) {
      setProducer(selectedProducer);
      if (selectedProducer.images && selectedProducer.images.length > 0) {
        setSelectedImage(selectedProducer.images[0]);
      }
      setIsLoading(false);
      return;
    }
    
    // Otherwise, find the producer by ID
    const foundProducer = producers.find(p => p.id === Number(id));
    if (foundProducer) {
      setProducer(foundProducer);
      setSelectedProducer(foundProducer);
      if (foundProducer.images && foundProducer.images.length > 0) {
        setSelectedImage(foundProducer.images[0]);
      }
    } else {
      // Producer not found, redirect to home
      navigate('/');
    }
    
    // Simulate API loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [id, producers, selectedProducer, setSelectedProducer, navigate]);
  
  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };
  
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
  
  // Show loading state
  if (isLoading || !producer) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 w-40 bg-gray-200 rounded mb-4"></div>
        <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-8 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
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
    <div className="bg-gray-50 min-h-screen">
      {/* Header with back button */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <button 
            onClick={handleBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold flex-1 truncate">{producer.name}</h1>
          <div className="flex space-x-2">
            <button 
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              className={`p-2 rounded-full ${favorited ? 'text-red-500' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={toggleFavorite}
              aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
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
              <div className="p-4 flex space-x-2 overflow-x-auto no-scrollbar">
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
                <Star className="text-yellow-500 w-5 h-5 mr-1" />
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
            <button className="btn-primary flex items-center justify-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </button>
            <button 
              className={`flex items-center justify-center ${
                favorited 
                  ? 'bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-full text-sm font-medium' 
                  : 'btn-secondary'
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
        
        {/* Reviews section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Reviews</h2>
            <button className="text-primary text-sm font-medium">View all</button>
          </div>
          
          {/* Sample reviews */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                    <div>
                      <div className="font-medium">Customer {i + 1}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(Date.now() - (i * 7 + 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="text-yellow-500 w-4 h-4 mr-1" />
                    <span>{Math.floor(Math.random() * 2) + 4}.{Math.floor(Math.random() * 10)}</span>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">
                  {[
                    "Great quality products! Very fresh and delicious. Will definitely buy again.",
                    "Amazing service and super friendly. The homemade bread was still warm when I picked it up.",
                    "Excellent experience! The vegetables were freshly harvested. Supporting local neighbors feels great."
                  ][i]}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Location */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Location</h2>
          <div className="bg-gray-200 rounded-lg h-40 mb-3 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <p className="text-gray-600 text-center">
            Within {producer.walkTime} minute walk ({producer.distance.toFixed(1)} miles) from your location
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProducerDetailPage;