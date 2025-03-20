// src/components/shared/CategoryFilter.tsx
import React from 'react';
import { useAppContext } from '../../core/context/AppContext';

const CategoryFilter = () => {
  const { selectedCategory, setSelectedCategory, categories } = useAppContext();
  
  return (
    <div className="bg-primary p-2 flex space-x-2 overflow-x-auto scrollbar-hide">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === category.id
              ? 'bg-white text-primary'
              : 'bg-primary text-white border border-white/20 hover:bg-white/10'
          }`}
        >
          <span className="mr-2">{category.icon}</span>
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;