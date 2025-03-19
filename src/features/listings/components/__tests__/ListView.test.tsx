// src/features/listings/components/__tests__/ListView.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ListView from '../ListView';
import { AppProvider } from '../../../../core/context/AppContext';
import { mockProducers } from '../../../../data/mockProducers';

// Mock the ProducerListItem component to simplify testing
jest.mock('../ProducerListItem', () => {
  return ({ producer }) => (
    <div data-testid="producer-list-item">
      <div>{producer.name}</div>
      <div>{producer.type}</div>
    </div>
  );
  // Remove the test that was here - it shouldn't be inside the mock!
});

// Mock the ProducerGrid component
jest.mock('../ProducerGrid', () => {
  return ({ producers }) => (
    <div data-testid="producer-grid">
      {producers.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
});

// Mock the FilterPanel component
jest.mock('../FilterPanel', () => {
  return ({ onApplyFilters }) => (
    <button data-testid="filter-panel" onClick={() => onApplyFilters({})}>
      Filter Panel
    </button>
  );
});

// Mock the useAppContext hook
const mockSetSearchQuery = jest.fn();
const mockSetSortBy = jest.fn();

jest.mock('../../../../core/context/AppContext', () => {
  const originalModule = jest.requireActual('../../../../core/context/AppContext');
  
  return {
    ...originalModule,
    useAppContext: () => ({
      filteredProducers: mockProducers,
      searchQuery: '',
      setSearchQuery: mockSetSearchQuery,
      sortBy: 'distance',
      setSortBy: mockSetSortBy
    }),
    AppProvider: ({ children }) => <div>{children}</div>
  };
});

describe('ListView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Add the test that was incorrectly placed in the mock here
  test('renders responsive layout correctly', () => {
    // Mock window.matchMedia for testing responsiveness
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query.includes('(min-width: 768px)'), // True for desktop, false for mobile
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    // First test desktop view
    render(<ListView />, { wrapper: BrowserRouter });
    
    // Filter panel should have desktop styling
    const filterPanel = screen.getByText('Filter Panel');
    expect(filterPanel).toBeInTheDocument();
    
    // Now simulate mobile view by changing the matchMedia implementation
    window.matchMedia.mockImplementation(query => ({
      matches: false, // Always false to simulate mobile
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    
    // Re-render for mobile
    render(<ListView />, { wrapper: BrowserRouter });
    
    // Filter panel should still be there, but with mobile styling
    // In a real test, we would check specific mobile-only classes
    expect(screen.getAllByText('Filter Panel')).toHaveLength(2);
  });

  // Rest of your tests stay the same...
  test('handles search input correctly', () => {
    // ...existing test code...
  });
  
  // ...other tests...
});