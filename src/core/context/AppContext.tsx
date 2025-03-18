import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Producer } from '../../features/producers/types/Producer.types';
import { producers as mockProducers } from '../../features/producers/data/mockProducers';

interface AppContextProps {
  producers: Producer[];
  selectedCategory: string;
  filterAvailability: string;
  viewMode: 'map' | 'list';
  searchQuery: string;
  isLoading: boolean;
  setSelectedCategory: (category: string) => void;
  setFilterAvailability: (availability: string) => void;
  setViewMode: (mode: 'map' | 'list') => void;
  setSearchQuery: (query: string) => void;
  selectedProducer: Producer | null;
  setSelectedProducer: (producer: Producer | null) => void;
  isAuthenticated: boolean;
  user: any | null; // Will be typed properly in the auth feature
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // State management
  const [producers, setProducers] = useState<Producer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  
  // Authentication state (will be expanded in auth feature)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  
  // Fetch producers (simulated)
  useEffect(() => {
    const fetchProducers = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In a real app, this would be an API call
        setProducers(mockProducers);
      } catch (error) {
        console.error('Error fetching producers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducers();
  }, []);
  
  // Filter producers based on criteria
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
    });
  }, [producers, selectedCategory, filterAvailability, searchQuery]);
  
  // Authentication methods (to be implemented in auth feature)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login (will be replaced with actual API call)
      setIsAuthenticated(true);
      setUser({
        id: 1,
        name: 'Test User',
        email: email
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };
  
  const value = {
    producers: filteredProducers,
    selectedCategory,
    filterAvailability,
    viewMode,
    searchQuery,
    isLoading,
    setSelectedCategory,
    setFilterAvailability,
    setViewMode,
    setSearchQuery,
    selectedProducer,
    setSelectedProducer,
    isAuthenticated,
    user,
    login,
    logout
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;