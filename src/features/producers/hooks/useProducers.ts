// src/features/producers/hooks/useProducers.ts
import { useState, useEffect } from 'react';
import { Producer } from '../types/Producer.types';

// Import mock data for now, later we'll move to a service
import { producers as mockProducers } from '../../../data/mockProducers';

export type ProducerFilter = {
  category?: string;
  availability?: string;
  search?: string;
  maxDistance?: number;
};

export const useProducers = (filters: ProducerFilter = {}) => {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter mock data based on filters
        let filteredProducers = [...mockProducers];
        
        if (filters.category && filters.category !== 'all') {
          filteredProducers = filteredProducers.filter(
            producer => producer.type === filters.category
          );
        }
        
        if (filters.availability && filters.availability === 'now') {
          filteredProducers = filteredProducers.filter(
            producer => producer.availability === 'now'
          );
        }
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredProducers = filteredProducers.filter(
            producer => 
              producer.name.toLowerCase().includes(searchLower) ||
              producer.description.toLowerCase().includes(searchLower) ||
              producer.items.some(item => item.toLowerCase().includes(searchLower))
          );
        }
        
        if (filters.maxDistance) {
          filteredProducers = filteredProducers.filter(
            producer => producer.distance <= filters.maxDistance
          );
        }
        
        setProducers(filteredProducers);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch producers'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducers();
  }, [filters]);

  return {
    producers,
    loading,
    error,
  };
};