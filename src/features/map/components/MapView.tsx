import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useMapInteractions } from '../hooks/useMapInteractions';
import { Producer } from '../../producers/types/Producer.types';
import { X, Star, Clock } from 'lucide-react';
import { CATEGORY_COLORS } from '../constants';

// TypeScript declaration for Google Maps related types
declare global {
  interface Window {
    HelloNeighbor?: {
      selectProducer: (id: number) => void;
    };
    google: any;
    [key: string]: any; // For dynamic callback names
  }
}

interface MapViewProps {
  producers: Producer[];
  selectedCategory: string;
  filterAvailability: string;
}

const MapView: React.FC<MapViewProps> = ({ 
  producers, 
  selectedCategory, 
  filterAvailability 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  
  // Use our custom hook for map interactions
  const { 
    loadGoogleMapsApi, 
    createMarkers, 
    createEnhancedInfoWindow, 
    createImageGrid 
  } = useMapInteractions();

  // Filter producers
  const filteredProducers = producers.filter(producer => {
    if (selectedCategory !== 'all' && producer.type !== selectedCategory) {
      return false;
    }
    
    if (filterAvailability === 'now' && producer.availability !== 'now') {
      return false;
    }
    
    return true;
  });

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;
      
      try {
        setIsLoading(true);
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
        
        // Load Google Maps API
        await loadGoogleMapsApi(apiKey);
        
        // Create map if it doesn't exist
        if (!mapInstanceRef.current && window.google && window.google.maps) {
          // Center coordinates - San Diego
          const center = { lat: 32.7000, lng: -117.1500 };
          
          mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 10,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: true
          });
        }
        
        // Update the global selectProducer function
        if (window.HelloNeighbor) {
          window.HelloNeighbor.selectProducer = (producerId: number) => {
            const producer = producers.find(p => p.id === producerId);
            if (producer) {
              setSelectedProducer(producer);
              if (infoWindowRef.current) {
                infoWindowRef.current.close();
              }
            }
          };
        }
        
        // Create info window if it doesn't exist
        if (!infoWindowRef.current) {
          infoWindowRef.current = new window.google.maps.InfoWindow({
            maxWidth: 320
          });
        }
        
        // Create markers
        createMarkers(
          mapInstanceRef.current,
          infoWindowRef.current, 
          filteredProducers, 
          markersRef,
          setSelectedProducer
        );
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setIsLoading(false);
      }
    };
    
    initMap();
    
    // Cleanup
    return () => {
      // Clear markers on unmount
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
      }
      
      // Close info window
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, [producers, createMarkers, loadGoogleMapsApi]);
  
  // Recreate markers when filters change
  useEffect(() => {
    if (mapInstanceRef.current && !isLoading) {
      createMarkers(
        mapInstanceRef.current,
        infoWindowRef.current, 
        filteredProducers, 
        markersRef,
        setSelectedProducer
      );
    }
  }, [selectedCategory, filterAvailability, filteredProducers, createMarkers, isLoading]);
  
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
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: "400px" }}
        aria-label="Map showing local producers"
      ></div>
      
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
              {(() => {
                if (selectedProducer.images && selectedProducer.images.length > 0) {
                  return (
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <img 
                        src={selectedProducer.images[0]} 
                        alt={selectedProducer.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                } else {
                  return (
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                      {selectedProducer.icon}
                    </div>
                  );
                }
              })()}
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
          
          {/* Photo gallery */}
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