// src/components/Map/EnhancedMapView.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Producer } from '../../types/Producer';
import { X, Star, Clock, Heart, MapPin, Shield, Users } from 'lucide-react';

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
      toggleFavorite?: (id: number) => void;
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

const EnhancedMapView: React.FC<MapViewProps> = ({ producers, selectedCategory, filterAvailability }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const [favorited, setFavorited] = useState<number[]>([]);
  
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

  // Toggle favorite
  const toggleFavorite = useCallback((producerId: number) => {
    setFavorited(prev => 
      prev.includes(producerId) 
        ? prev.filter(id => id !== producerId) 
        : [...prev, producerId]
    );
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
        <span style="margin-left: 4px; font-size: 12px; color: #555;">${rating.toFixed(1)}</span>
      </div>
    `;
  }, []);

  // Helper function to get availability text and color
  const getAvailabilityInfo = useCallback((availability: string): { text: string; color: string; bgColor: string } => {
    switch (availability) {
      case 'now':
        return { text: 'Available now', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.1)' };
      case 'tomorrow':
        return { text: 'Available tomorrow', color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.1)' };
      case 'weekend':
        return { text: 'Available this weekend', color: '#9C27B0', bgColor: 'rgba(156, 39, 176, 0.1)' };
      default:
        return { text: 'Check availability', color: '#757575', bgColor: 'rgba(117, 117, 117, 0.1)' };
    }
  }, []);

  // Generate random inventory for demonstration
  const generateInventory = useCallback((items: string[]): string => {
    return items.slice(0, 3).map(item => {
      const quantity = Math.floor(Math.random() * 10) + 1; // Random 1-10
      return `<div style="display: flex; justify-content: space-between; font-size: 11px; color: #555; margin-bottom: 4px;">
                <span>${item}</span>
                <span style="background-color: #f0f0f0; padding: 0 4px; border-radius: 4px; font-weight: 500;">${quantity}</span>
              </div>`;
    }).join('');
  }, []);

  // Create image grid for info window
  const createImageGrid = useCallback((producer: Producer): string => {
    // Default image if no product images are available
    const color = CATEGORY_COLORS[producer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
    const defaultImg = `<div style="background-color: ${color}20; 
                             display: flex; align-items: center; justify-content: center;">
                          <span style="color: ${color}; font-size: 40px;">${producer.icon}</span>
                        </div>`;
    
    // Check for local images for specific producers
    const localImages = producerLocalImages[producer.name as keyof typeof producerLocalImages];
    
    // Get all producer images
    const allImages = localImages 
      ? localImages 
      : [...(producer.images || [])].filter(img => img);
    
    // If we have an image, create a full-width image for the info window header
    if (allImages && allImages.length > 0) {
      return `<img src="${allImages[0]}" style="width: 100%; height: 140px; object-fit: cover; border-radius: 8px 8px 0 0;" alt="${producer.name}">`;
    }
    
    // Otherwise use the default icon-based placeholder
    return `<div style="width: 100%; height: 140px; ${defaultImg} border-radius: 8px 8px 0 0;"></div>`;
  }, [producerLocalImages]);

  // Create improved info window content
  const createEnhancedInfoWindow = useCallback((producer: Producer): string => {
    const availability = getAvailabilityInfo(producer.availability);
    const color = CATEGORY_COLORS[producer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
    const isFavorited = favorited.includes(producer.id);
    
    // Random viewers for social proof
    const viewers = Math.floor(Math.random() * 5) + 1;
    
    return `
      <div style="width: 280px; border-radius: 8px; overflow: hidden; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
        ${createImageGrid(producer)}
        
        <div style="position: absolute; top: 8px; left: 8px; background-color: white; color: ${color}; font-size: 11px; padding: 4px 8px; border-radius: 16px; font-weight: 600; display: flex; align-items: center;">
          <span style="margin-right: 4px;">${producer.icon}</span>
          ${(() => {
            switch(producer.type) {
              case 'baker': return 'Baker';
              case 'gardener': return 'Gardener';
              case 'eggs': return 'Eggs';
              case 'homecook': return 'Home Cook';
              case 'specialty': return 'Specialty';
              default: return producer.type;
            }
          })()}
        </div>
        
        <div style="position: absolute; top: 8px; right: 8px;">
          <button
            style="width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background-color: white; border: none; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
            onclick="window.HelloNeighbor.toggleFavorite && window.HelloNeighbor.toggleFavorite(${producer.id})"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFavorited ? '#FF5252' : 'none'}" stroke="${isFavorited ? '#FF5252' : 'currentColor'}" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
        
        <div style="padding: 16px;">
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <h3 style="font-size: 16px; font-weight: 600; color: #333; margin: 0 0 4px 0;">${producer.name}</h3>
              ${producer.featured ? 
                '<span style="background-color: #FFDE7D; color: #2A5D3C; font-size: 10px; padding: 2px 6px; border-radius: 10px; font-weight: bold;">Featured</span>' : 
                ''}
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              ${createStarRating(producer.rating)}
              <span style="color: #666; font-size: 12px; margin-left: 4px;">(${producer.reviews})</span>
            </div>
            
            <p style="color: #555; margin: 0 0 12px 0; font-size: 13px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">
              ${producer.description}
            </p>
          </div>
          
          <div style="background-color: #f7f7f7; padding: 10px; border-radius: 8px; margin-bottom: 12px;">
            <div style="font-size: 12px; font-weight: 600; color: #444; margin-bottom: 6px; display: flex; align-items: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2A5D3C" stroke-width="2" style="margin-right: 5px;">
                <path d="M20.91 11.12l-8.5-8.5a1.24 1.24 0 0 0-1.74 0l-8.5 8.5a1.24 1.24 0 0 0-.36.88V19a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-7a1.24 1.24 0 0 0-.36-.88zM18 17.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5z"/>
              </svg>
              Available Items:
            </div>
            ${generateInventory(producer.items)}
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="display: flex; align-items: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" style="margin-right: 4px;">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span style="font-size: 12px; color: #666;">${producer.walkTime} min walk</span>
            </div>
            
            <div style="display: flex; align-items: center; font-size: 11px; color: #666;">
              <span style="width: 6px; height: 6px; background-color: #FF5252; border-radius: 50%; margin-right: 4px;"></span>
              ${viewers} viewing
            </div>
          </div>
          
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
            <span style="display: inline-flex; align-items: center; font-size: 12px; color: ${availability.color}; font-weight: 500; 
                         background-color: ${availability.bgColor}; padding: 6px 12px; border-radius: 16px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${availability.color}; margin-right: 6px;"></span>
              ${availability.text}
            </span>
          </div>
          
          <button 
            style="width: 100%; background-color: #2A5D3C; color: white; border: none; border-radius: 20px; padding: 10px 0; font-size: 13px; font-weight: 600; cursor: pointer; transition: background-color 0.2s;"
            onmouseover="this.style.backgroundColor='#224d32'"
            onmouseout="this.style.backgroundColor='#2A5D3C'"
            onclick="if(window.HelloNeighbor) window.HelloNeighbor.selectProducer(${producer.id})"
          >View Profile</button>
        </div>
      </div>
    `;
  }, [createStarRating, getAvailabilityInfo, generateInventory, favorited, createImageGrid]);

  // Function to create markers on the map
  const createMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !window.google || !window.google.maps) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Create info window if it doesn't exist
    if (!infoWindowRef.current) {
      infoWindowRef.current = new window.google.maps.InfoWindow({
        maxWidth: 300
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
          fillOpacity: 0.9,
          strokeColor: '#FFFFFF',
          strokeWeight: producer.featured ? 2 : 1,
          scale: producer.featured ? 10 : 8
        },
        animation: producer.featured ? window.google.maps.Animation.DROP : null
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
        
        // Center the map on this marker
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter({ lat: producer.lat, lng: producer.lng });
          mapInstanceRef.current.setZoom(15);
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
        
        // Set up global handlers on the window object
        if (typeof window !== 'undefined') {
          if (!window.HelloNeighbor) {
            window.HelloNeighbor = { selectProducer: () => {} };
          }
          
          // Update the global selectProducer function
          window.HelloNeighbor.selectProducer = (producerId: number) => {
            const producer = producers.find(p => p.id === producerId);
            if (producer) {
              setSelectedProducer(producer);
              if (infoWindowRef.current) {
                infoWindowRef.current.close();
              }
              
              // Center map on producer
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setCenter({ lat: producer.lat, lng: producer.lng });
                mapInstanceRef.current.setZoom(15);
              }
            }
          };
          
          // Add toggleFavorite handler
          window.HelloNeighbor.toggleFavorite = (producerId: number) => {
            toggleFavorite(producerId);
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
  }, [producers, createMarkers, toggleFavorite]);
  
  // Recreate markers when filters change
  useEffect(() => {
    if (mapInstanceRef.current && !isLoading) {
      createMarkers();
    }
  }, [selectedCategory, filterAvailability, createMarkers, isLoading]);
  
  // Close producer details panel
  const closeProducerDetails = () => {
    setSelectedProducer(null);
  };
  
  // Handle toggling favorite status
  const handleToggleFavorite = () => {
    if (selectedProducer) {
      toggleFavorite(selectedProducer.id);
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
        className="w-full h-full min-h-[400px]"
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
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const color = CATEGORY_COLORS[selectedProducer.type as keyof typeof CATEGORY_COLORS]?.substring(1) || '2196F3';
                          target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23${color}20'/%3E%3Ctext x='50' y='50' font-size='24' text-anchor='middle' dominant-baseline='middle' fill='%23${color}'%3E${selectedProducer.icon}%3C/text%3E%3C/svg%3E`;
                        }}
                      />
                    </div>
                  );
                } else {
                  const color = CATEGORY_COLORS[selectedProducer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
                  return (
                    <div 
                      className="h-12 w-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ 
                        backgroundColor: `${color}20`
                      }}
                    >
                      {selectedProducer.icon}
                    </div>
                  );
                }
              })()}
              <div>
                <h3 className="font-bold text-gray-800">{selectedProducer.name}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="text-yellow-500 mr-1 h-4 w-4 fill-current" />
                  <span>{selectedProducer.rating} ({selectedProducer.reviews})</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full ${
                  favorited.includes(selectedProducer.id) 
                    ? 'text-red-500 bg-red-50' 
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
                aria-label={favorited.includes(selectedProducer.id) ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`h-5 w-5 ${favorited.includes(selectedProducer.id) ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={closeProducerDetails}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close producer details"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-2 mb-3 line-clamp-2">
            {selectedProducer.description}
          </p>
          
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              <span>{selectedProducer.walkTime} minute walk</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-1 text-gray-500" />
              <span>{Math.floor(Math.random() * 5) + 1} viewing</span>
            </div>
          </div>
          
          {/* Available items */}
          <div className="bg-gray-50 p-3 rounded-lg mb-3">
            <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Shield className="h-4 w-4 mr-1 text-primary" />
              Available Items:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {selectedProducer.items.slice(0, 6).map((item, idx) => (
                <div key={idx} className="bg-white px-3 py-2 rounded-md text-sm flex justify-between items-center">
                  <span className="truncate">{item}</span>
                  <span className="ml-1 bg-gray-100 px-1.5 py-0.5 rounded text-xs text-gray-600">
                    {Math.floor(Math.random() * 10) + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Photo gallery */}
          {(() => {
            const localImages = producerLocalImages[selectedProducer.name as keyof typeof producerLocalImages];
            const images = localImages || (selectedProducer.images && selectedProducer.images.length > 0 ? selectedProducer.images : []);
            
            if (images && images.length > 0) {
              return (
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Product Gallery</div>
                  <div className="grid grid-cols-3 gap-2">
                    {images.slice(0, 3).map((img, index) => (
                      <div key={index} className="aspect-square rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <img 
                          src={img} 
                          alt={`${selectedProducer.name} product ${index + 1}`} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const color = CATEGORY_COLORS[selectedProducer.type as keyof typeof CATEGORY_COLORS]?.substring(1) || '2196F3';
                            target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23${color}20'/%3E%3Ctext x='50' y='50' font-size='24' text-anchor='middle' dominant-baseline='middle' fill='%23${color}'%3E${selectedProducer.icon}%3C/text%3E%3C/svg%3E`;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })()}
          
          {/* Availability badge */}
          <div className="mb-3">
            <div 
              className="inline-flex items-center text-sm px-3 py-1.5 rounded-full"
              style={{ 
                backgroundColor: getAvailabilityInfo(selectedProducer.availability).bgColor,
                color: getAvailabilityInfo(selectedProducer.availability).color 
              }}
            >
              <span 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: getAvailabilityInfo(selectedProducer.availability).color }}
              ></span>
              {getAvailabilityInfo(selectedProducer.availability).text}
            </div>
          </div>