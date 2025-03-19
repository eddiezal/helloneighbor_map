// src/core/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Producer } from '../types/Producer';
import { Category } from '../types/Category';
import { ViewMode, SortOption, FilterAvailability } from '../types/ui.types';
import { producers } from '../../data/mockProducers'; // Fixed import 
import { categories } from '../../data/mockCategories'; // Changed to match export name

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
  
  // Auth functions (mock for now)
  isAuthenticated: boolean;
  user: {name?: string, email?: string} | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

// Create context with a default undefined value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Context provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // State for data
  const [producersData, setProducersData] = useState<Producer[]>(producers);
  const [categoriesData] = useState<Category[]>(categories);
  
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
  
  // Auth mock states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{name?: string, email?: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Login mock
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email === 'user@example.com' && password === 'password') {
          setIsAuthenticated(true);
          setUser({ name: 'Demo User', email });
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };
  
  // Logout mock
  const logout = async () => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        resolve();
      }, 300);
    });
  };
  
  // Filtered producers based on current filters
  const filteredProducers = useMemo(() => {
    return producersData.filter(producer => {
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
  }, [producersData, selectedCategory, filterAvailability, searchQuery, sortBy]);
  
  // Featured producers
  const featuredProducers = useMemo(() => {
    return producersData.filter(p => p.featured && p.availability === 'now').slice(0, 5);
  }, [producersData]);
  
  // Context value
  const value: AppContextType = {
    // Data
    producers: producersData,
    categories: categoriesData,
    
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
    isAuthEnabled,
    
    // Auth
    isAuthenticated,
    user,
    login,
    logout,
    isLoading
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