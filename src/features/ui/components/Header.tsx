// src/features/ui/components/Header.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Bell, Search } from 'lucide-react';
import { useAppContext } from '../../../core/context/AppContext';
import { useAuth } from '../../../core/context/AuthContext';

/**
 * Header component with navigation and search
 */
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useAppContext();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
            
            {isAuthenticated ? (
              <Link 
                to="/profile"
                className="p-2 rounded-full hover:bg-white/10"
                aria-label="User profile"
              >
                <User size={20} />
              </Link>
            ) : (
              <Link 
                to="/login"
                className="px-3 py-1.5 text-sm bg-white text-primary rounded-full hover:bg-gray-100"
              >
                Log In
              </Link>
            )}
            
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
          <div className="relative">
            <input
              type="text"
              placeholder="Search for items, neighbors, or descriptions..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-10 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/70 focus:outline-none focus:bg-white/20"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-white/70" />
            {searchQuery && (
              <button 
                className="absolute right-3 top-2.5 text-white/70 hover:text-white"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
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
            {!isAuthenticated && (
              <Link 
                to="/login" 
                className="py-2 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

// src/features/ui/components/Footer.tsx
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

// src/features/ui/components/SearchBar.tsx
import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Reusable search bar component
 */
const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder="Search for items, neighbors, or descriptions..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-10 py-2 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
      />
      <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
      {value && (
        <button 
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;

// src/features/ui/components/CategoryFilter.tsx
import React from 'react';
import { useAppContext } from '../../../core/context/AppContext';

/**
 * Category filter component
 */
const CategoryFilter: React.FC = () => {
  const { 
    categories, 
    selectedCategory, 
    setSelectedCategory 
  } = useAppContext();
  
  return (
    <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
          className={`flex items-center px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
            selectedCategory === category.id
              ? 'bg-primary text-white font-medium'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="mr-1">{category.icon}</span>
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

// src/features/ui/components/ViewToggle.tsx
import React from 'react';
import { Map, List } from 'lucide-react';
import { useAppContext } from '../../../core/context/AppContext';

/**
 * Toggle between map and list views
 */
const ViewToggle: React.FC = () => {
  const { activeView, setActiveView } = useAppContext();
  
  return (
    <div className="bg-white rounded-full border shadow-sm flex overflow-hidden">
      <button
        className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
          activeView === 'map'
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => setActiveView('map')}
        aria-label="Switch to map view"
      >
        <Map className="w-4 h-4 mr-2" />
        <span>Map</span>
      </button>
      
      <button
        className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
          activeView === 'list'
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => setActiveView('list')}
        aria-label="Switch to list view"
      >
        <List className="w-4 h-4 mr-2" />
        <span>List</span>
      </button>
    </div>
  );
};

export default ViewToggle;

// src/features/ui/components/AvailabilityFilter.tsx
import React from 'react';
import { useAppContext } from '../../../core/context/AppContext';

/**
 * Filter for producer availability
 */
const AvailabilityFilter: React.FC = () => {
  const { filterAvailability, setFilterAvailability } = useAppContext();
  
  return (
    <div className="flex space-x-2">
      <button 
        onClick={() => setFilterAvailability('now')}
        className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
          filterAvailability === 'now'
            ? 'bg-green-500 text-white font-medium'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Available Now
      </button>
      <button 
        onClick={() => setFilterAvailability('all')}
        className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
          filterAvailability === 'all'
            ? 'bg-primary text-white font-medium'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Show All
      </button>
    </div>
  );
};

export default AvailabilityFilter;

// src/features/ui/layout/AppLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryFilter from '../components/CategoryFilter';
import ViewToggle from '../components/ViewToggle';
import AvailabilityFilter from '../components/AvailabilityFilter';
import { useAppContext } from '../../../core/context/AppContext';
import { useLocation } from 'react-router-dom';

/**
 * Main application layout component
 * Wraps all pages with header, footer, and common layout elements
 */
const AppLayout: React.FC = () => {
  const { searchQuery } = useAppContext();
  const location = useLocation();
  
  // Is this the main home page that should show filters?
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Category and View Filters (only on homepage) */}
      {isHomePage && (
        <>
          <div className="bg-white border-b shadow-sm">
            <div className="container mx-auto px-4 py-3">
              <CategoryFilter />
            </div>
          </div>
          
          <div className="bg-white border-b shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <AvailabilityFilter />
              <ViewToggle />
            </div>
          </div>
        </>
      )}
      
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default AppLayout;