// src/features/listings/components/__tests__/ProducerGrid.test.tsx
import { jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import ProducerGrid from '../ProducerGrid';
import { Producer } from '../../../../core/types/Producer';

// Define the mock navigate function before mocking
const mockNavigate = jest.fn();

// Mock the entire react-router-dom module
jest.mock('react-router-dom', () => ({
  // Only mock the functions we need and be explicit about their implementations
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useNavigate: () => mockNavigate,
  Link: ({ children, to }: { children: React.ReactNode, to: string }) => <a href={to}>{children}</a>
}));

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

describe('ProducerGrid Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders a grid of producer cards', () => {
    render(<ProducerGrid producers={mockProducers} />);
    
    // Check that both producer names are rendered
    expect(screen.getByText('Green Garden')).toBeInTheDocument();
    expect(screen.getByText('Homemade Breads')).toBeInTheDocument();
  });

  test('navigates to producer detail when View Profile is clicked', () => {
    render(<ProducerGrid producers={mockProducers} />);
    
    // Find the first View Profile button (there will be one for each producer)
    const viewProfileButtons = screen.getAllByText('View Profile');
    
    // Click the button to trigger navigation
    fireEvent.click(viewProfileButtons[0]);
    
    // Verify that mockNavigate was called with the expected path
    expect(mockNavigate).toHaveBeenCalledWith('/producer/1');
  });

  test('displays correct availability badge for each producer', () => {
    render(<ProducerGrid producers={mockProducers} />);
    
    // First producer is available now
    expect(screen.getByText('Available now')).toBeInTheDocument();
    
    // Second producer is available tomorrow
    expect(screen.getByText('Available tomorrow')).toBeInTheDocument();
  });

  test('handles empty producers array', () => {
    render(<ProducerGrid producers={[]} />);
    
    // Should render an empty grid without errors
    const grid = screen.getByRole('grid');
    expect(grid).toBeInTheDocument();
    expect(grid.children.length).toBe(0);
  });
});