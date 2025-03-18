import React from 'react';
import { AppProvider } from './core/context/AppContext';
import Router from './core/router';
import './App.css';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
};

export default App;