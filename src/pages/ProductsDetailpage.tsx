import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../core/context/AppContext';
import { Star, Clock, Heart, MessageCircle, ChevronLeft, Map } from 'lucide-react';
import { Producer } from '../features/producers/types/Producer.types';
import { CATEGORY_COLORS } from '../features/map/constants';

const ProducerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { producers } = useAppContext();
  const [producer, setProducer] = useState<Producer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  
  useEffect(() => {
    const fetchProducer = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll just find the producer from our context
        if (id) {
          const producerId = parseInt(id);
          const foundProducer = producers.find(p => p.id === producerId);
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          setProducer(foundProducer || null);
        }
      } catch (error) {
        console.error('Error fetching producer:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducer();
  }, [id, producers]);
  
  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };
  
  // Get category color
  const getCategoryColor = (type: string): string => {
    return CATEGORY_COLORS[type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
  };
  
  // Get availability info
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
  
  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading producer details...</p>
        </div>
      </div>
    );
  }
  
  // Producer not found
  if (!producer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Producer Not Found</h2>
          <p className="text-gray-600 mb-6">
            The producer you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  // Get availability and category color
  const availability = getAvailabilityInfo(producer.availability);
  const categoryColor = getCategoryColor(producer.type);
  const categoryName = {
    'baker': 'Baker',
    'gardener': 'Gardener',
    'eggs': 'Eggs',
    'homecook': 'Home Cook',
    'specialty': 'Specialty'
  }[producer.type] || producer.type;
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-primary mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to all neighbors
      </Link>
      
      {/* Producer header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Cover image/header */}
        <div 
          className="h-48 md:h-64 bg-gray-200 relative"
          style={{
            backgroundImage: producer.images && producer.images.length > 0 
              ? `url(${producer.images[0]})`
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Category badge */}
          <div 
            className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: 'white', color: categoryColor }}
          >
            {categoryName}
          </div>
          
          {/* Availability badge */}
          <div 
            className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-sm font-medium flex items-center"
            style={{ backgroundColor: 'white', color: availability.color }}
          >
            <span 
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: availability.color }}
            ></span>
            {availability.text}
          </div>
        </div>
        
        {/* Producer info */}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{producer.name}</h1>
              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  <Star className="text-yellow-500 w-5 h-5" />
                  <span className="ml-1 font-medium">{producer.rating}</span>
                </div>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600">{producer.reviews} reviews</span>
                <span className="mx-2 text-gray-400">•</span>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{producer.walkTime} min walk</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full ${
                  isFavorited 
                    ? 'bg-red-50 text-red-500 border border-red-200' 
                    : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                }`}
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              
              <button
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full border border-gray-200 hover:bg-gray-200"
              >
                <Map className="w-4 h-4 mr-2" />
                View on Map
              </button>
            </div>
          </div>
          
          <p className="mt-4 text-gray-700">{producer.description}</p>
        </div>
        
        {/* Available items section */}
        <div className="px-6 pt-2 pb-6 border-t">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {producer.items.map((item, index) => (
              <div 
                key={index}
                className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
              >
                <span className="text-gray-800">{item}</span>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  Available
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Image gallery */}
        {producer.images && producer.images.length > 0 && (
          <div className="px-6 pt-2 pb-6 border-t">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {producer.images.map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`${producer.name} product ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Contact section */}
        <div className="px-6 pt-2 pb-6 border-t">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-4">
              Interested in {producer.name}'s items? Send them a message to inquire about availability, 
              pricing, or to arrange a pickup.
            </p>
            <button className="w-full py-2 bg-primary text-white rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Message {producer.name.split(' ')[0]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerDetailPage;