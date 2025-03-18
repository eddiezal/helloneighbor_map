// src/features/map/components/MapView.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../../core/context/AppContext';
import { useMapInteractions } from '../hooks/useMapInteractions';
import { X, Star, Clock } from 'lucide-react';
import { CATEGORY_COLORS } from '../constants';

const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { filteredProducers, selectedProducer, setSelectedProducer } = useAppContext();
  
  const {
    isLoading,
    isGoogleMapsLoaded,
    loadGoogleMapsApi,
    createMarkers,
    // Other functions from the hook
  } = useMapInteractions();
  
  // Rest of the component implementation, using the hook functions
  
  return (
    <div className="relative h-full w-full">
      {/* UI implementation */}
    </div>
  );
};

export default MapView;