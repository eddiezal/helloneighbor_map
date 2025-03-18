// src/core/router/router.tsx
import { createBrowserRouter, RouteObject } from 'react-router-dom';

// Import layouts
import AppLayout from '../../features/ui/layout/AppLayout';

// Import pages
import HomePage from '../../pages/HomePage';
import ProducerDetailPage from '../../pages/ProducerDetailPage';
import ProfilePage from '../../pages/ProfilePage';
import LoginPage from '../../pages/LoginPage';
import RegisterPage from '../../pages/RegisterPage';
import NotFoundPage from '../../pages/NotFoundPage';

/**
 * Define application routes
 */
const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'producer/:id',
        element: <ProducerDetailPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

/**
 * Create and export the router
 */
export const router = createBrowserRouter(routes);

// src/features/ui/layout/AppLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

/**
 * Main application layout component
 * Wraps all pages with header, footer, and common layout elements
 */
const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default AppLayout;

// src/features/ui/layout/Header.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Bell } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { useAppContext } from '../../../core/context/AppContext';

/**
 * Header component with navigation and search
 */
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useAppContext();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and brand */}
          <Link to="/" className="text-2xl font-bold tracking-tight">
            HelloNeighbor
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium ${
                location.pathname === '/' ? 'text-white' : 'text-white/80 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium ${
                location.pathname === '/about' ? 'text-white' : 'text-white/80 hover:text-white'
              }`}
            >
              About
            </Link>
            <Link 
              to="/profile" 
              className={`text-sm font-medium ${
                location.pathname === '/profile' ? 'text-white' : 'text-white/80 hover:text-white'
              }`}
            >
              My Profile
            </Link>
          </nav>
          
          {/* User actions */}
          <div className="flex items-center space-x-3">
            <button 
              className="p-2 rounded-full hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
            
            <Link 
              to="/profile"
              className="p-2 rounded-full hover:bg-white/10"
              aria-label="User profile"
            >
              <User size={20} />
            </Link>
            
            {/* Mobile menu button */}
            <button 
              className="p-2 rounded-full hover:bg-white/10 md:hidden"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="mt-3">
          <SearchBar value={searchQuery} onChange={handleSearch} />
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white text-gray-800 shadow-lg">
          <nav className="container mx-auto px-4 py-2 flex flex-col space-y-2">
            <Link 
              to="/" 
              className="py-2 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="py-2 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/profile" 
              className="py-2 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              My Profile
            </Link>
            <Link 
              to="/login" 
              className="py-2 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

// src/features/ui/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component with links and information
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-lg font-semibold text-primary">
              HelloNeighbor
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              Connecting neighbors. Growing community.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">App</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/" className="text-sm text-gray-600 hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm text-gray-600 hover:text-primary">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-gray-600 hover:text-primary">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Legal</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/terms" className="text-sm text-gray-600 hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Connect</h3>
              <ul className="space-y-1">
                <li>
                  <a href="https://twitter.com" className="text-sm text-gray-600 hover:text-primary">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" className="text-sm text-gray-600 hover:text-primary">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} HelloNeighbor. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;