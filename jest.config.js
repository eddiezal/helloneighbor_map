// 2. Update jest.config.js to properly support ESM
// jest.config.js
/** @type {import('jest').Config} */
const config = {
    // The test environment that will be used for testing
    testEnvironment: 'jsdom',
    
    // The root directory that Jest should scan for tests and modules
    rootDir: '.',
    
    // A list of paths to directories that Jest should use to search for files in
    roots: ['<rootDir>/src'],
    
    // File extensions Jest looks for
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    
    // Transform files with ts-jest and babel-jest
    transform: {
      '^.+\\.(ts|tsx)$': [
        'ts-jest',
        {
          useESM: true,
          tsconfig: 'tsconfig.json',
        },
      ],
      '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.js' }]
    },
    
    // Indicates whether the coverage information should be collected
    collectCoverage: false,
    
    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',
    
    // Files to ignore for coverage
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/dist/'
    ],
    
    // Add setup files after env setup
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    
    // Mock CSS modules, image imports, etc.
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.js',
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
    
    // Indicates whether each individual test should be reported during the run
    verbose: true,
    
    // Support ES modules
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    
    // Use this configuration option to add custom reporters to Jest
    reporters: ['default'],
    
    // Threshold for test coverage results
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70
      }
    },
    
    // Tests will fail if there's a snapshot difference
    snapshotSerializers: [],
    
    // Silence specific warning messages
    transformIgnorePatterns: [
      'node_modules/(?!(@react-google-maps|lucide-react|react-router-dom)/)'
    ],
  };
  
  module.exports = config;