// src/features/map/hooks/useMapInteractions.ts
import { useCallback, useState, useRef, useEffect } from 'react';
import { Producer } from '../../../core/types/Producer';
import { CATEGORY_COLORS } from '../constants';

// Track if Google Maps API is already being loaded
let isLoadingGoogleMaps = false;
let googleMapsLoadedPromise: Promise<void> | null = null;

export const useMapInteractions = () => {
  // State for tracking loading and API status
  const [isLoading, setIsLoading] = useState(true);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  
  // Refs for map elements
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  
  // Helper function to load Google Maps API once
  const loadGoogleMapsApi = useCallback((apiKey: string): Promise<void> => {
    if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
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
            setIsGoogleMapsLoaded(true);
            resolve();
          }
        }, 100);
        return;
      }
      
      isLoadingGoogleMaps = true;
      
      // Use callback name to ensure we don't get conflicts
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
        isLoadingGoogleMaps = false;
        googleMapsLoadedPromise = null;
      };
      
      document.head.appendChild(script);
    });
    
    return googleMapsLoadedPromise;
  }, []);
  
  // Initialize map with provided map element
  const initializeMap = useCallback((mapElement: HTMLElement) => {
    if (!window.google || !window.google.maps) {
      return null;
    }
    
    // Center coordinates - San Diego
    const center = { lat: 32.7157, lng: -117.1611 };
    
    const mapInstance = new window.google.maps.Map(mapElement, {
      center,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: true
    });
    
    mapRef.current = mapInstance;
    
    // Create info window if it doesn't exist
    if (!infoWindowRef.current) {
      infoWindowRef.current = new window.google.maps.InfoWindow({
        maxWidth: 320
      });
    }
    
    setIsLoading(false);
    return mapInstance;
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
  
  // Get availability info
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
  
  // Create image grid for info window
  const createImageGrid = useCallback((producer: Producer): string => {
    // Default image if no product images are available
    const defaultImg = `<div style="background-color: ${CATEGORY_COLORS[producer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default}20; 
                             display: flex; align-items: center; justify-content: center;">
                          <span style="color: ${CATEGORY_COLORS[producer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default}; font-size: 20px;">${producer.icon}</span>
                        </div>`;
    
    // Get all producer images
    const allImages = [...(producer.images || [])].filter(img => img);
    
    // Create image grid HTML
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
  
  // Generate random inventory for demonstration
  const generateInventory = useCallback((items: string[]): string => {
    return items.slice(0, 3).map(item => {
      const quantity = Math.floor(Math.random() * 10) + 1; // Random 1-10
      return `<div style="display: flex; justify-content: space-between; font-size: 11px; color: #555;">
                <span>${item}</span>
                <span>${quantity} available</span>
              </div>`;
    }).join('');
  }, []);
  
  // Create a "currently viewing" indicator
  const createViewingNow = useCallback((): string => {
    // Generate random number of viewers (1-5)
    const viewers = Math.floor(Math.random() * 5) + 1;
    return `<div style="font-size: 11px; color: #666; margin-top: 6px; display: flex; align-items: center;">
              <span style="width: 8px; height: 8px; background-color: #FF5722; border-radius: 50%; margin-right: 4px;"></span>
              ${viewers} ${viewers === 1 ? 'person' : 'people'} viewing now
            </div>`;
  }, []);
  
  // Create full featured info window content
  const createInfoWindowContent = useCallback((producer: Producer): string => {
    const availability = getAvailabilityInfo(producer.availability);
    
    return `
      <div style="width: 300px; padding: 0; border-radius: 12px; overflow: hidden; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
        ${createImageGrid(producer)}
        
        <div style="padding: 14px; background-color: white;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 6px;">
            <div style="font-size: 16px; font-weight: bold;">${producer.name}</div>
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
            ${generateInventory(producer.items)}
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
  }, [createImageGrid, createStarRating, createViewingNow, generateInventory, getAvailabilityInfo]);
  
  // Function to create markers on the map
  const createMarkers = useCallback((
    producers: Producer[],
    onSelectProducer: (producer: Producer) => void
  ) => {
    if (!mapRef.current || !window.google || !window.google.maps) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Add markers for each producer
    producers.forEach(producer => {
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
        onSelectProducer(producer);
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
      });
    });
  }, [createInfoWindowContent]);
  
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
  }, [isGoogleMapsLoaded, createInfoWindowContent]);
  
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
    createInfoWindowContent,
    selectProducerOnMap,
    mapRef
  };
};