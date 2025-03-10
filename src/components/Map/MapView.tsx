// src/components/Map/MapView.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Producer } from '../../types/Producer';
import { X, Star, Clock } from 'lucide-react';
import { categoryImages } from '../../data/mockProducers';

// Define consistent colors to use in both markers and legend
const CATEGORY_COLORS = {
  baker: '#FF5252',     // Red
  gardener: '#4CAF50',  // Green
  eggs: '#FFC107',      // Amber/Yellow
  homecook: '#9C27B0',  // Purple
  specialty: '#FF9800', // Orange
  default: '#2196F3'    // Blue (fallback)
};

interface MapViewProps {
  producers: Producer[];
  selectedCategory: string;
  filterAvailability: string;
}

const MapView: React.FC<MapViewProps> = ({ producers, selectedCategory, filterAvailability }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const selectProducerFnRef = useRef<((id: number) => void) | null>(null);
  
  // Get API key from environment variables safely
  const apiKey = typeof import.meta !== 'undefined' && import.meta.env 
    ? import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '' 
    : typeof window !== 'undefined' && (window as any).ENV_GOOGLE_MAPS_API_KEY || '';
  
  // San Diego coordinates
  const sandiegoCenter = { lat: 32.7000, lng: -117.1500 }; // Adjusted to better center all locations
  
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

  // Function to calculate the proper info window position based on marker position
  const calculateInfoWindowPosition = useCallback((marker: any, map: any) => {
    if (!marker || !map) return new google.maps.Size(0, -10);
    
    try {
      // Get the marker's pixel position within the map container
      const scale = Math.pow(2, map.getZoom());
      const nw = new google.maps.LatLng(
        map.getBounds().getNorthEast().lat(),
        map.getBounds().getSouthWest().lng()
      );
      const worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
      const worldCoordinate = map.getProjection().fromLatLngToPoint(marker.getPosition());
      const pixelOffset = new google.maps.Point(
        Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
        Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
      );
      
      // Get map container dimensions
      const mapDiv = map.getDiv();
      const mapHeight = mapDiv.offsetHeight;
      
      // The height of our info window (approximate)
      const infoWindowHeight = 400;
      
      // Calculate where the info window would extend to (in pixels)
      const topExtent = pixelOffset.y - infoWindowHeight;
      const bottomExtent = pixelOffset.y + infoWindowHeight;
      
      // Check if window would extend beyond top or bottom
      const wouldExtendBeyondTop = topExtent < 0;
      const wouldExtendBeyondBottom = bottomExtent > mapHeight;
      
      // Position it where it fits best
      if (wouldExtendBeyondTop && !wouldExtendBeyondBottom) {
        // Position below if it would go off the top but not the bottom
        return new google.maps.Size(0, 10);
      } else if (!wouldExtendBeyondTop && wouldExtendBeyondBottom) {
        // Position above if it would go off the bottom but not the top
        return new google.maps.Size(0, -infoWindowHeight);
      } else if (wouldExtendBeyondTop && wouldExtendBeyondBottom) {
        // If it would overflow both ways, center it on the marker
        return new google.maps.Size(0, -infoWindowHeight/2);
      } else {
        // Default: position it above the marker with enough space
        return new google.maps.Size(0, -infoWindowHeight/2);
      }
    } catch (e) {
      console.error("Error calculating info window position:", e);
      // Default fallback
      return new google.maps.Size(0, -50);
    }
  }, []);

  // Local image paths for specific producers
  const producerLocalImages = {
    "Till's Mushroom Farm": [
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
      "/images/producers/marie-lemonade/lemonade1.jpg",
      "/images/producers/marie-lemonade/lemonade2.jpg",
      "/images/producers/marie-lemonade/lemonade3.jpg"
    ]
  };

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
      if (allImages[i]) {
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

  // Create hover content for info window
  const createHoverContent = useCallback((producer: Producer): string => {
    const availability = getAvailabilityInfo(producer.availability);
    
    return `
      <div style="width: 300px; max-width: 300px; padding: 0; border-radius: 12px; overflow: hidden; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 4px 20px rgba(0,0,0,0.15); max-height: 400px; overflow-y: auto;">
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
              onclick="window.selectProducer(${producer.id})"
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

  // Function to load Google Maps API
  const loadGoogleMapsAPI = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }
      
      // For development, you can use a fallback API key or disable the check
      const effectiveApiKey = apiKey || 'YOUR_FALLBACK_API_KEY_FOR_DEVELOPMENT';
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${effectiveApiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps API'));
      document.head.appendChild(script);
    });
  }, [apiKey]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;
    
    const initMap = async () => {
      try {
        await loadGoogleMapsAPI();
        
        const google = window.google;
        if (!google || !google.maps) {
          throw new Error('Google Maps not loaded');
        }

        // Create map instance
        const map = new google.maps.Map(mapRef.current, {
          center: sandiegoCenter,
          zoom: 10, // Zoomed out to show Chula Vista and Otay Ranch
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: true
        });
        
        // Store map reference
        googleMapRef.current = map;

        // Create shared InfoWindow for hover state
        const hoverInfoWindow = new google.maps.InfoWindow({
          maxWidth: 320,
          disableAutoPan: true // Disable auto-panning to prevent map movement
        });
        
        // Store infoWindow reference
        infoWindowRef.current = hoverInfoWindow;
        
        // Add user location marker (blue dot)
        new google.maps.Marker({
          position: sandiegoCenter,
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#3B82F6',
            fillOpacity: 0.7,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
            scale: 10
          }
        });
        
        // Create function to handle clicks from InfoWindow
        const handleSelectProducer = (producerId: number) => {
          const producer = producers.find(p => p.id === producerId);
          if (producer) {
            setSelectedProducer(producer);
            hoverInfoWindow.close(); // Close the hover window when profile is viewed
          }
        };
        
        // Store the function reference
        selectProducerFnRef.current = handleSelectProducer;
        
        // Add it to window temporarily (will be cleaned up on unmount)
        window.selectProducer = handleSelectProducer;
        
        // Clear any existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        
        // Add markers for each producer
        filteredProducers.forEach(producer => {
          // Get color from our constant object
          const categoryColor = CATEGORY_COLORS[producer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
          
          // Create simple dot marker
          const marker = new google.maps.Marker({
            position: { lat: producer.lat, lng: producer.lng },
            map: map,
            title: producer.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: categoryColor,
              fillOpacity: 0.8,
              strokeColor: '#FFFFFF',
              strokeWeight: producer.featured ? 2 : 1,
              scale: producer.featured ? 10 : 8
            }
          });
          
          // Store marker reference for cleanup
          markersRef.current.push(marker);
          
          // Add hover listener to show info window
          marker.addListener('mouseover', () => {
            try {
              // Calculate appropriate offset based on marker position
              const pixelOffset = calculateInfoWindowPosition(marker, map);
              
              // Set the pixel offset
              hoverInfoWindow.setOptions({
                pixelOffset: pixelOffset
              });
              
              // Set content and open
              hoverInfoWindow.setContent(createHoverContent(producer));
              hoverInfoWindow.open({
                anchor: marker,
                map: map,
                shouldFocus: false
              });
            } catch (error) {
              console.error("Error showing info window:", error);
              // Fallback to simpler approach if calculation fails
              hoverInfoWindow.setContent(createHoverContent(producer));
              hoverInfoWindow.open(map, marker);
            }
          });
          
          // Close info window when mouse moves away
          marker.addListener('mouseout', () => {
            hoverInfoWindow.close();
          });
          
          // Add click listener to show details
          marker.addListener('click', () => {
            setSelectedProducer(producer);
            hoverInfoWindow.close(); // Close the hover window when clicked
          });
        });
        
        // Done loading
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setIsLoading(false);
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(initMap, 100);
    
    // Cleanup function
    return () => {
      // Remove the global function
      if (window.selectProducer) {
        delete window.selectProducer;
      }
      
      // Clean up markers
      if (markersRef.current) {
        markersRef.current.forEach(marker => {
          if (marker) {
            marker.setMap(null);
          }
        });
      }
    };
  }, [apiKey, selectedCategory, filterAvailability, producers, createHoverContent, loadGoogleMapsAPI, calculateInfoWindowPosition]);
  
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
        style={{ 
          minHeight: "400px"
        }}
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

// Add TypeScript declaration for window.selectProducer
declare global {
  interface Window {
    selectProducer: (id: number) => void;
    google: any;
  }
}