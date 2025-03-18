// src/features/map/hooks/useMapInteractions.ts
import { useCallback, useState, useRef, useEffect } from 'react';
import { Producer } from '../../producers/types/producer.types';
import { useAppContext } from '../../../core/context/AppContext';

// Type definitions for Google Maps
interface MapRef {
  current: google.maps.Map | null;
}

interface MarkerRef {
  current: google.maps.Marker[];
}

interface InfoWindowRef {
  current: google.maps.InfoWindow | null;
}

// Define category colors for consistent use
export const CATEGORY_COLORS = {
  baker: '#FF5252',     // Red
  gardener: '#4CAF50',  // Green
  eggs: '#FFC107',      // Amber/Yellow
  homecook: '#9C27B0',  // Purple
  specialty: '#FF9800', // Orange
  default: '#2196F3'    // Blue (fallback)
};

/**
 * Custom hook to handle map interactions including markers, info windows, etc.
 */
export const useMapInteractions = () => {
  const { filteredProducers, setSelectedProducer } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs for map objects
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  
  // Track if Google Maps API is loaded
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  
  // Function to load Google Maps API
  const loadGoogleMapsApi = useCallback(async () => {
    if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
      return;
    }
    
    return new Promise<void>((resolve, reject) => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      const callbackName = `googleMapsInitialized_${Date.now()}`;
      
      window[callbackName] = () => {
        setIsGoogleMapsLoaded(true);
        resolve();
        delete window[callbackName];
      };
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}&loading=async`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        reject(new Error('Failed to load Google Maps API'));
        delete window[callbackName];
      };
      
      document.head.appendChild(script);
    });
  }, []);
  
  // Initialize map
  const initializeMap = useCallback((mapElement: HTMLElement) => {
    if (!window.google || !window.google.maps) {
      return;
    }
    
    // Center coordinates - San Diego
    const center = { lat: 32.7157, lng: -117.1611 };
    
    mapRef.current = new window.google.maps.Map(mapElement, {
      center,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });
    
    // Create info window
    infoWindowRef.current = new window.google.maps.InfoWindow({
      maxWidth: 320
    });
    
    setIsLoading(false);
  }, []);
  
  // Create markers on the map
  const createMarkers = useCallback(() => {
    if (!mapRef.current || !window.google || !window.google.maps) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Add markers for each producer
    filteredProducers.forEach(producer => {
      if (!mapRef.current || !window.google || !window.google.maps) return;
      
      const color = CATEGORY_COLORS[producer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
      
      // Create standard marker
      const marker = new window.google.maps.Marker({
        position: { lat: producer.lat, lng: producer.lng },
        map: mapRef.current,
        title: producer.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 0.8,
          strokeColor: '#FFFFFF',
          strokeWeight: producer.featured ? 2 : 1,
          scale: producer.featured ? 10 : 8
        }
      });
      
      markersRef.current.push(marker);
      
      // Add event listeners
      marker.addListener('mouseover', () => {
        if (infoWindowRef.current) {
          try {
            infoWindowRef.current.setContent(createInfoWindowContent(producer));
            infoWindowRef.current.open(mapRef.current, marker);
          } catch (e) {
            console.error('Error showing info window', e);
          }
        }
      });
      
      marker.addListener('mouseout', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
      });
      
      marker.addListener('click', () => {
        setSelectedProducer(producer);
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
      });
    });
  }, [filteredProducers, setSelectedProducer]);
  
  // Create info window content
  const createInfoWindowContent = useCallback((producer: Producer): string => {
    const color = CATEGORY_COLORS[producer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
    
    // Create star rating HTML
    const createStarRating = (rating: number): string => {
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 >= 0.5;
      const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
      
      return `
        <div style="display: inline-flex; align-items: center;">
          ${Array(fullStars).fill('<span style="color: #FFD700;">★</span>').join('')}
          ${halfStar ? '<span style="color: #FFD700;">★</span>' : ''}
          ${Array(emptyStars).fill('<span style="color: #D3D3D3;">★</span>').join('')}
          <span style="margin-left: 4px; font-size: 12px; color: #555;">${rating}</span>
        </div>
      `;
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
    
    const availability = getAvailabilityInfo(producer.availability);
    
    return `
      <div style="width: 280px; padding: 0; border-radius: 8px; overflow: hidden; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;">
        <div style="padding: 12px; background-color: white;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 6px;">
            <div style="font-size: 16px; font-weight: bold;">${producer.name}</div>
          </div>
          
          <div style="display: flex; align-items: center; margin-bottom: 6px;">
            ${createStarRating(producer.rating)}
            <span style="color: #666; font-size: 12px; margin-left: 4px;">(${producer.reviews})</span>
          </div>
          
          <div style="color: #444; margin-bottom: 10px; font-size: 13px;">
            ${producer.description.length > 100 ? producer.description.substring(0, 100) + '...' : producer.description}
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <span style="display: inline-flex; align-items: center; font-size: 12px; color: ${availability.color}; font-weight: 500;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${availability.color}; margin-right: 4px;"></span>
              ${availability.text}
            </span>
            <span style="font-size: 12px; color: #666; display: flex; align-items: center;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              ${producer.walkTime} min walk
            </span>
          </div>
          
          <button 
            style="width: 100%; background-color: #2A5D3C; color: white; border: none; border-radius: 20px; padding: 8px 0; font-size: 12px; font-weight: 600; cursor: pointer; margin-top: 10px;"
            onclick="window.HelloNeighbor && window.HelloNeighbor.selectProducer(${producer.id})"
          >View Profile</button>
        </div>
      </div>
    `;
  }, []);
  
  // Update markers when producers change
  useEffect(() => {
    if (mapRef.current && isGoogleMapsLoaded && !isLoading) {
      createMarkers();
    }
  }, [filteredProducers, createMarkers, isGoogleMapsLoaded, isLoading]);
  
  // Function to select a producer and center the map on it
  const selectProducerOnMap = useCallback((producer: Producer) => {
    if (!mapRef.current || !isGoogleMapsLoaded) return;
    
    // Center map on producer
    mapRef.current.setCenter({ lat: producer.lat, lng: producer.lng });
    mapRef.current.setZoom(15);
    
    // Find and highlight the marker
    const marker = markersRef.current.find(m => 
      m.getPosition()?.lat() === producer.lat && 
      m.getPosition()?.lng() === producer.lng
    );
    
    if (marker && infoWindowRef.current) {
      infoWindowRef.current.setContent(createInfoWindowContent(producer));
      infoWindowRef.current.open(mapRef.current, marker);
    }
    
    // Update selected producer in context
    setSelectedProducer(producer);
  }, [isGoogleMapsLoaded, createInfoWindowContent, setSelectedProducer]);
  
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
  
  // Clear markers on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, []);
  
  return {
    isLoading,
    isGoogleMapsLoaded,
    loadGoogleMapsApi,
    initializeMap,
    createMarkers,
    selectProducerOnMap,
    mapRef,
  };
};

// src/features/map/components/MapView.tsx
import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../../../core/context/AppContext';
import { useMapInteractions, CATEGORY_COLORS } from '../hooks/useMapInteractions';
import { X, Star, Clock } from 'lucide-react';

const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { filteredProducers, selectedProducer, setSelectedProducer } = useAppContext();
  
  const {
    isLoading,
    isGoogleMapsLoaded,
    loadGoogleMapsApi,
    initializeMap,
    mapRef,
  } = useMapInteractions();
  
  // Load Google Maps API on component mount
  useEffect(() => {
    loadGoogleMapsApi();
  }, [loadGoogleMapsApi]);
  
  // Initialize map once API is loaded and container is ready
  useEffect(() => {
    if (isGoogleMapsLoaded && mapContainerRef.current && !mapRef.current) {
      initializeMap(mapContainerRef.current);
    }
  }, [isGoogleMapsLoaded, initializeMap, mapRef]);
  
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