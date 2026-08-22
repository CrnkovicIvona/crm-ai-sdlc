import { defineConfig, devices } from '@playwright/test';

const hasAdmin = Boolean(
  process.env.E2E_ADMIN_EMAIL && process.env.E2E_ADMIN_PASSWORD,
);
const hasViewer = Boolean(
  process.env.E2E_VIEWER_EMAIL && process.env.E2E_VIEWER_PASSWORD,
);

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
    actionTimeout: 15_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5173',
    url: 'http://127.0.0.1:5173/login',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  metadata: { hasAdmin, hasViewer },
});
