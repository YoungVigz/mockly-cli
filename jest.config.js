module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    moduleNameMapper: {
      '^#ansi-styles$': '<rootDir>/node_modules/chalk/source/vendor/ansi-styles/index.js'
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
      '^.+\\.js$': 'babel-jest'
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(chalk)/)'
    ]
  };