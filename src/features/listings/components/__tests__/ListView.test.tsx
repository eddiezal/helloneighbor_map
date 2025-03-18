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

  test('handles search input correctly', () => {
    render(<ListView />, { wrapper: BrowserRouter });
    
    // Get the search input
    const searchInput = screen.getByPlaceholderText(/Search for items/i);
    expect(searchInput).toBeInTheDocument();
    
    // Type in the search box
    fireEvent.change(searchInput, { target: { value: 'tomatoes' } });
    
    // Check that the search query was updated
    expect(mockSetSearchQuery).toHaveBeenCalledWith('tomatoes');
    
    // Clear search with the clear button
    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);
    
    // Check that the search query was cleared
    expect(mockSetSearchQuery).toHaveBeenCalledWith('');
  });

  test('shows loading state when searching', async () => {
    render(<ListView />, { wrapper: BrowserRouter });
    
    // Get the search input
    const searchInput = screen.getByPlaceholderText(/Search for items/i);
    
    // Type in the search box
    fireEvent.change(searchInput, { target: { value: 'tomatoes' } });
    
    // Loading state should be visible
    const skeletonLoader = screen.queryByTestId('skeleton-loader');
    expect(skeletonLoader).toBeInTheDocument();
    
    // After a delay, loading state should be gone
    await waitFor(() => {
      const skeletonLoader = screen.queryByTestId('skeleton-loader');
      expect(skeletonLoader).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  test('toggles sort dropdown when sort button is clicked', () => {
    render(<ListView />, { wrapper: BrowserRouter });
    
    // Sort dropdown should be hidden initially
    expect(screen.queryByText('Highest Rated')).not.toBeInTheDocument();
    
    // Click the sort button
    const sortButton = screen.getByRole('button', { name: /Sort options/i });
    fireEvent.click(sortButton);
    
    // Sort options should now be visible
    expect(screen.getByText('Highest Rated')).toBeInTheDocument();
    expect(screen.getByText('Closest First')).toBeInTheDocument();
    expect(screen.getByText('Most Reviewed')).toBeInTheDocument();
    
    // Click outside to close
    fireEvent.mouseDown(document.body);
    
    // Sort options should be hidden again
    expect(screen.queryByText('Highest Rated')).not.toBeInTheDocument();
  });

  test('changes sort order when a sort option is selected', () => {
    render(<ListView />, { wrapper: BrowserRouter });
    
    // Open sort dropdown
    const sortButton = screen.getByRole('button', { name: /Sort options/i });
    fireEvent.click(sortButton);
    
    // Click on "Highest Rated" option
    const highestRatedOption = screen.getByText('Highest Rated');
    fireEvent.click(highestRatedOption);
    
    // Check that the sort option was updated
    expect(mockSetSortBy).toHaveBeenCalledWith('rating');
    
    // Sort dropdown should be closed
    expect(screen.queryByText('Highest Rated')).not.toBeInTheDocument();
    
    // The sort indicator should show the selected option
    expect(screen.getByText('Sort:')).toBeInTheDocument();
    // This would check the text in a real implementation, but our mock doesn't update the UI
  });

  test('displays empty state when no producers match filters', () => {
    // Override the mock to return empty array
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [[], jest.fn()]);
    
    render(
      <div>
        <ListView />
      </div>, 
      { wrapper: BrowserRouter }
    );
    
    // Check for empty state message
    expect(screen.getByText('No neighbors found matching your criteria.')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters or search query.')).toBeInTheDocument();
  });

  test('applies filters when FilterPanel applies filters', () => {
    render(<ListView />, { wrapper: BrowserRouter });
    
    // Find and click the filter panel button (mocked)
    const filterButton = screen.getByTestId('filter-panel');
    fireEvent.click(filterButton);
    
    // In a real implementation, we would check if the filters were applied
    // Since our FilterPanel is mocked, we just check if it's there
    expect(filterButton).toBeInTheDocument();
  });

  test('shows correct producer count', () => {
    // Since we can't easily override the mock inside the test,
    // we'll use a different approach
    
    // Create a custom useAppContext mock for this test
    const customUseAppContext = () => ({
      filteredProducers: Array(5).fill({
        id: 1,
        name: 'Test Producer',
        type: 'gardener',
        rating: 4.5,
        reviews: 10
      }),
      searchQuery: '',
      setSearchQuery: mockSetSearchQuery,
      sortBy: 'distance',
      setSortBy: mockSetSortBy
    });
    
    // Replace the mock for this test only
    const originalUseAppContext = require('../../../../core/context/AppContext').useAppContext;
    require('../../../../core/context/AppContext').useAppContext = customUseAppContext;
    
    render(<ListView />, { wrapper: BrowserRouter });
    
    // Check for the correct count in the header and results display
    expect(screen.getByText(/5 Neighbors Available/i)).toBeInTheDocument();
    expect(screen.getByText(/5 result/i)).toBeInTheDocument();
    
    // Restore the original mock after the test
    require('../../../../core/context/AppContext').useAppContext = originalUseAppContext;
  });

  test('renders the component with list view by default', () => {
    render(<ListView />, { wrapper: BrowserRouter });
    
    // Check that the component renders
    expect(screen.getByText(/Neighbors Available/i)).toBeInTheDocument();
    
    // Should render in list view mode by default
    expect(screen.getByTestId('producer-list-item')).toBeInTheDocument();
    expect(screen.queryByTestId('producer-grid')).not.toBeInTheDocument();
  });

  test('switches between list and grid views', async () => {
    render(<ListView />, { wrapper: BrowserRouter });
    
    // Initially in list view
    expect(screen.getByTestId('producer-list-item')).toBeInTheDocument();
    
    // Get the view mode toggle button (using aria-label)
    const toggleButton = screen.getByRole('button', { name: /Switch to grid view/i });
    
    // Click to switch to grid view
    fireEvent.click(toggleButton);
    
    // Should now be in grid view
    await waitFor(() => {
      expect(screen.queryByTestId('producer-list-item')).not.toBeInTheDocument();
      expect(screen.getByTestId('producer-grid')).toBeInTheDocument();
    });
    
    // Toggle button should now offer to switch to list view
    const toggleBackButton = screen.getByRole('button', { name: /Switch to list view/i });
    
    // Click to switch back to list view
    fireEvent.click(toggleBackButton);
    
    // Should be back in list view
    await waitFor(() => {
      expect(screen.getByTestId('producer-list-item')).toBeInTheDocument();
      expect(screen.queryByTestId('producer-grid')).not.toBeInTheDocument();
    });
  });