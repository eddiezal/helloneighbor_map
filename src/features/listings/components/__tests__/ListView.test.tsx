// ADD THIS AT THE TOP of src/features/listings/components/__tests__/ListView.test.tsx
import { jest } from '@jest/globals';

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ListView from '../ListView';
// CHANGE this line to an import statement
import * as AppContextModule from '../../../../core/context/AppContext';
// ADD this line to import mock data (or create the file if it doesn't exist)
import { mockProducers } from '../../../../data/mockProducers';

// Mock the ProducerListItem component to simplify testing
jest.mock('../ProducerListItem', () => {
  return ({ producer }) => (
    <div data-testid="producer-list-item">
      <div>{producer.name}</div>
      <div>{producer.type}</div>
    </div>
  );
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

// CHANGE the way the mock is defined
jest.mock('../../../../core/context/AppContext', () => {
  return {
    // Change requireActual to importActual
    ...jest.importActual('../../../../core/context/AppContext'),
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

// For the test that needs custom context values
// CHANGE this to use jest.spyOn instead of require
describe('ListView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // The test that was incorrectly placed in the mock
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
    expect(screen.getAllByText('Filter Panel')).toHaveLength(2);
  });

  // For the test that uses a custom useAppContext implementation
  test('shows correct producer count', () => {
    // Create a custom array of producers for this test
    const customProducers = Array(5).fill({
      id: 1,
      name: 'Test Producer',
      type: 'gardener',
      rating: 4.5,
      reviews: 10
    });
    
    // REPLACE this approach
    // const originalUseAppContext = require('../../../../core/context/AppContext').useAppContext;
    // require('../../../../core/context/AppContext').useAppContext = customUseAppContext;
    
    // WITH this approach using spyOn
    const useAppContextSpy = jest.spyOn(AppContextModule, 'useAppContext');
    useAppContextSpy.mockImplementation(() => ({
      filteredProducers: customProducers,
      searchQuery: '',
      setSearchQuery: mockSetSearchQuery,
      sortBy: 'distance',
      setSortBy: mockSetSortBy
    }));
    
    render(<ListView />, { wrapper: BrowserRouter });
    
    // Check for the correct count in the header and results display
    expect(screen.getByText(/5 Neighbors Available/i)).toBeInTheDocument();
    expect(screen.getByText(/5 result/i)).toBeInTheDocument();
    
    // Clean up the spy after the test
    useAppContextSpy.mockRestore();
  });

  // Rest of your tests stay the same...
});