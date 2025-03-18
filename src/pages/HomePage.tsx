// src/pages/HomePage.tsx
import React from 'react';
import { useAppContext } from '../core/context/AppContext';
import MapView from '../features/map/components/MapView';
import ListView from '../features/listings/components/ListView'; // Updated import path

/**
 * The main homepage that displays either the map or list view
 * based on the user's selection
 */
const HomePage: React.FC = () => {
  const { activeView } = useAppContext();
  
  return (
    <div className="h-full">
      {activeView === 'map' ? (
        <div className="h-[calc(100vh-208px)] md:h-[calc(100vh-200px)]">
          <MapView />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-4">
          <ListView />
        </div>
      )}
    </div>
  );
};

export default HomePage;