// src/features/listings/components/ListView.tsx
import React, { useState } from 'react';
import { useAppContext } from '../../../core/context/AppContext';
import { SortOption } from '../../../core/context/AppContext';
import SortControls from './SortControls';
import ProducerListItem from './ProducerListItem';
import ProducerGrid from './ProducerGrid';
import { Filter, Grid, List, Search } from 'lucide-react';
import ListViewSkeleton from './ListViewSkeleton';

const ListView: React.FC = () => {
  const { 
    filteredProducers, 
    searchQuery, 
    setSearchQuery,
    sortBy,
    setSortBy
  } = useAppContext();
  
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // Toggle view mode between list and grid
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'grid' : 'list');
  };
  
  // Toggle sort dropdown visibility
  const toggleSortDropdown = () => {
    setShowSortDropdown(prev => !prev);
  };
  
  // Handle sort change
  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setShowSortDropdown(false);
  };
  
  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    
    // Simulate loading state
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  return (
    <div className="pt-3 px-4 bg-gray-50 min-h-full">
      {/* List Header with Search and Controls */}
      <div className="bg-white rounded-lg shadow-sm mb-4">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {filteredProducers.length} Neighbors Available
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
                      <button 
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 w-full text-left ${sortBy === 'reviews' ? 'bg-gray-100 font-medium' : ''}`}
                        onClick={() => handleSortChange('reviews')}
                      >
                        Most Reviewed
                      </button>
                      <button 
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 w-full text-left ${sortBy === 'name' ? 'bg-gray-100 font-medium' : ''}`}
                        onClick={() => handleSortChange('name')}
                      >
                        Alphabetical
                      </button>
                      <button 
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 w-full text-left ${sortBy === 'availability' ? 'bg-gray-100 font-medium' : ''}`}
                        onClick={() => handleSortChange('availability')}
                      >
                        Availability
                      </button>
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
                aria-label="Clear search"
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
            <SortControls 
              sortBy={sortBy} 
              onSortChange={handleSortChange} 
              showDropdown={showSortDropdown}
              toggleDropdown={toggleSortDropdown}
            />
          </div>
          
          <div className="text-gray-600">
            {filteredProducers.length} result{filteredProducers.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {/* Loading or Content */}
        <div className="p-4">
          {isLoading ? (
            <ListViewSkeleton viewMode={viewMode} />
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

// src/features/listings/components/SortControls.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SortOption } from '../../../core/context/AppContext';

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
  showDropdown: boolean;
  toggleDropdown: () => void;
}

const SortControls: React.FC<SortControlsProps> = ({ 
  sortBy, 
  onSortChange,
  showDropdown,
  toggleDropdown 
}) => {
  // Get human-readable label for current sort option
  const getSortLabel = (option: SortOption): string => {
    switch(option) {
      case 'distance': return 'Closest First';
      case 'rating': return 'Highest Rated';
      case 'reviews': return 'Most Reviewed';
      case 'name': return 'Alphabetical';
      case 'availability': return 'Availability';
      default: return 'Closest First';
    }
  };
  
  return (
    <button 
      className="ml-2 flex items-center font-medium text-primary"
      onClick={toggleDropdown}
    >
      {getSortLabel(sortBy)}
      <ChevronDown className="w-4 h-4 ml-1" />
    </button>
  );
};

export default SortControls;

// src/features/listings/components/ListViewSkeleton.tsx
import React from 'react';

interface ListViewSkeletonProps {
  viewMode: 'list' | 'grid';
}

const ListViewSkeleton: React.FC<ListViewSkeletonProps> = ({ viewMode }) => {
  // Create array of skeleton items
  const items = Array.from({ length: viewMode === 'list' ? 5 : 9 }, (_, i) => i);
  
  return (
    <div className="animate-pulse">
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item} className="border rounded-lg p-4">
              <div className="flex">
                <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item} className="border rounded-lg overflow-hidden">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListViewSkeleton;

// src/features/listings/components/ProducerListItem.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Producer } from '../../producers/types/producer.types';
import { Star, Clock, Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppContext } from '../../../core/context/AppContext';

// Category color mapping (should be consistent across the app)
const CATEGORY_COLORS = {
  baker: '#FF5252',     // Red
  gardener: '#4CAF50',  // Green
  eggs: '#FFC107',      // Amber/Yellow
  homecook: '#9C27B0',  // Purple
  specialty: '#FF9800', // Orange
  default: '#2196F3'    // Blue (fallback)
};

interface ProducerListItemProps {
  producer: Producer;
}

const ProducerListItem: React.FC<ProducerListItemProps> = ({ producer }) => {
  const [expanded, setExpanded] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const navigate = useNavigate();
  const { setSelectedProducer } = useAppContext();
  
  // Availability badge color and text
  const getAvailabilityInfo = () => {
    switch (producer.availability) {
      case 'now':
        return { text: 'Available now', color: '#4CAF50' };
      case 'tomorrow':
        return { text: 'Available tomorrow', color: '#FF9800' };
      case 'weekend':
        return { text: 'Available this weekend', color: '#9C27B0' };
      default:
        return { text: 'Check availability', color: '#757575' };
    }
  };
  
  const availability = getAvailabilityInfo();
  
  // Get category color
  const categoryColor = CATEGORY_COLORS[producer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
  
  // Toggle favorite status
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorited(!favorited);
  };
  
  // Handle view profile click
  const handleViewProfile = () => {
    setSelectedProducer(producer);
    navigate(`/producer/${producer.id}`);
  };
  
  // Random viewers count for social proof
  const viewersCount = Math.floor(Math.random() * 5) + 1;
  
  return (
    <div 
      className="border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md bg-white"
      style={{ borderLeftColor: categoryColor, borderLeftWidth: '4px' }}
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start">
          {/* Producer image or icon */}
          <div className="w-16 h-16 rounded-full mr-4 overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
            {producer.images && producer.images.length > 0 ? (
              <img 
                src={producer.images[0]} 
                alt={producer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">{producer.icon}</span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 truncate pr-2">{producer.name}</h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Star className="text-yellow-500 w-4 h-4 mr-1" />
                  <span>{producer.rating}</span>
                  <span className="mx-1 text-gray-400">·</span>
                  <span>{producer.reviews} reviews</span>
                </div>
              </div>
              
              <div className="flex items-center">
                {/* Availability badge */}
                <span 
                  className="text-xs px-2 py-1 rounded-full font-medium flex items-center mr-2"
                  style={{ backgroundColor: `${availability.color}20`, color: availability.color }}
                >
                  <span 
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: availability.color }}
                  ></span>
                  {availability.text}
                </span>
                
                {/* Expand/collapse button */}
                <button className="text-gray-400 hover:text-gray-600" aria-label={expanded ? "Collapse" : "Expand"}>
                  {expanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{producer.description}</p>
            
            <div className="flex items-center justify-between mt-2 text-sm">
              <div className="flex items-center text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>{producer.walkTime} min walk</span>
              </div>
              
              {/* Viewers count */}
              <div className="text-xs text-gray-500 flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                {viewersCount} {viewersCount === 1 ? 'person' : 'people'} viewing
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expanded content */}
      {expanded && (
        <div className="p-4 pt-0 border-t mt-2">
          <div className="text-sm font-medium text-gray-700 mt-2 mb-2">Available Items:</div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {producer.items.map((item, index) => (
              <div 
                key={index} 
                className="bg-gray-50 px-3 py-2 rounded-md text-sm"
              >
                {item}
                <span className="ml-2 text-xs bg-gray-200 px-1 rounded text-gray-600">
                  {/* Random available count */}
                  {Math.floor(Math.random() * 10) + 1}
                </span>
              </div>
            ))}
          </div>
          
          {/* Photo gallery */}
          {producer.images && producer.images.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Gallery:</div>
              <div className="grid grid-cols-3 gap-2">
                {producer.images.slice(0, 3).map((img, index) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden">
                    <img 
                      src={img} 
                      alt={`${producer.name} product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex space-x-2 mt-3">
            <button 
              className="flex-1 bg-primary text-white py-2 px-4 rounded-full text-sm font-medium"
              onClick={handleViewProfile}
            >
              View Profile
            </button>
            <button className="flex-1 border border-gray-300 py-2 px-4 rounded-full text-sm font-medium text-gray-600 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              Message
            </button>
            <button 
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                favorited ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400'
              }`}
              onClick={toggleFavorite}
              aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProducerListItem;

// src/features/listings/components/ProducerGrid.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Producer } from '../../producers/types/producer.types';
import { Star, Clock, Heart } from 'lucide-react';
import { useAppContext } from '../../../core/context/AppContext';

// Category color mapping (should be consistent across the app)
const CATEGORY_COLORS = {
  baker: '#FF5252',     // Red
  gardener: '#4CAF50',  // Green
  eggs: '#FFC107',      // Amber/Yellow
  homecook: '#9C27B0',  // Purple
  specialty: '#FF9800', // Orange
  default: '#2196F3'    // Blue (fallback)
};

interface ProducerGridProps {
  producers: Producer[];
}

const ProducerGrid: React.FC<ProducerGridProps> = ({ producers }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {producers.map(producer => (
        <ProducerGridCard key={producer.id} producer={producer} />
      ))}
    </div>
  );
};

// The individual card component used in the grid
interface ProducerGridCardProps {
  producer: Producer;
}

const ProducerGridCard: React.FC<ProducerGridCardProps> = ({ producer }) => {
  const [favorited, setFavorited] = React.useState(false);
  const navigate = useNavigate();
  const { setSelectedProducer } = useAppContext();
  
  // Availability badge color and text
  const getAvailabilityInfo = () => {
    switch (producer.availability) {
      case 'now':
        return { text: 'Available now', color: '#4CAF50' };
      case 'tomorrow':
        return { text: 'Available tomorrow', color: '#FF9800' };
      case 'weekend':
        return { text: 'Available this weekend', color: '#9C27B0' };
      default:
        return { text: 'Check availability', color: '#757575' };
    }
  };
  
  const availability = getAvailabilityInfo();
  
  // Get category color
  const categoryColor = CATEGORY_COLORS[producer.type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
  
  // Toggle favorite status
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorited(!favorited);
  };
  
  // Handle view profile click
  const handleViewProfile = () => {
    setSelectedProducer(producer);
    navigate(`/producer/${producer.id}`);
  };
  
  // Random viewers count for social proof
  const viewersCount = Math.floor(Math.random() * 5) + 1;
  
  return (
    <div className="rounded-lg overflow-hidden border bg-white hover:shadow-md transition-shadow duration-200">
      {/* Card header with image */}
      <div className="relative h-48">
        {producer.images && producer.images.length > 0 ? (
          <img 
            src={producer.images[0]} 
            alt={producer.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ backgroundColor: `${categoryColor}20` }}
          >
            {producer.icon}
          </div>
        )}
        
        {/* Category indicator */}
        <div 
          className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-medium"
          style={{ backgroundColor: 'white', color: categoryColor }}
        >
          {(() => {
            switch(producer.type) {
              case 'baker': return 'Baker';
              case 'gardener': return 'Gardener';
              case 'eggs': return 'Eggs';
              case 'homecook': return 'Home Cook';
              case 'specialty': return 'Specialty';
              default: return producer.type;
            }
          })()}
        </div>
        
        {/* Favorite button */}
        <button 
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm ${
            favorited ? 'text-red-500' : 'text-gray-400'
          }`}
          onClick={toggleFavorite}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>
        
        {/* Availability badge */}
        <div 
          className="absolute bottom-3 left-3 text-xs px-2 py-1 rounded-full font-medium flex items-center"
          style={{ backgroundColor: 'white', color: availability.color }}
        >
          <span 
            className="w-2 h-2 rounded-full mr-1"
            style={{ backgroundColor: availability.color }}
          ></span>
          {availability.text}
        </div>
        
        {/* Viewers indicator */}
        <div className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded-full bg-white text-gray-600 flex items-center">
          <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
          {viewersCount}
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 truncate">{producer.name}</h3>
          <div className="flex items-center text-sm">
            <Star className="text-yellow-500 w-4 h-4 mr-1" />
            <span>{producer.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mt-1 line-clamp-2 h-10">
          {producer.description}
        </p>
        
        {/* Available items preview */}
        <div className="mt-3 flex flex-wrap gap-1">
          {producer.items.slice(0, 3).map((item, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 bg-gray-100 rounded-full truncate max-w-[140px]"
            >
              {item}
            </span>
          ))}
          {producer.items.length > 3 && (
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
              +{producer.items.length - 3} more
            </span>
          )}
        </div>
        
        {/* Walking time */}
        <div className="mt-3 text-sm text-gray-500 flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>{producer.walkTime} min walk</span>
        </div>
        
        {/* Action button */}
        <button 
          className="mt-3 w-full bg-primary text-white py-2 rounded-full text-sm font-medium"
          onClick={handleViewProfile}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ProducerGrid;