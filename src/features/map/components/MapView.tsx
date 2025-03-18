// src/features/map/components/MapView.tsx
import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../../../core/context/AppContext';
import { useMapInteractions } from '../hooks/useMapInteractions';
import { CATEGORY_COLORS } from '../constants';
import { X, Star, Clock } from 'lucide-react';

const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { filteredProducers, selectedProducer, setSelectedProducer } = useAppContext();
  
  // Use our custom hook for map interactions
  const {
    isLoading,
    isGoogleMapsLoaded,
    loadGoogleMapsApi,
    initializeMap,
    createMarkers,
    selectProducerOnMap,
    mapRef
  } = useMapInteractions();
  
  // Load Google Maps API on component mount
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    loadGoogleMapsApi(apiKey);
  }, [loadGoogleMapsApi]);
  
  // Initialize map once API is loaded and container is ready
  useEffect(() => {
    if (isGoogleMapsLoaded && mapContainerRef.current && !mapRef.current) {
      initializeMap(mapContainerRef.current);
    }
  }, [isGoogleMapsLoaded, initializeMap, mapRef]);
  
  // Create markers when filtered producers change
  useEffect(() => {
    if (mapRef.current && isGoogleMapsLoaded && !isLoading) {
      createMarkers(filteredProducers, setSelectedProducer);
    }
  }, [filteredProducers, createMarkers, isGoogleMapsLoaded, isLoading, setSelectedProducer]);
  
  // Update map when selected producer changes
  useEffect(() => {
    if (selectedProducer && mapRef.current) {
      selectProducerOnMap(selectedProducer);
    }
  }, [selectedProducer, selectProducerOnMap]);
  
  // Initialize window namespace for marker click handlers
  useEffect(() => {
    // Safely initialize the HelloNeighbor object
    if (typeof window !== 'undefined') {
      if (!window.HelloNeighbor) {
        window.HelloNeighbor = {};
      }
      
      // Set up the selectProducer function
      window.HelloNeighbor.selectProducer = (producerId: number) => {
        const producer = filteredProducers.find(p => p.id === producerId);
        if (producer) {
          setSelectedProducer(producer);
        }
      };
    }
    
    return () => {
      // Cleanup
      if (typeof window !== 'undefined' && window.HelloNeighbor) {
        window.HelloNeighbor.selectProducer = () => {}; // Empty function on cleanup
      }
    };
  }, [filteredProducers, setSelectedProducer]);
  
  // Handle closing the producer details panel
  const closeProducerDetails = () => {
    setSelectedProducer(null);
  };
  
  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <div className="text-primary font-medium">Loading map...</div>
        </div>
      )}
      
      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
        style={{ minHeight: "400px" }}
        aria-label="Map showing local producers"
      />
      
      {/* Legend with exact matching colors */}
      <div className="absolute bottom-20 left-2 bg-white bg-opacity-90 p-2 rounded-lg shadow-md text-xs">
        <div className="font-medium mb-1">Showing {filteredProducers.length} neighbors</div>
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CATEGORY_COLORS.baker }} aria-hidden="true"></div>
            <span>Bakers</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CATEGORY_COLORS.gardener }} aria-hidden="true"></div>
            <span>Gardeners</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CATEGORY_COLORS.eggs }} aria-hidden="true"></div>
            <span>Eggs</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CATEGORY_COLORS.homecook }} aria-hidden="true"></div>
            <span>Home Cooks</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CATEGORY_COLORS.specialty }} aria-hidden="true"></div>
            <span>Specialty</span>
          </div>
        </div>
      </div>
      
      {/* Selected Producer Card */}
      {selectedProducer && (
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-lg rounded-t-xl">
          <div className="flex justify-between items-start">
            <div className="flex space-x-3">
              {selectedProducer.images && selectedProducer.images.length > 0 ? (
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img 
                    src={selectedProducer.images[0]} 
                    alt={selectedProducer.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                  {selectedProducer.icon}
                </div>
              )}
              <div>
                <h3 className="font-bold text-gray-800">{selectedProducer.name}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="text-yellow-500 mr-1 h-4 w-4" />
                  <span>{selectedProducer.rating} ({selectedProducer.reviews})</span>
                </div>
              </div>
            </div>
            <button 
              onClick={closeProducerDetails}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Close producer details"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mt-2 mb-3 line-clamp-2">
            {selectedProducer.description}
          </p>
          
          <div className="text-sm text-gray-700 flex items-center mb-2">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span>{selectedProducer.walkTime} minute walk</span>
          </div>
          
          {selectedProducer.images && selectedProducer.images.length > 0 && (
            <div className="mt-3 mb-3">
              <div className="text-sm font-medium text-gray-700 mb-2">Product Gallery</div>
              <div className="grid grid-cols-3 gap-2">
                {selectedProducer.images.slice(0, 3).map((img, index) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden">
                    <img 
                      src={img} 
                      alt={`${selectedProducer.name} product ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3 mt-3">
            <button className="bg-primary text-white py-2 px-4 rounded-full font-medium text-sm">
              View Profile
            </button>
            <button className="border border-gray-300 py-2 px-4 rounded-full font-medium text-sm">
              Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;