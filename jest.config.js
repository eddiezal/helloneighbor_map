// jest.config.js
export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    
    transform: {
      '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest'
    },
    
    moduleNameMapper: {
      '\\.(css|less|scss)$': 'identity-obj-proxy',
      '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    
    // Update test patterns to match your files correctly
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
      '<rootDir>/src/**/*.{spec,test}.{ts,tsx}'
    ],
    
    verbose: true
  };