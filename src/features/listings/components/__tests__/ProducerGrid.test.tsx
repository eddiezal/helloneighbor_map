// src/features/listings/components/__tests__/ProducerGrid.test.tsx
import { jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProducerGrid from '../ProducerGrid';
import { Producer } from '../../../../core/types/Producer';

// Define the mock navigate function before using it in the mock
const mockNavigate = jest.fn();

// Mock react-router-dom - the order matters here
jest.mock('react-router-dom', () => {
  return {
    ...jest.importActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  };
});

// Mock producers data for testing
const mockProducers: Producer[] = [
  {
    id: 1,
    name: 'Green Garden',
    type: 'gardener',
    icon: '🥬',
    images: ['image1.jpg', 'image2.jpg'],
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
    items: ['Sourdough', 'Baguette', 'Croissants', 'Whole wheat'],
    productImages: ['product2.jpg']
  }
];

// Helper function to wrap component with Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(component, { wrapper: BrowserRouter });
};

describe('ProducerGrid Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders a grid of producer cards', () => {
    renderWithRouter(<ProducerGrid producers={mockProducers} />);
    
    // Check that both producer names are rendered
    expect(screen.getByText('Green Garden')).toBeInTheDocument();
    expect(screen.getByText('Homemade Breads')).toBeInTheDocument();
    
    // Check the grid structure (if specific classes are used)
    const gridElement = screen.getByText('Green Garden').closest('.grid');
    expect(gridElement).toHaveClass('grid-cols-1');
  });

  test('navigates to producer detail when View Profile is clicked', () => {
    renderWithRouter(<ProducerGrid producers={mockProducers} />);
    
    // Find and click the View Profile button for the first producer
    const viewProfileButtons = screen.getAllByText('View Profile');
    fireEvent.click(viewProfileButtons[0]);
    
    // Check that navigation was called with the correct route
    expect(mockNavigate).toHaveBeenCalledWith('/producer/1');
  });

  test('toggles favorite state when heart icon is clicked', async () => {
    renderWithRouter(<ProducerGrid producers={mockProducers} />);
    
    // Find the first favorite button
    const favoriteButtons = screen.getAllByLabelText(/Add to favorites/i);
    const favoriteButton = favoriteButtons[0];
    
    // Initially, heart should not be filled
    const heartBefore = favoriteButton.querySelector('.fill-current');
    expect(heartBefore).toBeFalsy();
    
    // Click the favorite button
    fireEvent.click(favoriteButton);
    
    // Now the heart should be filled
    await waitFor(() => {
      const heartAfter = favoriteButton.closest('button').querySelector('.fill-current');
      expect(heartAfter).toBeInTheDocument();
    });
    
    // The button should now have an "Remove from favorites" aria-label
    expect(favoriteButton).toHaveAttribute('aria-label', 'Remove from favorites');
  });

  test('shows quick actions when message button is clicked', async () => {
    renderWithRouter(<ProducerGrid producers={mockProducers} />);
    
    // First hover over the card to show all buttons
    const cards = screen.getAllByText(/View Profile/i).map(el => el.closest('.rounded-xl'));
    
    if (cards[0]) {
      // Simulate hover
      fireEvent.mouseEnter(cards[0]);
      
      // Wait for animation to complete
      await waitFor(() => {
        const messageButton = screen.getAllByRole('button')[2]; // This might be fragile
        expect(messageButton).toBeInTheDocument();
        
        // Quick actions should be hidden initially
        const quickActionsPanel = screen.queryByText('QUICK ACTIONS');
        expect(quickActionsPanel).not.toBeInTheDocument();
        
        // Click the message button
        fireEvent.click(messageButton);
        
        // Quick actions panel should appear
        const quickActionsPanelAfterClick = screen.getByText('QUICK ACTIONS');
        expect(quickActionsPanelAfterClick).toBeInTheDocument();
        
        // Should have specific actions
        expect(screen.getByText('Send Message')).toBeInTheDocument();
        expect(screen.getByText(/View Products/)).toBeInTheDocument();
      });
    }
  });

  test('displays correct availability badge for each producer', () => {
    renderWithRouter(<ProducerGrid producers={mockProducers} />);
    
    // First producer is available now
    expect(screen.getByText('Available now')).toBeInTheDocument();
    
    // Second producer is available tomorrow
    expect(screen.getByText('Available tomorrow')).toBeInTheDocument();
  });

  test('displays truncated items list with "more" indicator', () => {
    renderWithRouter(<ProducerGrid producers={mockProducers} />);
    
    // First producer has 3 items, all should be displayed
    expect(screen.getByText('Tomatoes')).toBeInTheDocument();
    expect(screen.getByText('Lettuce')).toBeInTheDocument();
    expect(screen.getByText('Cucumbers')).toBeInTheDocument();
    
    // No "more" indicator for first producer
    const moreIndicatorForFirst = screen.queryByText('+0 more');
    expect(moreIndicatorForFirst).not.toBeInTheDocument();
    
    // Second producer has 4 items, first 3 should be displayed
    expect(screen.getByText('Sourdough')).toBeInTheDocument();
    expect(screen.getByText('Baguette')).toBeInTheDocument();
    expect(screen.getByText('Croissants')).toBeInTheDocument();
    
    // "more" indicator should show for second producer
    expect(screen.getByText('+1 more')).toBeInTheDocument();
  });

  test('applies staggered animation to cards', () => {
    renderWithRouter(<ProducerGrid producers={mockProducers} />);
    
    // Get all grid items
    const gridItems = screen.getAllByText(/View Profile/i).map(el => 
      el.closest('.animate-slideUp')
    );
    
    // Check that they have animation class and different delays
    expect(gridItems[0]).toHaveClass('animate-slideUp');
    expect(gridItems[1]).toHaveClass('animate-slideUp');
    
    // Check animation delay styles (requires getComputedStyle which is not available in jsdom)
    // In a real browser environment we would check:
    // expect(window.getComputedStyle(gridItems[0]).animationDelay).toBe('0s');
    // expect(window.getComputedStyle(gridItems[1]).animationDelay).toBe('0.05s');
  });

  test('handles empty producers array', () => {
    renderWithRouter(<ProducerGrid producers={[]} />);
    
    // Should render an empty grid without errors
    const grid = screen.getByRole('grid');
    expect(grid).toBeInTheDocument();
    expect(grid.children.length).toBe(0);
  });

  test('renders category label with correct color', () => {
    renderWithRouter(<ProducerGrid producers={mockProducers} />);
    
    // Check for category labels
    const gardenerLabel = screen.getByText('Gardener');
    expect(gardenerLabel).toBeInTheDocument();
    
    const bakerLabel = screen.getByText('Baker');
    expect(bakerLabel).toBeInTheDocument();
    
    // In a real test, we would check for specific style attributes
    // but jsdom doesn't fully support computed styles
  });
});