// src/pages/ProducerDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../core/context/AppContext';
import { Producer } from '../core/types/Producer';
import { ChevronLeft, Share2 } from 'lucide-react';
import ProducerDetails from '../features/producers/components/ProducerDetails';

/**
 * Page for displaying detailed information about a producer
 */
const ProducerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { producers, selectedProducer, setSelectedProducer } = useAppContext();
  const [producer, setProducer] = useState<Producer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch producer data
  useEffect(() => {
    setIsLoading(true);
    
    // If we already have the selected producer from context, use it
    if (selectedProducer && selectedProducer.id === Number(id)) {
      setProducer(selectedProducer);
      setIsLoading(false);
      return;
    }
    
    // Otherwise, find the producer by ID
    const foundProducer = producers.find(p => p.id === Number(id));
    if (foundProducer) {
      setProducer(foundProducer);
      setSelectedProducer(foundProducer);
    } else {
      // Producer not found, redirect to home
      navigate('/');
    }
    
    // Simulate API loading (would be real in production)
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [id, producers, selectedProducer, setSelectedProducer, navigate]);
  
  // Handle back button click
  const handleBack = () => {
    navigate(-1);
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
          <div>
            <button 
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        <ProducerDetails producer={producer} />
      </div>
    </div>
  );
};

export default ProducerDetailPage;