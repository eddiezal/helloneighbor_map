// src/core/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Producer } from '../types/Producer';
import { Category } from '../types/Category';
import { ViewMode, SortOption, FilterAvailability } from '../types/ui.types';
import { mockProducers } from '../../data/mockProducers';
import { mockCategories } from '../../data/mockCategories';

// Define the context type
export interface AppContextType {
  // Data
  producers: Producer[];
  categories: Category[];
  
  // View state
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  
  // Filters
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filterAvailability: FilterAvailability;
  setFilterAvailability: (availability: FilterAvailability) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Sorting
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  
  // Computed values
  filteredProducers: Producer[];
  featuredProducers: Producer[];
  
  // Selected producer
  selectedProducer: Producer | null;
  setSelectedProducer: (producer: Producer | null) => void;
  
  // Feature flags
  isMapEnabled: boolean;
  isAuthEnabled: boolean;
}

// Create context with a default undefined value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Context provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // State for data
  const [producers, setProducers] = useState<Producer[]>(mockProducers);
  const [categories] = useState<Category[]>(mockCategories);
  
  // State for view
  const [activeView, setActiveView] = useState<ViewMode>('map');
  
  // State for filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterAvailability, setFilterAvailability] = useState<FilterAvailability>('now');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State for sorting
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  
  // State for selected producer
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  
  // Feature flags
  const [isMapEnabled] = useState(true);
  const [isAuthEnabled] = useState(false);
  
  // Fetch producers (mock for now, will be replaced with API call)
  useEffect(() => {
    // Simulate API call
    const fetchProducers = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await api.getProducers();
        // setProducers(response.data);
        
        // Using mock data for now
        setProducers(mockProducers);
      } catch (error) {
        console.error('Error fetching producers:', error);
      }
    };
    
    fetchProducers();
  }, []);
  
  // Filtered producers based on current filters
  const filteredProducers = useMemo(() => {
    return producers.filter(producer => {
      // Apply category filter
      if (selectedCategory !== 'all' && producer.type !== selectedCategory) {
        return false;
      }
      
      // Apply availability filter
      if (filterAvailability === 'now' && producer.availability !== 'now') {
        return false;
      }
      
      // Apply search query filter if any
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = producer.name.toLowerCase().includes(query);
        const matchesDescription = producer.description.toLowerCase().includes(query);
        const matchesItems = producer.items.some(item => 
          item.toLowerCase().includes(query)
        );
        
        if (!matchesName && !matchesDescription && !matchesItems) {
          return false;
        }
      }
      
      return true;
    }).sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'availability': {
          // Sort by availability priority: 'now', 'tomorrow', 'weekend'
          const priority = { now: 0, tomorrow: 1, weekend: 2 };
          return (
            priority[a.availability as keyof typeof priority] - 
            priority[b.availability as keyof typeof priority]
          );
        }
        default:
          return a.distance - b.distance;
      }
    });
  }, [producers, selectedCategory, filterAvailability, searchQuery, sortBy]);
  
  // Featured producers
  const featuredProducers = useMemo(() => {
    return producers.filter(p => p.featured && p.availability === 'now').slice(0, 5);
  }, [producers]);
  
  // Context value
  const value: AppContextType = {
    // Data
    producers,
    categories,
    
    // View state
    activeView,
    setActiveView,
    
    // Filters
    selectedCategory,
    setSelectedCategory,
    filterAvailability,
    setFilterAvailability,
    searchQuery,
    setSearchQuery,
    
    // Sorting
    sortBy,
    setSortBy,
    
    // Computed values
    filteredProducers,
    featuredProducers,
    
    // Selected producer
    selectedProducer,
    setSelectedProducer,
    
    // Feature flags
    isMapEnabled,
    isAuthEnabled
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the app context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};