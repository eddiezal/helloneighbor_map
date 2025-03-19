// src/test-utils/router-test-utils.ts
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Global mock navigate function for testing navigation
 */
export const mockNavigate = jest.fn();

/**
 * Set up global mocks for React Router hooks and components
 * Call this in your jest.setup.js file
 */
export function setupRouterMocks() {
  jest.mock('react-router-dom', () => ({
    __esModule: true,
    // Components
    BrowserRouter: jest.requireActual('react-router-dom').BrowserRouter,
    Routes: jest.requireActual('react-router-dom').Routes,
    Route: jest.requireActual('react-router-dom').Route,
    Link: jest.requireActual('react-router-dom').Link,
    NavLink: jest.requireActual('react-router-dom').NavLink,
    Navigate: jest.requireActual('react-router-dom').Navigate,
    Outlet: jest.requireActual('react-router-dom').Outlet,
    // Hooks
    useNavigate: () => mockNavigate,
    useParams: jest.fn().mockReturnValue({}),
    useLocation: jest.fn().mockReturnValue({ pathname: '/' }),
    useRouteMatch: jest.fn().mockReturnValue({ path: '/', url: '/' }),
  }));
}

/**
 * Helper function to render components with BrowserRouter
 */
export function renderWithRouter(
  ui: ReactElement, 
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { 
    wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
    ...options 
  });
}

/**
 * Create a custom render function that includes common wrappers
 * and the navigation mock behavior
 */
export function createTestRenderer() {
  // Clear navigation mock
  mockNavigate.mockClear();
  
  return {
    mockNavigate,
    renderWithRouter,
  };
}

/**
 * USAGE EXAMPLE:
 * 
 * // In your test file:
 * 
 * import { renderWithRouter, mockNavigate } from '../../test-utils/router-test-utils';
 * 
 * describe('MyComponent', () => {
 *   beforeEach(() => {
 *     mockNavigate.mockClear();
 *   });
 * 
 *   test('navigates to the right path', () => {
 *     renderWithRouter(<MyComponent />);
 *     
 *     fireEvent.click(screen.getByText('Go to Detail'));
 *     
 *     expect(mockNavigate).toHaveBeenCalledWith('/detail/123');
 *   });
 * });
 */