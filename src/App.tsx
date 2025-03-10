import { useState, useEffect } from 'react';
import MapView from './components/Map/MapView';
import { producers } from './data/mockProducers';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('now');
  const [activeView, setActiveView] = useState('map');


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
  // Load Material Icons
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);


  // Enhanced style objects with modern touches
  const styles = {
    container: {
      height: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      background: 'linear-gradient(to right, #2A5D3C, #3A6A4B)',
      color: 'white',
      padding: '15px 20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
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
    logoIcon: {
      fontSize: '28px',
      marginRight: '10px',
      filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))'
    },
    logoText: {
      fontSize: '26px',
      fontWeight: 'bold',
      margin: 0,
      letterSpacing: '0.5px',
      textShadow: '0 1px 2px rgba(0,0,0,0.15)',
      fontFamily: 'Quicksand, sans-serif'
    },
    searchBar: {
      width: '100%',
      padding: '10px 15px',
      borderRadius: '24px',
      border: 'none',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.1)',
      fontSize: '15px',
      marginBottom: '16px',
      transition: 'all 0.2s ease',
      outline: 'none'
    },
    filterContainer: {
      display: 'flex',
      overflowX: 'auto',
      gap: '8px',
      marginBottom: '14px',
      paddingBottom: '6px',
      WebkitOverflowScrolling: 'touch',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none'
    },
    filterButton: {
      padding: '8px 14px',
      borderRadius: '20px',
      border: 'none',
      backgroundColor: 'white',
      color: '#444',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
      whiteSpace: 'nowrap'
    },
    activeFilterButton: {
      backgroundColor: '#2A5D3C',
      color: 'white',
      boxShadow: '0 2px 5px rgba(42,93,60,0.4)'
    },
    icon: {
      marginRight: '6px',
      fontSize: '16px'
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
    mapContainer: {
      flexGrow: 1,
      position: 'relative'
    },
    hiddenScrollbar: {
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    }
  };

  // Function to handle input focus
  const handleFocus = (e) => {
    e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.1)';
  };

  // Function to handle input blur
  const handleBlur = (e) => {
    e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.1)';
  };

  return (
    <div style={styles.container}>
      {/* Enhanced Header with depth and modern styling */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoContainer}>
            <span style={styles.logoIcon}>🏡</span>
            <h1 style={styles.logoText}>HelloNeighbor</h1>
            <span style={styles.notificationBadge}>3</span>
          </div>
          
          <input 
            type="text" 
            placeholder="Search for ingredients, foods, neighbors..." 
            style={styles.searchBar}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          
          <div style={{...styles.filterContainer, ...styles.hiddenScrollbar}}>
            <button 
              style={{
                ...styles.filterButton,
                ...(selectedCategory === 'all' ? styles.activeFilterButton : {})
              }}
              onClick={() => setSelectedCategory('all')}
            >
              <span style={styles.icon}>🏠</span>All
            </button>
            <button 
              style={{
                ...styles.filterButton,
                ...(selectedCategory === 'gardener' ? styles.activeFilterButton : {})
              }}
              onClick={() => setSelectedCategory('gardener')}
            >
              <span style={styles.icon}>🥬</span>Produce
            </button>
            <button 
              style={{
                ...styles.filterButton,
                ...(selectedCategory === 'baker' ? styles.activeFilterButton : {})
              }}
              onClick={() => setSelectedCategory('baker')}
            >
              <span style={styles.icon}>🍞</span>Baked
            </button>
            <button 
              style={{
                ...styles.filterButton,
                ...(selectedCategory === 'eggs' ? styles.activeFilterButton : {})
              }}
              onClick={() => setSelectedCategory('eggs')}
            >
              <span style={styles.icon}>🥚</span>Eggs
            </button>
            <button 
              style={{
                ...styles.filterButton,
                ...(selectedCategory === 'homecook' ? styles.activeFilterButton : {})
              }}
              onClick={() => setSelectedCategory('homecook')}
            >
              <span style={styles.icon}>🍲</span>Prepared
            </button>
            <button 
              style={{
                ...styles.filterButton,
                ...(selectedCategory === 'specialty' ? styles.activeFilterButton : {})
              }}
              onClick={() => setSelectedCategory('specialty')}
            >
              <span style={styles.icon}>✨</span>Specialty
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
      
      {/* Map Component */}
      <div style={styles.mapContainer}>
        <MapView 
          producers={producers} 
          selectedCategory={selectedCategory}
          filterAvailability={filterAvailability}
        />
      </div>

      {/* Add a style tag for specific CSS that can't be done with inline styles */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Hide scrollbars */
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
      `}} />
    </div>
  );
}

export default App;
