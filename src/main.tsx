// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom variables */
:root {
  --primary: #2A5D3C;
  --primary-light: #e8f4ea;
  --secondary: #FFDE7D;
}

/* Global styles */
html, body, #root {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Hide scrollbars but keep functionality */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Line clamp utilities */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}

/* Tailwind class extensions */
@layer components {
  .btn-primary {
    @apply bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors;
  }
  
  .btn-secondary {
    @apply border border-gray-300 px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors;
  }
  
  .input-primary {
    @apply w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary;
  }
}