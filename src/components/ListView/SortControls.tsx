// src/components/ListView/SortControls.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { SortOption } from './ListView';

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ sortBy, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Sort options with human-readable labels
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'distance', label: 'Closest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'reviews', label: 'Most Reviewed' },
    { value: 'name', label: 'Alphabetical' },
    { value: 'availability', label: 'Availability' }
  ];
  
  // Get current sort option label
  const currentSortLabel = sortOptions.find(option => option.value === sortBy)?.label || 'Sort';
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Sort: {currentSortLabel}</span>
        <ChevronDown className="ml-1 w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border overflow-hidden">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                sortBy === option.value ? 'bg-primary bg-opacity-10 text-primary font-medium' : 'text-gray-700'
              }`}
              onClick={() => {
                onSortChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortControls;