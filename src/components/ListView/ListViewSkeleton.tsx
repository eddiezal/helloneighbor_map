// src/components/ListView/ListViewSkeleton.tsx
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