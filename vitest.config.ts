import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Live `tests/integration` hits Supabase (auth + several CRUD/RLS round
 * trips). Vitest’s default testTimeout is 5000ms; CI latency has timed
 * out TC-C012/C013 while later cases in the same file still passed.
 * Assertions stay in the test file. Do not skip to “fix” timeouts.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: ['tests/unit/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'integration',
          environment: 'node',
          include: ['tests/integration/**/*.test.ts'],
          testTimeout: 20_000,
          hookTimeout: 20_000,
        },
      },
    ],
  },
});
