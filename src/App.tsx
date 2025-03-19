// src/App.tsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './core/router/router';
import { AppProvider } from './core/context/AppContext';
import { AuthProvider } from './core/context/AuthContext';

/**
 * Root application component
 * Wraps the entire app with necessary providers
 */
function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;