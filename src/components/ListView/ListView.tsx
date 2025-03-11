// src/components/ListView/ListView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Producer } from '../../types/Producer';
import ProducerListItem from './ProducerListItem';
import ProducerGrid from './ProducerGrid';
import VirtualizedList from '../shared/VirtualizedList';
import { Filter, Search, Grid, List, ChevronDown } from 'lucide-react';

// Define sort options
export type SortOption = 'distance' | 'rating' | 'reviews' | 'name' | 'availability';

interface ListViewProps {
  producers: Producer[];
  selectedCategory: string;
  filterAvailability: string;
}

const ListView: React.FC<ListViewProps> = ({ 
  producers, 
  selectedCategory,
  filterAvailability
}) => {
  // Local state
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // Filter producers
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
  
  // Sort producers
  const sortedProducers = useMemo(() => {
    switch (sortBy) {
      case 'distance':
        return [...filteredProducers].sort((a, b) => a.distance - b.distance);
      case 'rating':
        return [...filteredProducers].sort((a, b) => b.rating - a.rating);
      case 'reviews':
        return [...filteredProducers].sort((a, b) => b.reviews - a.reviews);
      case 'name':
        return [...filteredProducers].sort((a, b) => a.name.localeCompare(b.name));
      case 'availability':
        // Sort by availability priority: 'now', 'tomorrow', 'weekend'
        return [...filteredProducers].sort((a, b) => {
          const priority = { now: 0, tomorrow: 1, weekend: 2 };
          return (
            priority[a.availability as keyof typeof priority] - 
            priority[b.availability as keyof typeof priority]
          );
        });
      default:
        return filteredProducers;
    }
  }, [filteredProducers, sortBy]);

  // Handle sort change
  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setShowSortDropdown(false);
  };
  
  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'grid' : 'list');
  };
  
  // Toggle sort dropdown
  const toggleSortDropdown = () => {
    setShowSortDropdown(prev => !prev);
  };
  
  // Simulate loading for demo purposes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [selectedCategory, filterAvailability, searchQuery]);
  
  // Render a producer list item
  const renderProducerItem = (producer: Producer, index: number) => {
    return <ProducerListItem key={producer.id} producer={producer} />;
  };

  return (
    <div className="pt-3 px-4 bg-gray-50 min-h-full">
      {/* List Header with Search and Controls */}
      <div className="bg-white rounded-lg shadow-sm mb-4">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {sortedProducers.length} Neighbors Available
            </h2>
            
            <div className="flex gap-2">
              {/* View mode toggle */}
              <button 
                onClick={toggleViewMode}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                aria-label={viewMode === 'list' ? "Switch to grid view" : "Switch to list view"}
              >
                {viewMode === 'list' ? 
                  <Grid className="w-5 h-5" /> : 
                  <List className="w-5 h-5" />
                }
              </button>
              
              {/* Sort dropdown */}
              <div className="relative">
                <button 
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center"
                  onClick={toggleSortDropdown}
                >
                  <Filter className="w-5 h-5" />
                </button>
                
                {showSortDropdown && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border">
                    <div className="py-1">
                      <div 
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${sortBy === 'distance' ? 'bg-gray-100 font-medium' : ''}`}
                        onClick={() => handleSortChange('distance')}
                      >
                        Closest First
                      </div>
                      <div 
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${sortBy === 'rating' ? 'bg-gray-100 font-medium' : ''}`}
                        onClick={() => handleSortChange('rating')}
                      >
                        Highest Rated
                      </div>
                      <div 
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${sortBy === 'reviews' ? 'bg-gray-100 font-medium' : ''}`}
                        onClick={() => handleSortChange('reviews')}
                      >
                        Most Reviewed
                      </div>
                      <div 
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${sortBy === 'name' ? 'bg-gray-100 font-medium' : ''}`}
                        onClick={() => handleSortChange('name')}
                      >
                        Alphabetical
                      </div>
                      <div 
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${sortBy === 'availability' ? 'bg-gray-100 font-medium' : ''}`}
                        onClick={() => handleSortChange('availability')}
                      >
                        Availability
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for items, neighbors, or descriptions..."
              className="w-full px-4 py-2 pl-10 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            {searchQuery && (
              <button 
                className="absolute right-4 top-2.5 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        {/* Current Sort Indicator */}
        <div className="px-4 py-2 border-b text-sm flex justify-between items-center">
          <div className="flex items-center text-gray-600">
            <span>Sort:</span>
            <button 
              className="ml-2 flex items-center font-medium text-primary"
              onClick={toggleSortDropdown}
            >
              {(() => {
                switch(sortBy) {
                  case 'distance': return 'Closest First';
                  case 'rating': return 'Highest Rated';
                  case 'reviews': return 'Most Reviewed';
                  case 'name': return 'Alphabetical';
                  case 'availability': return 'Availability';
                  default: return 'Closest First';
                }
              })()}
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="text-gray-600">
            {filteredProducers.length} result{filteredProducers.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {/* Loading or Content */}
        <div className="p-4">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <>
              {sortedProducers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No neighbors found matching your criteria.</p>
                  <p className="mt-2">Try adjusting your filters or search query.</p>
                </div>
              ) : (
                viewMode === 'list' ? (
                  <div className="space-y-0">
                    <VirtualizedList
                      items={sortedProducers}
                      height={600} // Set a reasonable height for your list container
                      itemHeight={180} // Approximate height of each list item
                      renderItem={renderProducerItem}
                      overscan={2}
                      className="pb-4"
                    />
                  </div>
                ) : (
                  <ProducerGrid producers={sortedProducers} />
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListView;