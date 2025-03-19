import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ListingCard from '../ListingCard';

// Create a mock listing for testing
const mockListing = {
  id: '1',
  title: 'Fresh Tomatoes',
  description: 'Organic tomatoes from my garden',
  price: 5.99,
  image: 'tomato.jpg',
  location: {
    address: '123 Garden St',
    city: 'San Diego',
    state: 'CA',
    coordinates: {
      lat: 32.7157,
      lng: -117.1611
    }
  },
  owner: {
    id: 'user1',
    name: 'John Gardener',
    avatar: 'john.jpg'
  },
  createdAt: '2023-07-15T12:00:00Z',
  tags: ['organic', 'vegetables', 'local']
};

// Test suite for ListingCard component
describe('ListingCard Component', () => {
  test('renders listing information correctly', () => {
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} />
      </BrowserRouter>
    );
    
    // Check that the listing title is displayed
    expect(screen.getByText('Fresh Tomatoes')).toBeInTheDocument();
    
    // Check that the description is displayed
    expect(screen.getByText('Organic tomatoes from my garden')).toBeInTheDocument();
    
    // Check that the price is displayed
    expect(screen.getByText('$5.99')).toBeInTheDocument();
    
    // Check that the address is displayed
    expect(screen.getByText('123 Garden St')).toBeInTheDocument();
    
    // Check that tags are displayed
    expect(screen.getByText('organic')).toBeInTheDocument();
    expect(screen.getByText('vegetables')).toBeInTheDocument();
    expect(screen.getByText('local')).toBeInTheDocument();
  });
  
  // Simple test to check component renders without errors
  test('component exists', () => {
    render(
      <BrowserRouter>
        <ListingCard listing={mockListing} />
      </BrowserRouter>
    );
    expect(screen.getByText('Fresh Tomatoes')).toBeInTheDocument();
  });
});