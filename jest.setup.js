// jest.setup.js
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  disconnect() {
    return null;
  }
  observe() {
    return null;
  }
  takeRecords() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  disconnect() {
    return null;
  }
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock the Google Maps API
global.google = {
  maps: {
    Marker: class {
      setMap() {}
    },
    Map: class {
      setCenter() {}
      setZoom() {}
    },
    LatLng: class {},
    SymbolPath: {
      CIRCLE: 0
    },
    InfoWindow: class {
      setContent() {}
      open() {}
      close() {}
    },
    event: {
      addListener: () => {},
    }
  }
};

// Mock window.HelloNeighbor for map interactions
global.window.HelloNeighbor = {
  selectProducer: jest.fn()
};

// Suppress specific console errors
const originalError = console.error;
console.error = (...args) => {
  // Suppress React 18+ act() warnings and other specific warnings
  if (
    /Warning.*not wrapped in act/.test(args[0]) ||
    /Warning.*ReactDOM.render is no longer supported/.test(args[0]) ||
    /Warning.*React.createFactory/.test(args[0])
  ) {
    return;
  }
  originalError(...args);
};