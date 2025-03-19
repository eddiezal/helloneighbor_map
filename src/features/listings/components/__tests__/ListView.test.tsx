// src/features/listings/components/__tests__/ListView.test.tsx
import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ListView from '../ListView';
import { Producer } from '../../../../core/types/Producer';

// Create a mock context for testing
jest.mock('../../../../core/context/AppContext', () => ({
  useAppContext: () => ({
    filteredProducers: [
      {
        id: 1,
        name: 'Green Garden',
        type: 'gardener',
        icon: '🥬',
        images: ['image1.jpg'],
        description: 'Fresh vegetables from my garden',
        rating: 4.7,
        reviews: 15,
        distance: 0.3,
        walkTime: 7,
        lat: 32.715,
        lng: -117.161,
        availability: 'now',
        featured: true,
        items: ['Tomatoes', 'Lettuce', 'Cucumbers'],
        productImages: ['product1.jpg']
      },
      {
        id: 2,
        name: 'Homemade Breads',
        type: 'baker',
        icon: '🍞',
        images: ['bread1.jpg'],
        description: 'Artisanal bread baked daily',
        rating: 4.9,
        reviews: 32,
        distance: 0.8,
        walkTime: 15,
        lat: 32.716,
        lng: -117.162,
        availability: 'tomorrow',
        featured: false,
        items: ['Sourdough', 'Baguette', 'Croissants'],
        productImages: ['product2.jpg']
      }
    ],
    searchQuery: '',
    setSearchQuery: jest.fn(),
    sortBy: 'distance',
    setSortBy: jest.fn()
  })
}));

// Simple test to make Jest happy
test('ListView renders without errors', () => {
  render(
    <BrowserRouter>
      <ListView />
    </BrowserRouter>
  );
  
  // Check if component renders with mock data
  expect(screen.getByText('2 Neighbors Available')).toBeInTheDocument();
});