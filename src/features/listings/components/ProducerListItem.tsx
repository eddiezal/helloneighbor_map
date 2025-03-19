import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProducerListItem from '../ProducerListItem';

// Mock the navigation function
const mockNavigate = jest.fn();

// Mock the react-router-dom module
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Create a simple mock producer for testing
const mockProducer = {
  id: 1,
  name: 'Green Garden',
  type: 'gardener',
  icon: '🥬',
  images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
  description: 'Fresh organic vegetables from my backyard garden',
  rating: 4.8,
  reviews: 24,
  distance: 0.4,
  walkTime: 8,
  lat: 32.7157,
  lng: -117.1611,
  availability: 'now',
  featured: true,
  items: ['Tomatoes', 'Lettuce', 'Cucumbers', 'Zucchini'],
  productImages: ['product1.jpg', 'product2.jpg']
};

// Helper function to render with Router context
const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('ProducerListItem Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  // A simple test that will pass to get things working
  test('component exists', () => {
    renderWithRouter(<ProducerListItem producer={mockProducer} />);
    expect(screen.getByText('Green Garden')).toBeInTheDocument();
  });
});