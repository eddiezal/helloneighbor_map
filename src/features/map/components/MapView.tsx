// src/components/Map/MapView.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Producer } from '../../producers/types/Producer.types';
import { X, Star, Clock } from 'lucide-react';

// Define consistent colors to use in both markers and legend
const CATEGORY_COLORS = {
  baker: '#FF5252',     // Red
  gardener: '#4CAF50',  // Green
  eggs: '#FFC107',      // Amber/Yellow
  homecook: '#9C27B0',  // Purple
  specialty: '#FF9800', // Orange
  default: '#2196F3'    // Blue (fallback)
};

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

// Create a global namespace for our app to prevent conflicts
if (typeof window !== 'undefined') {
  // Safely initialize the HelloNeighbor object
  if (!window.HelloNeighbor) {
    window.HelloNeighbor = {
      selectProducer: function(producerId: number) {
        console.log('Producer selection function initialized with ID:', producerId);
        // This is just a placeholder that will be replaced in the component's useEffect
      }
    };
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

const MapView: React.FC<MapViewProps> = ({ producers, selectedCategory, filterAvailability }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  
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

  // Local image paths for specific producers
  const producerLocalImages: Record<string, string[]> = {
    "S'Pooy": [
      "/images/producers/till-mushroom-farm/goldmush.jpg",
      "/images/producers/till-mushroom-farm/oyster.jpg",
      "/images/producers/till-mushroom-farm/pink.jpg"
    ],
    "People of the Corn": [
      "/images/producers/people-of-corn/corn1.jpg",
      "/images/producers/people-of-corn/corn2.jpg",
      "/images/producers/people-of-corn/corn3.jpg"
    ],
    "Marie's Lemonade": [
      "/images/producers/marie-lemonade/lemon_club.jpg",
      "/images/producers/marie-lemonade/lemons.jpg",
      "/images/producers/marie-lemonade/mint-lemonade.jpg"
    ]
  };

  // Create image grid for info window
  const createImageGrid = useCallback((producer: Producer): string => {
    // Default images in case we don't have enough product images
    const defaultImg = `<div style="background-color: ${CATEGORY_COLORS[producer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default}; 
                             display: flex; align-items: center; justify-content: center;">
                          <span style="color: white; font-size: 20px;">${producer.icon}</span>
                        </div>`;
    
    // Check for local images for specific producers
    const localImages = producerLocalImages[producer.name as keyof typeof producerLocalImages];
    
    // Collect all available images with priority given to local images over producer-provided ones
    const allImages = localImages 
      ? localImages 
      : [...(producer.images || []), ...(producer.productImages || [])].filter(img => img);
    
    // Get up to 3 images or use defaults
    const images = [];
    for (let i = 0; i < 3; i++) {
      if (allImages && allImages[i]) {
        images.push(`<div style="flex: 1; height: 100%; overflow: hidden;">
                       <img src="${allImages[i]}" style="width: 100%; height: 100%; object-fit: cover;" alt="${producer.name} product image">
                     </div>`);
      } else {
        images.push(`<div style="flex: 1; height: 100%; overflow: hidden;">${defaultImg}</div>`);
      }
    }
    
    return `<div style="display: flex; height: 100px; gap: 2px;">${images.join('')}</div>`;
  }, []);

  // Create badge for social proof
  const createSocialProofBadge = useCallback((producer: Producer): string => {
    let badge = '';
    
    if (producer.rating >= 4.9) {
      badge = `<span style="background-color: #4CAF50; color: white; font-size: 10px; padding: 2px 6px; border-radius: 10px; font-weight: bold; margin-right: 4px;">Top Rated</span>`;
    } else if (producer.featured) {
      badge = `<span style="background-color: #FFD700; color: black; font-size: 10px; padding: 2px 6px; border-radius: 10px; font-weight: bold; margin-right: 4px;">Featured</span>`;
    } else if (producer.reviews > 40) {
      badge = `<span style="background-color: #2196F3; color: white; font-size: 10px; padding: 2px 6px; border-radius: 10px; font-weight: bold; margin-right: 4px;">Popular</span>`;
    }
    
    return badge;
  }, []);

  // Generate random inventory for demonstration
  const generateInventory = useCallback((items: string[]): string => {
    return items.map(item => {
      const quantity = Math.floor(Math.random() * 10) + 1; // Random 1-10
      return `<div style="display: flex; justify-content: space-between; font-size: 11px; color: #555;">
                <span>${item}</span>
                <span>${quantity} available</span>
              </div>`;
    }).join('');
  }, []);

  // Create a "currently viewing" indicator for added context
  const createViewingNow = useCallback((): string => {
    // Generate random number of viewers (1-5)
    const viewers = Math.floor(Math.random() * 5) + 1;
    return `<div style="font-size: 11px; color: #666; margin-top: 6px; display: flex; align-items: center;">
              <span style="width: 8px; height: 8px; background-color: #FF5722; border-radius: 50%; margin-right: 4px;"></span>
              ${viewers} ${viewers === 1 ? 'person' : 'people'} viewing now
            </div>`;
  }, []);

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

  // Helper function to get availability text and color
  const getAvailabilityInfo = useCallback((availability: string): { text: string; color: string } => {
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

  // Create full featured info window content
  const createEnhancedInfoWindow = useCallback((producer: Producer): string => {
    const availability = getAvailabilityInfo(producer.availability);
    
    return `
      <div style="width: 300px; padding: 0; border-radius: 12px; overflow: hidden; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
        ${createImageGrid(producer)}
        
        <div style="padding: 14px; background-color: white;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 6px;">
            <div style="font-size: 16px; font-weight: bold;">${producer.name}</div>
            <div style="display: flex; gap: 4px;">
              ${createSocialProofBadge(producer)}
            </div>
          </div>
          
          <div style="display: flex; align-items: center; margin-bottom: 6px;">
            ${createStarRating(producer.rating)}
            <span style="color: #666; font-size: 12px; margin-left: 4px;">(${producer.reviews})</span>
          </div>
          
          <div style="color: #444; margin-bottom: 10px; font-size: 13px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
            ${producer.description}
          </div>
          
          <div style="background-color: #f5f5f5; padding: 8px; border-radius: 8px; margin-bottom: 10px;">
            <div style="font-size: 12px; font-weight: 600; color: #333; margin-bottom: 4px;">Available Items:</div>
            ${generateInventory(producer.items.slice(0, 3))}
          </div>
          
          ${createViewingNow()}
          
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
          
          <div style="display: flex; gap: 8px; margin-top: 10px;">
            <button 
              style="flex: 1; background-color: #2A5D3C; color: white; border: none; border-radius: 20px; padding: 8px 0; font-size: 12px; font-weight: 600; cursor: pointer;"
              onclick="if(window.HelloNeighbor) window.HelloNeighbor.selectProducer(${producer.id})"
            >View Profile</button>
            <button 
              style="width: 40px; display: flex; align-items: center; justify-content: center; background-color: #f5f5f5; border: none; border-radius: 20px; cursor: pointer;"
              aria-label="Save to favorites"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }, [createImageGrid, createSocialProofBadge, createStarRating, generateInventory, createViewingNow, getAvailabilityInfo]);

  // Function to create markers on the map
  const createMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !window.google || !window.google.maps) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Create info window if it doesn't exist
    if (!infoWindowRef.current) {
      infoWindowRef.current = new window.google.maps.InfoWindow({
        maxWidth: 320
      });
    }
    
    // Add markers for each producer
    filteredProducers.forEach(producer => {
      if (!mapInstanceRef.current || !window.google || !window.google.maps) return;
      
      const color = CATEGORY_COLORS[producer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
      
      // Create standard marker
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
            infoWindowRef.current.setContent(createEnhancedInfoWindow(producer));
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
  }, [filteredProducers, createEnhancedInfoWindow]);

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
  }, [producers, createMarkers]);
  
  // Recreate markers when filters change
  useEffect(() => {
    if (mapInstanceRef.current && !isLoading) {
      createMarkers();
    }
  }, [selectedCategory, filterAvailability, createMarkers, isLoading]);

  // REMOVE THIS EFFECT - This is causing the error
  // Google Maps script is loaded externally in the initMap function
  // useEffect(() => {
  //   // Google Maps script is loaded externally
  //   const map = new window.google.maps.Map(mapRef.current, {
  //     center: { lat: 37.7749, lng: -122.4194 },
  //     zoom: 10
  //   });
  // }, []);
  
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
                // Check for local images
                const localImages = producerLocalImages[selectedProducer.name as keyof typeof producerLocalImages];
                
                if ((selectedProducer.images && selectedProducer.images.length > 0) || localImages) {
                  return (
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <img 
                        src={
                          localImages 
                            ? localImages[0] 
                            : selectedProducer.images![0]
                        } 
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
          {(() => {
            const localImages = producerLocalImages[selectedProducer.name as keyof typeof producerLocalImages];
            
            if (localImages) {
              return (
                <div className="mt-3 mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Product Gallery</div>
                  <div className="grid grid-cols-3 gap-2">
                    {localImages.map((img, index) => (
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
              );
            }
            return null;
          })()}
          
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