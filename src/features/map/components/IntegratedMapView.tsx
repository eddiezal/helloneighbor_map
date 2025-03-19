// src/features/map/components/IntegratedMapView.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, X } from 'lucide-react';
import { useAppContext } from '../../../core/context/AppContext';
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

// Track if Google Maps API is already being loaded to avoid duplicate loading
let isLoadingGoogleMaps = false;
let googleMapsLoadedPromise: Promise<void> | null = null;

// Helper function to load Google Maps API once
const loadGoogleMapsApi = (apiKey: string): Promise<void> => {
  if (window.google && window.google.maps) {
    return Promise.resolve();
  }
  
  if (googleMapsLoadedPromise) {
    return googleMapsLoadedPromise;
  }
  
  googleMapsLoadedPromise = new Promise((resolve, reject) => {
    if (isLoadingGoogleMaps) {
      // Check periodically if Maps is loaded
      const checkIfLoaded = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkIfLoaded);
          resolve();
        }
      }, 100);
      return;
    }
    
    isLoadingGoogleMaps = true;
    
    // Use callback name to ensure we don't get conflicts
    const callbackName = `googleMapsInitialized_${Date.now()}`;
    window[callbackName] = () => {
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
      isLoadingGoogleMaps = false;
      googleMapsLoadedPromise = null;
    };
    
    document.head.appendChild(script);
  });
  
  return googleMapsLoadedPromise;
};

const IntegratedMapView: React.FC = () => {
  const { filteredProducers, selectedProducer, setSelectedProducer } = useAppContext();
  const navigate = useNavigate();
  
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  
  // Helper function to create star rating HTML
  const createStarRating = useCallback((rating: number): string => {
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
  }, []);
  
  // Get availability text and color
  const getAvailabilityInfo = useCallback((availability: string) => {
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
  }, []);
  
  // Create info window content
  const createInfoWindowContent = useCallback((producer: any): string => {
    const availability = getAvailabilityInfo(producer.availability);
    const color = CATEGORY_COLORS[producer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
    
    // Create image HTML
    const imageHtml = producer.images && producer.images.length > 0
      ? `<img src="${producer.images[0]}" alt="${producer.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px 8px 0 0;">`
      : `<div style="width: 100%; height: 120px; display: flex; align-items: center; justify-content: center; background-color: ${color}20; border-radius: 8px 8px 0 0;"><span style="font-size: 24px;">${producer.icon}</span></div>`;
    
    return `
      <div style="width: 240px; padding: 0; border-radius: 8px; overflow: hidden; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        ${imageHtml}
        <div style="padding: 12px;">
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 4px;">${producer.name}</div>
          
          <div style="display: flex; align-items: center; margin-bottom: 6px;">
            ${createStarRating(producer.rating)}
            <span style="color: #666; font-size: 12px; margin-left: 4px;">(${producer.reviews})</span>
          </div>
          
          <div style="color: #444; margin-bottom: 8px; font-size: 13px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height: 1.3;">
            ${producer.description}
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
            <span style="display: inline-flex; align-items: center; font-size: 12px; color: ${availability.color}; font-weight: 500;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${availability.color}; margin-right: 4px;"></span>
              ${availability.text}
            </span>
            <span style="font-size: 12px; color: #666;">${producer.walkTime} min walk</span>
          </div>
          
          <button 
            style="width: 100%; background-color: #2A5D3C; color: white; border: none; border-radius: 20px; padding: 8px 0; font-size: 12px; font-weight: 600; cursor: pointer; margin-top: 8px;"
            onclick="window.HelloNeighbor && window.HelloNeighbor.selectProducer(${producer.id})"
          >View Profile</button>
        </div>
      </div>
    `;
  }, [createStarRating, getAvailabilityInfo]);

  // Function to create markers on the map
  const createMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !window.google || !window.google.maps) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Add markers for each producer
    filteredProducers.forEach(producer => {
      if (!mapInstanceRef.current || !window.google || !window.google.maps) return;
      
      const color = CATEGORY_COLORS[producer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
      
      // Create marker
      const marker = new window.google.maps.Marker({
        position: { lat: producer.lat, lng: producer.lng },
        map: mapInstanceRef.current,
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
            infoWindowRef.current.open(mapInstanceRef.current, marker);
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
  }, [filteredProducers, createInfoWindowContent, setSelectedProducer]);

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
          const center = { lat: 32.7157, lng: -117.1611 };
          
          mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
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
        }
        
        // Set up global handler for info window clicks
        if (window.HelloNeighbor) {
          window.HelloNeighbor.selectProducer = (producerId: number) => {
            const producer = filteredProducers.find(p => p.id === producerId);
            if (producer) {
              setSelectedProducer(producer);
            }
          };
        } else {
          window.HelloNeighbor = {
            selectProducer: (producerId: number) => {
              const producer = filteredProducers.find(p => p.id === producerId);
              if (producer) {
                setSelectedProducer(producer);
              }
            }
          };
        }
        
        // Create info window if it doesn't exist
        if (!infoWindowRef.current) {
          infoWindowRef.current = new window.google.maps.InfoWindow({
            maxWidth: 300
          });
        }
        
        // Create markers
        createMarkers();
        
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
  }, [createMarkers, filteredProducers, setSelectedProducer]);
  
  // Update markers when producers change
  useEffect(() => {
    if (mapInstanceRef.current && !isLoading) {
      createMarkers();
    }
  }, [filteredProducers, createMarkers, isLoading]);

  // Update map when selected producer changes
  useEffect(() => {
    if (selectedProducer && mapInstanceRef.current && window.google && window.google.maps) {
      // Center map on selected producer
      mapInstanceRef.current.setCenter({
        lat: selectedProducer.lat,
        lng: selectedProducer.lng
      });
      
      // Zoom in
      mapInstanceRef.current.setZoom(15);
      
      // Find the marker
      const marker = markersRef.current.find(m => 
        m.getPosition().lat() === selectedProducer.lat && 
        m.getPosition().lng() === selectedProducer.lng
      );
      
      // Open info window if marker found
      if (marker && infoWindowRef.current) {
        infoWindowRef.current.setContent(createInfoWindowContent(selectedProducer));
        infoWindowRef.current.open(mapInstanceRef.current, marker);
      }
    }
  }, [selectedProducer, createInfoWindowContent]);
  
  // Handle closing the producer details panel
  const closeProducerDetails = () => {
    setSelectedProducer(null);
  };

  // Navigate to producer detail page
  const viewProfile = () => {
    if (selectedProducer) {
      navigate(`/producer/${selectedProducer.id}`);
    }
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
              {selectedProducer.images && selectedProducer.images.length > 0 ? (
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img 
                    src={selectedProducer.images[0]} 
                    alt={selectedProducer.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23${CATEGORY_COLORS[selectedProducer.type as keyof typeof CATEGORY_COLORS]?.substring(1) || '2196F3'}20'/%3E%3C/svg%3E`;
                    }}
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
          
          {/* Photo gallery */}
          {selectedProducer.images && selectedProducer.images.length > 0 && (
            <div className="mt-3 mb-3">
              <div className="text-sm font-medium text-gray-700 mb-2">Gallery</div>
              <div className="grid grid-cols-3 gap-2">
                {selectedProducer.images.slice(0, 3).map((img: string, index: number) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden">
                    <img 
                      src={img} 
                      alt={`${selectedProducer.name} product ${index + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const