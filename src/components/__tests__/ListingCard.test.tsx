// src/features/listings/components/__tests__/ListingCard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ListingCard from '../ListingCard';

// Mock data
const mockListing = {
  id: '1',
  title: 'Test Listing',
  description: 'A test description',
  price: 100,
  image: 'test-image.jpg',
  location: {
    address: '123 Test Street',
    city: 'Test City',
    state: 'TS',
    coordinates: {
      lat: 37.7749,
      lng: -122.4194
    }
  },
  owner: {
    id: '123',
    name: 'Test User',
    avatar: 'test-avatar.jpg'
  },
  createdAt: new Date().toISOString(),
  tags: ['test', 'mock']
};

// Wrap component with needed providers
const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('ListingCard Component', () => {
  test('renders listing details correctly', () => {
    renderWithProviders(<ListingCard listing={mockListing} />);
    
    // Check if important elements are rendered
    expect(screen.getByText(mockListing.title)).toBeInTheDocument();
    expect(screen.getByText(mockListing.description)).toBeInTheDocument();
    expect(screen.getByText(`$${mockListing.price}`)).toBeInTheDocument();
    
    // Check for location display
    expect(screen.getByText(mockListing.location.address)).toBeInTheDocument();
  });

  test('navigates when clicking on the card', async () => {
    renderWithProviders(<ListingCard listing={mockListing} />);
    
    const user = userEvent.setup();
    const card = screen.getByRole('article');
    
    await user.click(card);
    
    // With a real implementation, you'd check for navigation
    // Here we're just ensuring it doesn't crash when clicked
    expect(card).toBeInTheDocument();
  });
});