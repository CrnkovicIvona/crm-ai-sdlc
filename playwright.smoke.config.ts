import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.SMOKE_BASE_URL?.replace(/\/$/, '');

if (!baseURL) {
  throw new Error(
    'SMOKE_BASE_URL is required for production smoke tests. Example: SMOKE_BASE_URL=https://crm-ai-sdlc.vercel.app npm run test:smoke',
  );
}

export default defineConfig({
  testDir: 'tests/smoke',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  timeout: 30_000,
  use: {
    baseURL,
    trace: 'on-first-retry',
    actionTimeout: 15_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
