// jest.setup.js
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

// Now jest.fn() will be available
// Mock browser APIs not available in jsdom
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}

window.IntersectionObserver = MockIntersectionObserver;

// Mock for window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Other mocks...
// Mock for Google Maps
window.google = {
  maps: {
    Map: class MockMap {
      constructor() {}
      setCenter() {}
      setZoom() {}
    },
    Marker: class MockMarker {
      constructor() {}
      setMap() {}
    },
    LatLng: class MockLatLng {
      constructor(lat, lng) {
        this.lat = lat;
        this.lng = lng;
      }
      lat() { return this.lat; }
      lng() { return this.lng; }
    },
    event: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    },
    SymbolPath: {
      CIRCLE: 0
    }
  }
};