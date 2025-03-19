// src/App.tsx
<<<<<<< Updated upstream
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
=======
import { useState, useEffect, CSSProperties } from 'react';
import MapView from './components/Map/MapView';
// Import both list views to maintain compatibility
import ListView from './components/ListView/ListView';
import EnhancedListView from './components/ListView/EnhancedListView'; // Import the enhanced version
import { producers } from './data/mockProducers';
import { Search } from 'lucide-react';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('now');
  const [activeView, setActiveView] = useState('map');
  const [useEnhancedUI, setUseEnhancedUI] = useState(true); // Toggle for enhanced UI
  const [searchFocused, setSearchFocused] = useState(false);

  // Load Quicksand font
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Enhanced style objects with modern touches
  const styles: Record<string, CSSProperties> = {
    container: {
      height: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: useEnhancedUI ? '#f9fafb' : 'white'
    },
    header: {
      background: useEnhancedUI 
        ? 'linear-gradient(135deg, #2A5D3C 0%, #3A6A4B 100%)' 
        : 'linear-gradient(to right, #2A5D3C, #3A6A4B)',
      color: 'white',
      padding: '15px 20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
      transition: 'all 0.3s ease'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '14px'
    },
    logoText: {
      fontSize: '26px',
      fontWeight: 'bold',
      margin: 0,
      letterSpacing: '0.5px',
      textShadow: '0 1px 2px rgba(0,0,0,0.15)',
      fontFamily: 'Quicksand, sans-serif'
    },
    searchBarContainer: {
      position: 'relative',
      marginBottom: '16px',
      transition: 'all 0.3s ease',
      transform: searchFocused ? 'scale(1.01)' : 'scale(1)'
    },
    searchBar: {
      width: '100%',
      padding: '10px 15px',
      paddingLeft: useEnhancedUI ? '40px' : '15px',
      borderRadius: '24px',
      border: 'none',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.1)',
      fontSize: '15px',
      marginBottom: '16px',
      transition: 'all 0.2s ease',
      outline: 'none',
      backgroundColor: useEnhancedUI ? 'rgba(255,255,255,0.95)' : 'white'
    },
    searchIcon: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: searchFocused ? '#2A5D3C' : '#999',
      transition: 'color 0.3s ease',
      pointerEvents: 'none'
    },
    filterContainer: {
      display: 'flex',
      overflowX: 'auto',
      gap: '8px',
      marginBottom: '14px',
      paddingBottom: '6px',
      WebkitOverflowScrolling: 'touch',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none' as 'none'
    },
    filterButton: {
      padding: '8px 16px',
      borderRadius: '20px',
      border: 'none',
      backgroundColor: 'white',
      color: '#444',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
      whiteSpace: 'nowrap',
      minWidth: '90px',
      fontFamily: 'Quicksand, sans-serif'
    },
    activeFilterButton: {
      backgroundColor: useEnhancedUI ? '#2A5D3C' : '#2A5D3C',
      color: 'white',
      boxShadow: '0 2px 5px rgba(42,93,60,0.4)'
    },
    navigationRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '4px',
      backgroundColor: '#f5f5f5',
      padding: '10px 20px',
      borderBottom: '1px solid #e0e0e0'
    },
    navGroup: {
      display: 'flex',
      gap: '8px'
    },
    notificationBadge: {
      display: 'inline-flex',
      backgroundColor: '#FF5252',
      color: 'white',
      fontWeight: 'bold',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: '2px',
      right: '2px',
      fontSize: '13px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    },
    contentContainer: {
      flexGrow: 1,
      position: 'relative',
      overflow: 'hidden'
    },
    uiToggle: {
      position: 'absolute',
      right: '10px',
      bottom: '10px',
      padding: '5px 10px',
      background: 'rgba(42,93,60,0.8)',
      color: 'white',
      fontSize: '12px',
      borderRadius: '4px',
      cursor: 'pointer',
      zIndex: 999,
      border: 'none',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }
  };

  // Function to handle input focus
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.1)';
    setSearchFocused(true);
  };

  // Function to handle input blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.1)';
    setSearchFocused(false);
  };

  // Render the active view component
  const renderActiveView = () => {
    if (activeView === 'map') {
      return (
        <MapView 
          producers={producers} 
          selectedCategory={selectedCategory}
          filterAvailability={filterAvailability}
        />
      );
    } else {
      if (useEnhancedUI) {
        return (
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <EnhancedListView 
              producers={producers}
              selectedCategory={selectedCategory}
              filterAvailability={filterAvailability}
            />
          </div>
        );
      } else {
        return (
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <ListView 
              producers={producers}
              selectedCategory={selectedCategory}
              filterAvailability={filterAvailability}
            />
          </div>
        );
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* Enhanced Header with depth and modern styling */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoContainer}>
            <h1 style={styles.logoText}>HelloNeighbor</h1>
            <span style={styles.notificationBadge}>3</span>
          </div>
          
          {useEnhancedUI ? (
            <div style={styles.searchBarContainer}>
              <Search style={styles.searchIcon} size={18} />
              <input 
                type="text" 
                placeholder="Search for ingredients, foods, neighbors..." 
                style={styles.searchBar}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          ) : (
            <input 
              type="text" 
              placeholder="Search for ingredients, foods, neighbors..." 
              style={styles.searchBar}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}
          
          <div style={styles.filterContainer}>
            <button 
              style={{
                ...styles.filterButton,
                ...(selectedCategory === 'all' ? styles.activeFilterButton : {})
              }}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            <button 
              style={{
                ...styles.filterButton,
                ...(selectedCategory === 'gardener' ? styles.activeFilterButton : {})
              }}
              onClick={() => setSelectedCategory('gardener')}
            >
              Produce
            </button>
            <button 
              style={{
                ...styles.filterButton,
                ...(selectedCategory === 'baker' ? styles.activeFilterButton : {})
              }}
              onClick={() => setSelectedCategory('baker')}
            >
              Baked
            </button>
            <button 
              style={{
                ...styles.filterButton,
                ...(selectedCategory === 'eggs' ? styles.activeFilterButton : {})
              }}
              onClick={() => setSelectedCategory('eggs')}
            >
              Eggs
            </button>
            <button 
              style={{
                ...styles.filterButton,
                ...(selectedCategory === 'homecook' ? styles.activeFilterButton : {})
              }}
              onClick={() => setSelectedCategory('homecook')}
            >
              Prepared
            </button>
            <button 
              style={{
                ...styles.filterButton,
                ...(selectedCategory === 'specialty' ? styles.activeFilterButton : {})
              }}
              onClick={() => setSelectedCategory('specialty')}
            >
              Specialty
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation Bar */}
      <div style={styles.navigationRow}>
        <div style={styles.navGroup}>
          <button 
            style={{
              ...styles.filterButton,
              ...(filterAvailability === 'now' ? styles.activeFilterButton : {})
            }}
            onClick={() => setFilterAvailability('now')}
          >
            Available Now
          </button>
          <button 
            style={{
              ...styles.filterButton,
              ...(filterAvailability === 'all' ? styles.activeFilterButton : {})
            }}
            onClick={() => setFilterAvailability('all')}
          >
            Show All
          </button>
        </div>
        
        <div style={styles.navGroup}>
          <button 
            style={{
              ...styles.filterButton,
              ...(activeView === 'map' ? styles.activeFilterButton : {})
            }}
            onClick={() => setActiveView('map')}
          >
            Map
          </button>
          <button 
            style={{
              ...styles.filterButton,
              ...(activeView === 'list' ? styles.activeFilterButton : {})
            }}
            onClick={() => setActiveView('list')}
          >
            List
          </button>
        </div>
      </div>
      
      {/* Content Container - conditionally renders Map or List view */}
      <div style={styles.contentContainer}>
        {renderActiveView()}
      </div>

      {/* Toggle button for switching between original and enhanced UI */}
      <button 
        style={styles.uiToggle}
        onClick={() => setUseEnhancedUI(!useEnhancedUI)}
      >
        {useEnhancedUI ? 'Classic UI' : 'Enhanced UI 2025'}
      </button>

      {/* Add a style tag for specific CSS that can't be done with inline styles */}
      <style dangerouslySetInnerHTML={{__html: `
  /* Hide scrollbars - fixed syntax */
  ::-webkit-scrollbar {
    display: none;
  }
  
  /* Custom scroll behavior */
  * {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  /* Input placeholder styling */
  ::placeholder {
    color: #999;
    opacity: 1;
  }
  
  /* Smooth transitions */
  button {
    transition: all 0.2s ease;
  }
  button:hover {
    transform: translateY(-1px);
  }
  button:active {
    transform: translateY(1px);
  }
  
  /* Primary color variable for tailwind */
  .bg-primary {
    background-color: #2A5D3C;
  }
  .text-primary {
    color: #2A5D3C;
  }
  .border-primary {
    border-color: #2A5D3C;
  }
  .ring-primary {
    --tw-ring-color: #2A5D3C;
  }

  /* Animation styles for enhanced UI */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  .animate-slideUp {
    animation: slideUp 0.3s ease-out forwards;
  }
  
  /* Hide scrollbars but maintain functionality */
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  /* Card animations */
  @keyframes heartbeat {
    0% { transform: scale(1); }
    25% { transform: scale(1.3); }
    50% { transform: scale(1); }
    75% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
  
  .animate-heartbeat {
    animation: heartbeat 0.5s ease;
  }
`}} />
    </div>
>>>>>>> Stashed changes
  );
}

export default App;