// src/pages/HomePage.tsx
import React from 'react';
import { useAppContext } from '../core/context/AppContext';
import IntegratedMapView from '../features/map/components/IntegratedMapView';
import ListView from '../features/listings/components/Listview';

const HomePage: React.FC = () => {
  const { activeView } = useAppContext();
  
  return (
    <div className="h-full">
      {activeView === 'map' ? (
        <div className="h-[calc(100vh-208px)] md:h-[calc(100vh-200px)]">
          <IntegratedMapView />
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