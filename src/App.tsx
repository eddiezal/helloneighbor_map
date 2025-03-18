// src/App.tsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './core/router/router';
import { AppProvider } from './core/context/AppContext';

/**
 * Root application component
 * Wraps the entire app with necessary providers
 */
function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;