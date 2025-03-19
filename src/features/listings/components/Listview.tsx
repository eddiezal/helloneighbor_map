// src/features/listings/components/ListView.tsx
import React, { useState, useEffect } from 'react';
import { Filter, Search, Grid, List } from 'lucide-react';
import ProducerListItem from './ProducerListItem';
import ProducerGrid from './ProducerGrid';
import FilterPanel, { FilterState } from './FilterPanel';

// Mock the context for now - you can replace this with your actual context import
const useAppContext = () => ({
  filteredProducers: [],
  searchQuery: '',
  setSearchQuery: (query: string) => {},
  sortBy: 'distance' as const,
  setSortBy: (option: any) => {}
});

const ListView: React.FC = () => {
  // Get data from context
  const { filteredProducers, searchQuery, setSearchQuery, sortBy, setSortBy } = useAppContext();
  
  // Local state
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'grid' : 'list');
  };
  
  // Toggle sort dropdown
  const toggleSortDropdown = () => {
    setShowSortDropdown(prev => !prev);
  };
  
  // Handle sort change
  const handleSortChange = (option: any) => {
    setSortBy(option);
    setShowSortDropdown(false);
  };
  
  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  // Handle filter application
  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
  };
  
  return (
    <div className="pt-3 px-4 bg-gray-50 min-h-full">
      <div className="bg-white rounded-lg shadow-sm mb-4">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {filteredProducers.length} Neighbors Available
            </h2>
            
            <div className="flex gap-2">
              <FilterPanel 
                onApplyFilters={handleApplyFilters}
                initialFilters={activeFilters || undefined}
                activeFiltersCount={activeFiltersCount}
              />

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
              
              <div className="relative">
                <button 
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center"
                  onClick={toggleSortDropdown}
                  aria-label="Sort options"
                >
                  <Filter className="w-5 h-5" />
                </button>
                
                {showSortDropdown && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border">
                    <div className="py-1">
                      <button 
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 w-full text-left ${sortBy === 'distance' ? 'bg-gray-100 font-medium' : ''}`}
                        onClick={() => handleSortChange('distance')}
                      >
                        Closest First
                      </button>
                      <button 
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 w-full text-left ${sortBy === 'rating' ? 'bg-gray-100 font-medium' : ''}`}
                        onClick={() => handleSortChange('rating')}
                      >
                        Highest Rated
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
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
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        <div className="p-4">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <>
              {filteredProducers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No neighbors found matching your criteria.</p>
                  <p className="mt-2">Try adjusting your filters or search query.</p>
                </div>
              ) : (
                viewMode === 'list' ? (
                  <div className="space-y-4">
                    {filteredProducers.map(producer => (
                      <ProducerListItem key={producer.id} producer={producer} />
                    ))}
                  </div>
                ) : (
                  <ProducerGrid producers={filteredProducers} />
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