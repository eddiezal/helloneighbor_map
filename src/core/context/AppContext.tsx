// src/core/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Producer } from '../../features/producers/types/producer.types';
import { Category } from '../../data/mockCategories';

// Import mock data (will be replaced with API calls later)
import { producers as mockProducers } from '../../data/mockProducers';
import { categories as mockCategories } from '../../data/mockCategories';

// Define available views
export type ViewMode = 'map' | 'list';
export type SortOption = 'distance' | 'rating' | 'reviews' | 'name' | 'availability';
export type FilterAvailability = 'now' | 'all';

// Define context type
interface AppContextType {
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
  
  // Filtered and sorted producers
  filteredProducers: Producer[];
  
  // Selected producer
  selectedProducer: Producer | null;
  setSelectedProducer: (producer: Producer | null) => void;
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
  
  // Filter producers based on current filters
  const filteredProducers = React.useMemo(() => {
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
  
  // Context value
  const value = {
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
    
    // Filtered producers
    filteredProducers,
    
    // Selected producer
    selectedProducer,
    setSelectedProducer,
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