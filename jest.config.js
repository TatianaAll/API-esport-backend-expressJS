module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'models/**/*.js',
    'middleware/**/*.js',
    'controller/**/*.js',
    '!**/node_modules/**',
  ],
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
};
