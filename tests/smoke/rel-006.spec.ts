import { expect, test } from '@playwright/test';
import {
  expectCrmAfterLogin,
  expectLoginSurface,
  submitLoginFromRoot,
} from '../e2e/login';

function requireSecret(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Production smoke requires ${name}. Missing credentials is FAIL, not SKIPPED.`,
    );
  }
  return value;
}

async function expectDashboardReady(page: import('@playwright/test').Page) {
  await expect(page.getByTestId('nav-dashboard')).toBeVisible();
  await page.getByTestId('nav-dashboard').click();
  await expect(page).toHaveURL(/\/app\/dashboard/);
  await expect(page.getByTestId('dashboard-page')).toBeVisible();
  await expect(page.getByTestId('dashboard-loading')).toHaveCount(0);
  await expect(
    page.getByTestId('dashboard-error'),
    'dashboard schema/query missing is FAIL, not SKIPPED',
  ).toHaveCount(0);
  await expect(page.getByTestId('kpi-active-value')).toBeVisible();
  await expect(page.getByTestId('client-create')).toHaveCount(0);
  await expect(page.getByTestId('client-save')).toHaveCount(0);
}

/**
 * REL-006 production smoke for DASH-001. Fail-closed without secrets.
 * Smallest post-deploy: unauthenticated cannot see KPIs; ADMIN and
 * VIEWER can open the read-only dashboard.
 */
test.describe('REL-006 production smoke', () => {
  test('1 unauthenticated dashboard is only login', async ({ page }) => {
    await page.goto('/app/dashboard');
    await expect(page).toHaveURL(/\/login/);
    await expectLoginSurface(page);
    await expect(page.getByTestId('dashboard-page')).toHaveCount(0);
    await expect(page.getByTestId('kpi-active-value')).toHaveCount(0);
  });

  test('2 ADMIN opens read-only dashboard', async ({ page }) => {
    const email = requireSecret('E2E_ADMIN_EMAIL');
    const password = requireSecret('E2E_ADMIN_PASSWORD');
    await submitLoginFromRoot(page, email, password);
    await expectCrmAfterLogin(page);
    await expectDashboardReady(page);
  });

  test('3 VIEWER opens read-only dashboard', async ({ page }) => {
    const email = requireSecret('E2E_VIEWER_EMAIL');
    const password = requireSecret('E2E_VIEWER_PASSWORD');
    await submitLoginFromRoot(page, email, password);
    await expectCrmAfterLogin(page);
    await expectDashboardReady(page);
    await expect(page.getByTestId('viewer-read-hint')).toBeVisible();
  });
});
