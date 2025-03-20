// src/components/shared/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import { useAppContext } from '../../core/context/AppContext';

// Define fixed styles since Tailwind classes aren't being processed correctly
const styles = {
  header: {
    backgroundColor: '#2A5D3C',
    color: 'white',
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
  },
  navLink: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  activeNavLink: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
  },
  loginButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
  },
  signupButton: {
    backgroundColor: 'white',
    color: '#2A5D3C',
  }
};

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

  return (
    <header className="sticky top-0 z-20 transition-all duration-300" style={styles.header}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold" style={{color: 'white'}}>
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
                className="w-full py-2 pl-10 pr-4 rounded-full text-sm focus:outline-none"
                style={styles.searchInput}
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4" style={{color: 'rgba(255, 255, 255, 0.7)'}} />
              
              {searchQuery && (
                <button 
                  className="absolute right-3 top-2.5"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  style={{color: 'rgba(255, 255, 255, 0.7)'}}
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
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              style={location.pathname === '/' ? styles.activeNavLink : styles.navLink}
            >
              Home
            </Link>
            
            <Link 
              to="/about" 
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              style={location.pathname === '/about' ? styles.activeNavLink : styles.navLink}
            >
              About
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center">
                <button className="p-2 rounded-full" style={{color: 'white'}}>
                  <Bell className="w-5 h-5" />
                </button>
                
                <Link 
                  to="/profile"
                  className="ml-1 p-2 rounded-full"
                  style={{color: 'white'}}
                >
                  <User className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login"
                  className="px-4 py-1.5 text-sm rounded-full border"
                  style={styles.loginButton}
                >
                  Log In
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-1.5 text-sm rounded-full"
                  style={styles.signupButton}
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
              className="p-2 rounded-md"
              style={{color: 'white'}}
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
              className="w-full py-2 pl-10 pr-4 rounded-full text-sm focus:outline-none"
              style={styles.searchInput}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4" style={{color: 'rgba(255, 255, 255, 0.7)'}} />
            
            {searchQuery && (
              <button 
                className="absolute right-3 top-2.5"
                onClick={clearSearch}
                aria-label="Clear search"
                style={{color: 'rgba(255, 255, 255, 0.7)'}}
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
                  className="block w-full text-center px-4 py-2 text-sm rounded-full border"
                  style={{borderColor: '#2A5D3C', color: '#2A5D3C'}}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/register"
                  className="block w-full text-center px-4 py-2 text-sm rounded-full"
                  style={{backgroundColor: '#2A5D3C', color: 'white'}}
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