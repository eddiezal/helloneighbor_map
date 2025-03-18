// src/core/context/AppContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filterAvailability: string;
  setFilterAvailability: (filter: string) => void;
  activeView: 'map' | 'list';
  setActiveView: (view: 'map' | 'list') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('now');
  const [activeView, setActiveView] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <AppContext.Provider value={{
      selectedCategory,
      setSelectedCategory,
      filterAvailability,
      setFilterAvailability,
      activeView,
      setActiveView,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};