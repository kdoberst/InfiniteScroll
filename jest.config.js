module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['<rootDir>/src/**/*.test.(ts|tsx)'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(svg|png|jpe?g|gif|webp|avif)$': '<rootDir>/__mocks__/fileMock.js',
    '^@patternfly/chatbot$': '<rootDir>/__mocks__/patternflyChatbotMock.js',
  },
  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],
  // Specify which files should be included in coverage reports
  collectCoverageFrom: [
    // Include all TypeScript files in src directory
    'src/**/*.{ts,tsx}',
    // Exclude test files from coverage
    '!src/**/*.test.{ts,tsx}',
    // Exclude test setup file
    '!src/setupTests.ts',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/.*fixtures.*',
    '<rootDir>/src/.*mock.*',
    '<rootDir>/src/.*index.*',
    '<rootDir>/src/.*stories.*',
    '<rootDir>/src/.*styles.*',
    '<rootDir>/src/.*types.*',
    '<rootDir>/src/.*constants.*',
    '<rootDir>/src/services/apiRequest.*',
  ],
  coverageDirectory: 'unitTestCoverage',
  coverageReporters: ['html', 'json-summary', 'text-summary'],
};
