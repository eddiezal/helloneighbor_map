// src/pages/Map.tsx
import React from 'react';
import { MapView } from '../features/map/components/MapView';

/**
 * Map page component
 * Uses the MapView component from the feature-based architecture
 */
const Map: React.FC = () => {
  return (
    <div className="h-full">
      <MapView />
    </div>
  );
};

export default Map;