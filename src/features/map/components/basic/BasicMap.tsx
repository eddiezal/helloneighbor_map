import React from 'react';

function BasicMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  React.useEffect(() => {
    const initMap = () => {
      const mapDiv = document.getElementById('map');
      if (!mapDiv) return;
      
      // Create map using the Google Maps JavaScript API directly
      new window.google.maps.Map(mapDiv, {
        center: { lat: 34.052, lng: -118.243 },
        zoom: 12,
      });
    };

    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Load Google Maps API script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <div id="map" className="h-full w-full"></div>
    </div>
  );
}

export default BasicMap;
