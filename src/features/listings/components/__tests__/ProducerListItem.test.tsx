// src/features/listings/components/__tests__/ProducerListItem.test.tsx
import { jest } from '@jest/globals';

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProducerListItem from '../ProducerListItem';
import { AvailabilityStatus, ProducerType } from '../../../../core/types/Producer';

// Define the mock navigate function before using it in the mock
const mockNavigate = jest.fn();

// Now use mockNavigate in the mock
jest.mock('react-router-dom', () => {
  return {
    ...jest.importActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  };
});

// Simple producer mock that doesn't rely on importing the full Producer type
const mockProducer = {
  id: 1,
  name: 'Green Garden',
  type: 'gardener' as ProducerType,
  icon: '🥬',
  images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
  description: 'Fresh organic vegetables from my backyard garden',
  rating: 4.8,
  reviews: 24,
  distance: 0.4,
  walkTime: 8,
  lat: 32.7157,
  lng: -117.1611,
  availability: 'now' as AvailabilityStatus,
  featured: true,
  items: ['Tomatoes', 'Lettuce', 'Cucumbers', 'Zucchini'],
  productImages: ['product1.jpg', 'product2.jpg']
};

// Test wrapper to provide router context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('ProducerListItem Component', () => {
  test('renders basic producer information correctly', () => {
    renderWithRouter(<ProducerListItem producer={mockProducer} />);
    
    // Check that the producer name is displayed
    expect(screen.getByText('Green Garden')).toBeInTheDocument();
    
    // Check rating and reviews
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('24 reviews')).toBeInTheDocument();
    
    // Check walking time
    expect(screen.getByText('8 min walk')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText('Fresh organic vegetables from my backyard garden')).toBeInTheDocument();
  });

  test('displays availability badge with correct status', () => {
    renderWithRouter(<ProducerListItem producer={mockProducer} />);
    expect(screen.getByText('Available now')).toBeInTheDocument();
  });
});