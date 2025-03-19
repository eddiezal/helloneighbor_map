// src/features/listings/components/__tests__/FilterPanel.test.tsx
import { jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FilterPanel, { FilterState } from '../FilterPanel';

describe('FilterPanel Component', () => {
  // Default filter state for testing
  const defaultFilters: FilterState = {
    maxWalkTime: 30,
    minRating: 0,
    availability: [],
    dietaryOptions: [],
    priceRange: [1, 5],
    categories: [],
    showFeaturedOnly: false,
    showTopRatedOnly: false
  };

  // Mock function for handling filter application
  const mockApplyFilters = jest.fn();
  
  beforeEach(() => {
    // Clear mock function calls between tests
    jest.clearAllMocks();
  });

  test('renders with default state correctly', () => {
    render(<FilterPanel onApplyFilters={mockApplyFilters} />);
    
    // Check that filter button is rendered
    const filterButton = screen.getByText('Filters');
    expect(filterButton).toBeInTheDocument();
    
    // Filter panel should be closed initially
    expect(screen.queryByText('Walking Distance')).not.toBeInTheDocument();
  });

  test('shows filter panel when filter button is clicked', () => {
    render(<FilterPanel onApplyFilters={mockApplyFilters} />);
    
    // Click filter button
    fireEvent.click(screen.getByText('Filters'));
    
    // Filter panel should now be visible
    expect(screen.getByText('Walking Distance')).toBeInTheDocument();
    expect(screen.getByText('Rating')).toBeInTheDocument();
    expect(screen.getByText('Availability')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Dietary Options')).toBeInTheDocument();
    
    // Action buttons should be visible
    expect(screen.getByText('Reset All')).toBeInTheDocument();
    expect(screen.getByText('Apply Filters')).toBeInTheDocument();
  });

  test('toggles sections when headers are clicked', async () => {
    render(<FilterPanel onApplyFilters={mockApplyFilters} />);
    
    // Open filter panel
    fireEvent.click(screen.getByText('Filters'));
    
    // Initially all sections should be collapsed
    // The Max walking time content should not be present (null renders nothing)
    expect(screen.queryByText(/Max walking time/i)).not.toBeInTheDocument();
    
    // Click on Walking Distance to expand it
    fireEvent.click(screen.getByText('Walking Distance'));
    
    // Now check if the content is visible
    await waitFor(() => {
      expect(screen.getByText(/Max walking time/i)).toBeInTheDocument();
    });
  });

  test('updates walking time when slider is adjusted', async () => {
    render(<FilterPanel onApplyFilters={mockApplyFilters} />);
    
    // Open filter panel
    fireEvent.click(screen.getByText('Filters'));
    
    // Open Walking Distance section
    fireEvent.click(screen.getByText('Walking Distance'));
    
    // Default value should be 30 minutes
    expect(screen.getByText('30 minutes')).toBeInTheDocument();
    
    // Get the slider input
    const slider = screen.getByRole('slider');
    
    // Change the value to 15 minutes
    fireEvent.change(slider, { target: { value: 15 } });
    
    // Text should update to show 15 minutes
    expect(screen.getByText('15 minutes')).toBeInTheDocument();
  });

  test('updates rating filter when rating option is clicked', async () => {
    render(<FilterPanel onApplyFilters={mockApplyFilters} />);
    
    // Open filter panel
    fireEvent.click(screen.getByText('Filters'));
    
    // Open Rating section
    fireEvent.click(screen.getByText('Rating'));
    
    // Click on 4+ stars option
    fireEvent.click(screen.getByText('4+ stars'));
    
    // Apply filters
    fireEvent.click(screen.getByText('Apply Filters'));
    
// src/features/listings/components/__tests__/FilterPanel.test.tsx (continued)
test('updates rating filter when rating option is clicked', async () => {
    render(<FilterPanel onApplyFilters={mockApplyFilters} />);
    
    // Open filter panel
    fireEvent.click(screen.getByText('Filters'));
    
    // Open Rating section
    fireEvent.click(screen.getByText('Rating'));
    
    // Click on 4+ stars option
    fireEvent.click(screen.getByText('4+ stars'));
    
    // Apply filters
    fireEvent.click(screen.getByText('Apply Filters'));
    
    // Check that onApplyFilters was called with updated rating
    expect(mockApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({ minRating: 4 })
    );
  });

  test('toggles availability options correctly', async () => {
    render(<FilterPanel onApplyFilters={mockApplyFilters} />);
    
    // Open filter panel
    fireEvent.click(screen.getByText('Filters'));
    
    // Open Availability section
    fireEvent.click(screen.getByText('Availability'));
    
    // Click "Available Now" option
    fireEvent.click(screen.getByText('Available Now'));
    
    // Apply filters
    fireEvent.click(screen.getByText('Apply Filters'));
    
    // Check that onApplyFilters was called with "available-now" in availability array
    expect(mockApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({ 
        availability: expect.arrayContaining(['available-now']) 
      })
    );
    
    // Reset mock
    mockApplyFilters.mockClear();
    
    // Reopen filter panel
    fireEvent.click(screen.getByText('Filters'));
    
    // Open Availability section
    fireEvent.click(screen.getByText('Availability'));
    
    // Click "Available Now" again to toggle off
    fireEvent.click(screen.getByText('Available Now'));
    
    // Apply filters
    fireEvent.click(screen.getByText('Apply Filters'));
    
    // Check that onApplyFilters was called with empty availability array
    expect(mockApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({ availability: [] })
    );
  });

  test('selects category filters correctly', async () => {
    render(<FilterPanel onApplyFilters={mockApplyFilters} />);
    
    // Open filter panel
    fireEvent.click(screen.getByText('Filters'));
    
    // Open Categories section
    fireEvent.click(screen.getByText('Categories'));
    
    // Click on Baker and Gardener
    fireEvent.click(screen.getByText('Baker'));
    fireEvent.click(screen.getByText('Gardener'));
    
    // Apply filters
    fireEvent.click(screen.getByText('Apply Filters'));
    
    // Check that onApplyFilters was called with both categories
    expect(mockApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({ 
        categories: expect.arrayContaining(['baker', 'gardener']) 
      })
    );
  });

  test('selects dietary options correctly', async () => {
    render(<FilterPanel onApplyFilters={mockApplyFilters} />);
    
    // Open filter panel
    fireEvent.click(screen.getByText('Filters'));
    
    // Open Dietary Options section
    fireEvent.click(screen.getByText('Dietary Options'));
    
    // Click on Organic and Vegan
    fireEvent.click(screen.getByText('Organic'));
    fireEvent.click(screen.getByText('Vegan'));
    
    // Apply filters
    fireEvent.click(screen.getByText('Apply Filters'));
    
    // Check that onApplyFilters was called with both dietary options
    expect(mockApplyFilters).toHaveBeenCalledWith(
        expect(mockApplyFilters).toHaveBeenCalledWith(
            expect.objectContaining({ 
              dietaryOptions: expect.arrayContaining(['organic', 'vegan']) 
            })
          );