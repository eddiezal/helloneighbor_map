// src/components/shared/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import { useAppContext } from '../../core/context/AppContext';

const Header: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    isAuthenticated, 
    user 
  } = useAppContext();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Track scroll position for header styling
  useEffect(() => {
    // Initialize isScrolled based on current scroll position
    setIsScrolled(window.scrollY > 20);
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Force the header to always show the primary color initially
  // by adding !important to the bg-primary class
  return (
    <header className="sticky top-0 z-20 transition-all duration-300 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-white">
              HelloNeighbor
            </span>
          </Link>
          
          {/* Search Bar (Desktop) */}
          <div className="hidden md:block flex-1 max-w-xl mx-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for ingredients, foods, neighbors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-full text-sm 
                  bg-white/20 focus:bg-white/30 placeholder-white/70 text-white 
                  border-white/20 border focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/70" />
              
              {searchQuery && (
                <button 
                  className="absolute right-3 top-2.5 text-white/70 hover:text-white"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          {/* Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors 
                ${location.pathname === '/' ? 'text-white bg-white/10' : 'text-white/90 hover:text-white hover:bg-white/10'}`}
            >
              Home
            </Link>
            
            <Link 
              to="/about" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors 
                ${location.pathname === '/about' ? 'text-white bg-white/10' : 'text-white/90 hover:text-white hover:bg-white/10'}`}
            >
              About
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center">
                <button className="p-2 rounded-full text-white hover:bg-white/10">
                  <Bell className="w-5 h-5" />
                </button>
                
                <Link 
                  to="/profile"
                  className="ml-1 p-2 rounded-full text-white hover:bg-white/10"
                >
                  <User className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login"
                  className="px-4 py-1.5 text-sm rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20"
                >
                  Log In
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-1.5 text-sm rounded-full bg-white text-primary hover:bg-white/90"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-white hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for items or neighbors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-full text-sm bg-white/20 
                focus:bg-white/30 placeholder-white/70 text-white border-white/20 border
                focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/70" />
            
            {searchQuery && (
              <button 
                className="absolute right-3 top-2.5 text-white/70 hover:text-white"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="flex flex-col divide-y divide-gray-100">
            <Link 
              to="/" 
              className="px-4 py-3 text-gray-800 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            <Link 
              to="/about" 
              className="px-4 py-3 text-gray-800 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            
            <Link 
              to="/contact" 
              className="px-4 py-3 text-gray-800 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className="px-4 py-3 text-gray-800 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button className="px-4 py-3 text-left text-gray-800 hover:bg-gray-50">
                  Logout
                </button>
              </>
            ) : (
              <div className="p-4 space-y-2">
                <Link 
                  to="/login"
                  className="block w-full text-center px-4 py-2 text-sm rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/register"
                  className="block w-full text-center px-4 py-2 text-sm rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;