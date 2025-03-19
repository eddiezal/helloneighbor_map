// src/features/listings/components/__tests__/ListView.test.tsx
import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ListView from '../Listview';
import { Producer } from '../../../../core/types/Producer';

// Mock producers data for testing
const mockProducers: Producer[] = [
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
];

// Mock the context
jest.mock('../../../../core/context/AppContext', () => ({
  useAppContext: () => ({
    filteredProducers: mockProducers,
    searchQuery: '',
    setSearchQuery: jest.fn(),
    sortBy: 'distance',
    setSortBy: jest.fn()
  })
}));

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  __esModule: true,
  // Explicitly list all components we need instead of spreading
  BrowserRouter: jest.requireActual('react-router-dom').BrowserRouter,
  Routes: jest.requireActual('react-router-dom').Routes,
  Route: jest.requireActual('react-router-dom').Route,
  Link: jest.requireActual('react-router-dom').Link,
  // Add the mocked hooks
  useNavigate: () => mockNavigate
}));

// Mock the child components to simplify testing
jest.mock('../ProducerListItem', () => ({
  __esModule: true,
  default: ({ producer }: { producer: Producer }) => (
    <div data-testid="producer-list-item">{producer.name}</div>
  )
}));

jest.mock('../ProducerGrid', () => ({
  __esModule: true,
  default: ({ producers }: { producers: Producer[] }) => (
    <div data-testid="producer-grid">
      {producers.length} producers
    </div>
  )
}));

describe('ListView Component', () => {
  test('renders without errors', () => {
    render(
      <BrowserRouter>
        <ListView />
      </BrowserRouter>
    );
    
    // Check if component renders with mock data
    expect(screen.getByText('2 Neighbors Available')).toBeInTheDocument();
  });
});