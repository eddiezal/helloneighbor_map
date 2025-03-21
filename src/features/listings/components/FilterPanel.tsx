// src/features/listings/components/FilterPanel.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Sliders, X, Check, ChevronDown, Star } from 'lucide-react';

export interface FilterState {
  maxWalkTime: number;
  minRating: number;
  availability: string[];
  dietaryOptions: string[];
  priceRange: [number, number];
  categories: string[];
  showFeaturedOnly: boolean;
  showTopRatedOnly: boolean;
}

interface FilterPanelProps {
  onApplyFilters: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  activeFiltersCount?: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onApplyFilters,
  initialFilters = {},
  activeFiltersCount = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const defaultFilterState: FilterState = {
    maxWalkTime: 30,
    minRating: 0,
    availability: [],
    dietaryOptions: [],
    priceRange: [1, 5],
    categories: [],
    showFeaturedOnly: false,
    showTopRatedOnly: false
  };
  
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilterState,
    ...initialFilters
  });
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseInt(value, 10) : 
              value
    }));
  };
  
  const handleArrayFilterChange = (filterName: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterName] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [filterName]: newValues
      };
    });
  };
  
  const applyFilters = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };
  
  const resetFilters = () => {
    setFilters(defaultFilterState);
  };
  
  const toggleSection = (section: string) => {
    setActiveSection(prev => prev === section ? null : section);
  };
  
  return (
    <div className="relative" ref={panelRef}>
      {/* Toggle button */}
      <button
        className={`px-3 py-1.5 text-sm rounded-md flex items-center transition-colors ${
          activeFiltersCount > 0
            ? 'bg-primary text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Sliders className="w-4 h-4 mr-1.5" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="ml-1.5 bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>
      
      {/* Filter panel with animation */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end transition-opacity md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:bg-transparent"
        >
          <div 
            className="w-full max-w-md bg-white h-full overflow-auto md:h-auto md:rounded-lg md:shadow-lg md:max-h-[85vh] md:w-80"
          >
            <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b bg-white">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="divide-y">
              {/* Walk Time Filter */}
              <div className="p-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('walkTime')}
                >
                  <h4 className="font-medium">Walking Distance</h4>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      activeSection === 'walkTime' ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
                
                {/* Important: This div should be hidden by default, not just with CSS but with conditional rendering */}
                {activeSection === 'walkTime' ? (
                  <div className="mt-2">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Max walking time</span>
                      <span className="font-medium">{filters.maxWalkTime} minutes</span>
                    </div>
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
                      <span>30 min</span>
                      <span>60 min</span>
                    </div>
                  </div>
                ) : null}
              </div>
              
              {/* Rating Filter */}
              <div className="p-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('rating')}
                >
                  <h4 className="font-medium">Rating</h4>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      activeSection === 'rating' ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
                
                {activeSection === 'rating' ? (
                  <div className="mt-3">
                    <div className="space-y-2">
                      {[4, 3, 2, 1, 0].map((rating) => (
                        <div
                          key={rating}
                          className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                            filters.minRating === rating ? 'bg-primary bg-opacity-10' : 'hover:bg-gray-100'
                          }`}
                          onClick={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                        >
                          <div className={`mr-2 rounded-full w-5 h-5 flex items-center justify-center ${
                            filters.minRating === rating ? 'bg-primary text-white' : 'border border-gray-300'
                          }`}>
                            {filters.minRating === rating && <Check className="w-3 h-3" />}
                          </div>
                          <div className="flex items-center">
                            {rating > 0 ? (
                              <>
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-sm">{rating}+ stars</span>
                              </>
                            ) : (
                              <span className="text-sm">Any rating</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              
              {/* Availability */}
              <div className="p-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('availability')}
                >
                  <h4 className="font-medium">Availability</h4>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      activeSection === 'availability' ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
                
                {activeSection === 'availability' ? (
                  <div className="mt-3 space-y-2">
                    {['Available Now', 'Tomorrow', 'This Weekend'].map((option) => {
                      const value = option.toLowerCase().replace(' ', '-');
                      return (
                        <div 
                          key={value} 
                          className="flex items-center"
                          onClick={() => handleArrayFilterChange('availability', value)}
                        >
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer ${
                            filters.availability.includes(value) 
                              ? 'bg-primary border-primary text-white' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}>
                            {filters.availability.includes(value) && <Check className="w-3 h-3" />}
                          </div>
                          <label className="ml-2 cursor-pointer text-sm">{option}</label>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
              
              {/* Categories */}
              <div className="p-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('categories')}
                >
                  <h4 className="font-medium">Categories</h4>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      activeSection === 'categories' ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
                
                {activeSection === 'categories' ? (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {['Baker', 'Gardener', 'Eggs', 'Home Cook', 'Specialty'].map((category) => {
                        const value = category.toLowerCase().replace(' ', '-');
                        return (
                          <button
                            key={category}
                            type="button"
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                              filters.categories.includes(value)
                                ? 'bg-primary text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => handleArrayFilterChange('categories', value)}
                          >
                            {category}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
              
              {/* Dietary Options */}
              <div className="p-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('dietary')}
                >
                  <h4 className="font-medium">Dietary Options</h4>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      activeSection === 'dietary' ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
                
                {activeSection === 'dietary' ? (
                  <div className="mt-3 space-y-2">
                    {['Organic', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'].map((option) => {
                      const value = option.toLowerCase().replace('-', '');
                      return (
                        <div 
                          key={value} 
                          className="flex items-center"
                          onClick={() => handleArrayFilterChange('dietaryOptions', value)}
                        >
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer ${
                            filters.dietaryOptions.includes(value) 
                              ? 'bg-primary border-primary text-white' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}>
                            {filters.dietaryOptions.includes(value) && <Check className="w-3 h-3" />}
                          </div>
                          <label className="ml-2 cursor-pointer text-sm">{option}</label>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
              
              {/* Additional Options */}
              <div className="p-4 space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showFeaturedOnly"
                    name="showFeaturedOnly"
                    checked={filters.showFeaturedOnly}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
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
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="showTopRatedOnly" className="ml-2 block text-sm text-gray-700">
                    Top-rated neighbors only (4.8+)
                  </label>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-between items-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 text-gray-600 text-sm hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                Reset All
              </button>
              
              <button
                type="button"
                onClick={applyFilters}
                className="flex-1 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;