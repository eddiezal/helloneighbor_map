import React, { useEffect, useRef, useState } from 'react';
import { Producer } from '../../types/Producer';
import { X, Star, Clock } from 'lucide-react';

interface MapViewProps {
  producers: Producer[];
  selectedCategory: string;
  filterAvailability: string;
}

// Define consistent colors to use in both markers and legend
const CATEGORY_COLORS = {
  baker: '#FF5252',     // Red
  gardener: '#4CAF50',  // Green
  eggs: '#FFC107',      // Amber/Yellow
  homecook: '#9C27B0',  // Purple
  specialty: '#FF9800', // Orange
  default: '#2196F3'    // Blue (fallback)
};

// Helper function to create star rating HTML
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

// Helper function to get availability text and color
const getAvailabilityInfo = (availability: string): { text: string; color: string } => {
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

const MapView: React.FC<MapViewProps> = ({ producers, selectedCategory, filterAvailability }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  
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

  // Initialize map
  useEffect(() => {
    // Skip if element not ready or already initialized
    if (!mapRef.current) return;
    
    // Function to initialize the map
    function initMap() {
      const google = window.google;
      if (!google || !google.maps || !mapRef.current) {
        console.error('Google Maps not loaded or map element not found');
        setIsLoading(false);
        return;
      }
      
      try {
        // Create map instance
        const map = new google.maps.Map(mapRef.current, {
          center: sandiegoCenter,
          zoom: 10, // Zoomed out to show Chula Vista and Otay Ranch
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: true
        });

        // Create a shared InfoWindow for hover state
        const hoverInfoWindow = new google.maps.InfoWindow({
          pixelOffset: new google.maps.Size(0, -10), // Offset to position above marker
          disableAutoPan: true // Prevent map from panning to show info window
        });
        
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
        
        // Add simple color-coded markers for each producer
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
          
          // Get availability information
          const availability = getAvailabilityInfo(producer.availability);
          
          // Create enhanced hover content
          const hoverContent = `
            <div style="width: 220px; padding: 0; border-radius: 8px; overflow: hidden; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="background-color: ${categoryColor}; padding: 8px 12px; color: white; display: flex; align-items: center;">
                <span style="font-size: 20px; margin-right: 8px;">${producer.icon}</span>
                <div style="font-size: 14px; font-weight: bold; flex: 1;">${producer.name}</div>
                ${producer.featured ? '<span style="background: #FFD700; color: #000; font-size: 10px; padding: 2px 6px; border-radius: 10px; font-weight: bold;">Featured</span>' : ''}
              </div>
              <div style="padding: 12px; background-color: white;">
                <div style="margin-bottom: 8px;">
                  ${createStarRating(producer.rating)}
                  <span style="color: #666; font-size: 12px; margin-left: 3px;">(${producer.reviews})</span>
                </div>
                <div style="color: #444; margin-bottom: 8px; font-size: 13px;">
                  ${producer.items.slice(0, 2).join(', ')}${producer.items.length > 2 ? '...' : ''}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 12px; color: ${availability.color}; font-weight: 500;">
                    ${availability.text}
                  </span>
                  <span style="font-size: 12px; color: #666;">
                    ${producer.walkTime} min walk
                  </span>
                </div>
              </div>
            </div>
          `;
          
          // Add hover listener to show info window
          marker.addListener('mouseover', () => {
            hoverInfoWindow.setContent(hoverContent);
            hoverInfoWindow.open(map, marker);
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
    }

    // Load Google Maps API
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } else {
      // API already loaded, just initialize map
      initMap();
    }
  }, [apiKey, selectedCategory, filterAvailability, producers]);
  
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
      ></div>
      
      {/* Legend with exact matching colors */}
      <div className="absolute bottom-20 left-2 bg-white bg-opacity-90 p-2 rounded-lg shadow-md text-xs">
        <div className="font-medium mb-1">Showing {filteredProducers.length} neighbors</div>
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CATEGORY_COLORS.baker }}></div>
            <span>Bakers</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CATEGORY_COLORS.gardener }}></div>
            <span>Gardeners</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CATEGORY_COLORS.eggs }}></div>
            <span>Eggs</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CATEGORY_COLORS.homecook }}></div>
            <span>Home Cooks</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CATEGORY_COLORS.specialty }}></div>
            <span>Specialty</span>
          </div>
        </div>
      </div>
      
      {/* Selected Producer Card */}
      {selectedProducer && (
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-lg rounded-t-xl">
          <div className="flex justify-between items-start">
            <div className="flex space-x-3">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                {selectedProducer.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{selectedProducer.name}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="text-yellow-500 mr-1 h-4 w-4" />
                  <span>{selectedProducer.rating} ({selectedProducer.reviews})</span>
                  <span className="mx-2">•</span>
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{selectedProducer.walkTime} min walk</span>
                </div>
              </div>
            </div>
            <button 
              className="text-gray-500 p-1 rounded-full hover:bg-gray-100"
              onClick={closeProducerDetails}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <p className="text-gray-600 text-sm mt-2">{selectedProducer.description}</p>
          
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-800">Available Items:</h4>
            <div className="flex space-x-2 mt-1 overflow-x-auto pb-1">
              {selectedProducer.items.map((item, index) => (
                <div key={index} className="flex-shrink-0 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button className="flex-1 bg-green-800 text-white py-2 rounded-full font-medium">
              View Profile
            </button>
            <button className="flex-1 border border-green-800 text-green-800 py-2 rounded-full font-medium">
              Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
