import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Live `tests/integration` hits Supabase (auth + several CRUD/RLS round
 * trips). Vitest’s default testTimeout is 5000ms; CI latency and Auth
 * 504 retries have exceeded 20s on TC-C012–C019. Keep every expect.
 * Do not skip to “fix” timeouts.
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
          testTimeout: 45_000,
          hookTimeout: 45_000,
        },
      },
    ],
  },
});
