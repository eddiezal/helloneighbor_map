// src/pages/Map.tsx
import React from 'react';
import MapView from '../features/map/components/MapView';
import { producers } from '../data/mockProducers';

const Map: React.FC = () => {
  return (
    <div className="h-full">
      <MapView />
    </div>
  );
};

export default Map;