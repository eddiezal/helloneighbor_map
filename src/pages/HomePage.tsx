import React from 'react';
import { useAppContext } from '../core/context/AppContext';
import MapView from '../features/map/components/MapView';
import ListView from '../features/listings/components/ListView';

const HomePage: React.FC = () => {
  const { 
    producers,
    viewMode, 
    selectedCategory,
    filterAvailability,
    isLoading
  } = useAppContext();
  
  return (
    <div className="h-full">
      {viewMode === 'map' ? (
        <div className="h-[calc(100vh-208px)] md:h-[calc(100vh-200px)]">
          <MapView 
            producers={producers} 
            selectedCategory={selectedCategory}
            filterAvailability={filterAvailability}
          />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-4">
          <ListView 
            producers={producers}
            selectedCategory={selectedCategory}
            filterAvailability={filterAvailability}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;