// jest.config.mjs
export default {
    // Use jsdom for testing React components
    testEnvironment: 'jsdom',
    
    // Set up the test environment
    setupFilesAfterEnv: ['./jest.setup.js'],
    
    // Transform files using babel-jest
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { rootMode: 'upward' }]
    },
    
    // Handle TypeScript files as ESM
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    
    // Important for handling module imports
    moduleNameMapper: {
      '\\.(css|less|scss)$': 'identity-obj-proxy',
      '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    
    // Only transform our source files and allow certain node_modules
    transformIgnorePatterns: [
      '/node_modules/(?!(.+mjs$|react-router|@babel/runtime))'
    ],
    
    // Specify test matching patterns
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
      '<rootDir>/src/**/*.{spec,test}.{ts,tsx}'
    ],
    
    // Make sure we can use ES modules in node
    testRunner: 'jest-circus/runner',
    
    // Provide more useful debugging
    verbose: true
  }