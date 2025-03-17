// src/pages/Map.tsx
import React from 'react';
import MapView from '../components/Map/MapView';
import { producers } from '../data/mockProducers';

const Map: React.FC = () => {
  return (
    <div className="h-full">
      <MapView 
        producers={producers} 
        selectedCategory="all" 
        filterAvailability="now" 
      />
    </div>
  );
};

export default Map;