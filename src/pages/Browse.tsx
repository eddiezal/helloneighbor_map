// src/pages/Browse.tsx
import React, { useState } from 'react';
import ListView from '../components/ListView/ListView';
import { producers } from '../data/mockProducers';

const Browse: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('now');

  return (
    <div className="h-full bg-gray-50">
      <ListView 
        producers={producers} 
        selectedCategory={selectedCategory}
        filterAvailability={filterAvailability}
      />
    </div>
  );
};

export default Browse;