// src/features/listings/components/__tests__/ProducerListItem.test.tsx
import { jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProducerListItem from '../ProducerListItem';
import { Producer } from '../../../../core/types/Producer';

// Define the mock navigate function
const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => {
  // Create a manual mock that includes what we need
  return {
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: { children: React.ReactNode, to: string }) => <a href={to}>{children}</a>
  };
});

// Simple producer mock
const mockProducer: Producer = {
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

// Test wrapper to provide router context
const renderWithRouter = (ui: React.ReactElement) => {
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
  
  test('toggles expanded state when clicked', () => {
    renderWithRouter(<ProducerListItem producer={mockProducer} />);
    
    // Initially not expanded - action buttons not visible
    expect(screen.queryByText('View Profile')).not.toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(screen.getByText('Green Garden').closest('div')!);
    
    // Now the action buttons should be visible
    expect(screen.getByText('View Profile')).toBeInTheDocument();
  });
  
  test('toggles favorite state when heart button is clicked', () => {
    renderWithRouter(<ProducerListItem producer={mockProducer} />);
    
    // First expand the card
    fireEvent.click(screen.getByText('Green Garden').closest('div')!);
    
    // Find the heart button
    const heartButton = screen.getByLabelText('Add to favorites');
    
    // Click it to toggle favorite
    fireEvent.click(heartButton);
    
    // The label should change to indicate it's now favorited
    expect(heartButton).toHaveAttribute('aria-label', 'Remove from favorites');
  });
});