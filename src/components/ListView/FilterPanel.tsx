// src/components/ListView/FilterPanel.tsx
import React, { useState } from 'react';
import { Sliders, X } from 'lucide-react';

interface FilterPanelProps {
  onApplyFilters: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

// Define the state structure for the filters
export interface FilterState {
  maxWalkTime: number;
  minRating: number;
  showFeaturedOnly: boolean;
  showTopRatedOnly: boolean;
  selectedItems: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  onApplyFilters,
  initialFilters = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Default values
  const defaultFilterState: FilterState = {
    maxWalkTime: 30,
    minRating: 0,
    showFeaturedOnly: false,
    showTopRatedOnly: false,
    selectedItems: []
  };
  
  // Combined initial state with defaults
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilterState,
    ...initialFilters
  });
  
  // Handle individual filter changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseInt(value, 10) : 
              value
    }));
  };
  
  // Apply filters and close panel
  const applyFilters = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };
  
  // Reset filters to default
  const resetFilters = () => {
    setFilters(defaultFilterState);
  };
  
  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Sliders className="w-4 h-4 mr-1" />
        <span>Filters</span>
      </button>
      
      {/* Filter panel */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-72 bg-white rounded-md shadow-lg z-10 border overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-medium">Advanced Filters</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Walking time filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max walking time: {filters.maxWalkTime} min
              </label>
              <input
                type="range"
                name="maxWalkTime"
                min="5"
                max="60"
                step="5"
                value={filters.maxWalkTime}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 min</span>
                <span>60 min</span>
              </div>
            </div>
            
            {/* Rating filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum rating: {filters.minRating === 0 ? 'Any' : filters.minRating}
              </label>
              <input
                type="range"
                name="minRating"
                min="0"
                max="5"
                step="0.5"
                value={filters.minRating}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Any</span>
                <span>5.0</span>
              </div>
            </div>
            
            {/* Checkbox filters */}
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showFeaturedOnly"
                  name="showFeaturedOnly"
                  checked={filters.showFeaturedOnly}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded"
                />
                <label htmlFor="showFeaturedOnly" className="ml-2 block text-sm text-gray-700">
                  Featured neighbors only
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showTopRatedOnly"
                  name="showTopRatedOnly"
                  checked={filters.showTopRatedOnly}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded"
                />
                <label htmlFor="showTopRatedOnly" className="ml-2 block text-sm text-gray-700">
                  Top-rated neighbors only (4.8+)
                </label>
              </div>
            </div>
            
            {/* Item tags - In a real app, these would be dynamically generated */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by available items:
              </label>
              <div className="flex flex-wrap gap-2">
                {['Bread', 'Eggs', 'Tomatoes', 'Honey', 'Cookies'].map(item => (
                  <button
                    key={item}
                    className={`text-xs px-2 py-1 rounded-full transition-colors ${
                      filters.selectedItems.includes(item)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      setFilters(prev => {
                        const isSelected = prev.selectedItems.includes(item);
                        return {
                          ...prev,
                          selectedItems: isSelected
                            ? prev.selectedItems.filter(i => i !== item)
                            : [...prev.selectedItems, item]
                        };
                      });
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="p-4 border-t flex justify-between">
            <button
              onClick={resetFilters}
              className="text-gray-600 text-sm hover:underline"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;