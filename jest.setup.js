// jest.setup.js
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock browser APIs not available in jsdom
global.IntersectionObserver = class IntersectionObserver {
  constructor() {
    this.root = null;
    this.rootMargin = '';
    this.thresholds = [];
    this.disconnect = jest.fn();
    this.observe = jest.fn();
    this.takeRecords = jest.fn();
    this.unobserve = jest.fn();
  }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Google Maps API
window.google = {
  maps: {
    Map: class Map {
      constructor() {}
      setCenter() {}
      setZoom() {}
    },
    Marker: class Marker {
      constructor() {}
      setMap() {}
      addListener() { return { remove: jest.fn() }; }
    },
    LatLng: class LatLng {
      constructor(lat, lng) {
        this.lat = lat;
        this.lng = lng;
      }
      lat() { return this.lat; }
      lng() { return this.lng; }
    },
    InfoWindow: class InfoWindow {
      constructor() {}
      setContent() {}
      open() {}
      close() {}
    },
    event: {
      addListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
      removeListener: jest.fn()
    },
    SymbolPath: {
      CIRCLE: 0
    }
  }
};

// Mock for HelloNeighbor global object
window.HelloNeighbor = {
  selectProducer: jest.fn()
};

// Mock for ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }
};