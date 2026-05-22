import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use jsdom to simulate a browser DOM environment for all tests
    environment: 'jsdom',

    // Include all test files across the three test layers
    include: [
      'tests/unit/**/*.test.js',
      'tests/property/**/*.property.test.js',
      'tests/smoke/**/*.test.js',
    ],

    // Minimum 100 iterations for property-based tests (fast-check default is 100)
    // fast-check numRuns can be configured per-test; this is a reminder comment.

    // Global test timeout (ms)
    testTimeout: 30000,
  },
});
