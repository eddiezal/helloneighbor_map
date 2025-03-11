// src/components/shared/ViewToggle.tsx
import React from 'react';
import { Map, List } from 'lucide-react';

interface ViewToggleProps {
  activeView: 'map' | 'list';
  onToggle: (view: 'map' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ activeView, onToggle }) => {
  return (
    <div className="bg-white rounded-full border shadow-sm flex overflow-hidden">
      <button
        className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
          activeView === 'map'
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => onToggle('map')}
        aria-label="Switch to map view"
      >
        <Map className="w-4 h-4 mr-2" />
        <span>Map</span>
      </button>
      
      <button
        className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
          activeView === 'list'
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => onToggle('list')}
        aria-label="Switch to list view"
      >
        <List className="w-4 h-4 mr-2" />
        <span>List</span>
      </button>
    </div>
  );
};

export default ViewToggle;