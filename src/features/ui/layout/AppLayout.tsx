import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../../core/context/AppContext';
import { Search, User, Menu, X, Map, List } from 'lucide-react';

const AppLayout: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory,
    filterAvailability,
    setFilterAvailability,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    isAuthenticated,
    user
  } = useAppContext();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Categories for filter
  const categories = [
    { id: 'all', label: 'All', icon: '🏡' },
    { id: 'gardener', label: 'Produce', icon: '🥬' },
    { id: 'baker', label: 'Baked', icon: '🍞' },
    { id: 'eggs', label: 'Eggs', icon: '🥚' },
    { id: 'homecook', label: 'MEHKO', icon: '👨‍🍳' },
    { id: 'specialty', label: 'Specialty', icon: '🍯' }
  ];
  
  // Is this the main home page that should show the map/list view?
  const isHomePage = location.pathname === '/';
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">HelloNeighbor</span>
            </Link>
            
            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link 
                to="/" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary"
              >
                Explore
              </Link>
              <Link 
                to="/about" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary"
              >
                Contact
              </Link>
            </nav>
            
            {/* Authentication/Profile */}
            <div className="flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center">
                  <span className="mr-2 text-sm hidden md:inline-block">Hi, {user?.name || 'User'}</span>
                  <Link 
                    to="/profile"
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/login"
                    className="px-3 py-1.5 text-sm border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/register"
                    className="px-3 py-1.5 text-sm bg-primary text-white rounded-full hover:bg-primary-dark transition-colors hidden md:block"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button 
                className="p-2 ml-3 text-gray-600 rounded-md md:hidden"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          
          {/* Category Filters */}
          {isHomePage && (
            <div className="py-3 border-t overflow-x-auto scrollbar-hide">
              <div className="flex space-x-2">
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
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* View Mode & Availability Filters */}
          {isHomePage && (
            <div className="py-3 border-t flex justify-between items-center overflow-x-auto scrollbar-hide">
              {/* Availability filters */}
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
              
              {/* View mode toggle */}
              <div className="flex border rounded-lg overflow-hidden">
                <button 
                  onClick={() => setViewMode('map')}
                  className={`flex items-center px-3 py-1.5 text-sm ${
                    viewMode === 'map'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Map className="w-4 h-4 mr-1" />
                  Map
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`flex items-center px-3 py-1.5 text-sm ${
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <List className="w-4 h-4 mr-1" />
                  List
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-2 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {!isAuthenticated && (
              <Link 
                to="/register" 
                className="block px-3 py-2 rounded-md text-base font-medium text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
      
      {/* Search Bar (only on homepage) */}
      {isHomePage && (
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for ingredients, foods, neighbors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-10 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              {searchQuery && (
                <button 
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} HelloNeighbor. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <Link to="/about" className="text-sm text-gray-600 hover:text-primary">
                About
              </Link>
              <Link to="/contact" className="text-sm text-gray-600 hover:text-primary">
                Contact
              </Link>
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm text-gray-600 hover:text-primary">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;