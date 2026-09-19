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

const KPI_IDS = [
  'kpi-active-value',
  'kpi-new-value',
  'kpi-churned-value',
  'kpi-churn-rate-value',
  'kpi-net-growth-value',
  'kpi-adoption-value',
] as const;

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
  await expect(page.getByTestId('dashboard-filter-30')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByTestId('client-create')).toHaveCount(0);
  await expect(page.getByTestId('client-save')).toHaveCount(0);
}

async function readLast30Kpis(page: import('@playwright/test').Page) {
  await expectDashboardReady(page);
  const kpis: Record<string, string> = {};
  for (const id of KPI_IDS) {
    kpis[id] = (await page.getByTestId(id).innerText()).trim();
  }
  return kpis;
}

/**
 * REL-007 production smoke: BUG-004 stamp parity and AUTH-B001 login
 * spacing. Fail-closed without secrets. Do not skip TC-D015 on
 * Production — missing view or KPI mismatch is FAIL.
 */
test.describe('REL-007 production smoke', () => {
  test('1 login test-user blocks have vertical space', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
    await expectLoginSurface(page);
    await expect(page.getByTestId('test-users-admin')).toContainText(
      'admin@test.com',
    );
    await expect(page.getByTestId('test-users-viewer')).toContainText(
      'viewer@test.com',
    );
    await expect(page.getByTestId('test-users-note')).toHaveCSS(
      'font-style',
      'italic',
    );
    const adminBox = await page.getByTestId('test-users-admin').boundingBox();
    const viewerBox = await page.getByTestId('test-users-viewer').boundingBox();
    const noteBox = await page.getByTestId('test-users-note').boundingBox();
    expect(adminBox).toBeTruthy();
    expect(viewerBox).toBeTruthy();
    expect(noteBox).toBeTruthy();
    expect(viewerBox!.y).toBeGreaterThan(adminBox!.y + adminBox!.height + 8);
    expect(noteBox!.y).toBeGreaterThan(viewerBox!.y + viewerBox!.height + 8);
  });

  test('2 unauthenticated dashboard is only login', async ({ page }) => {
    await page.goto('/app/dashboard');
    await expect(page).toHaveURL(/\/login/);
    await expectLoginSurface(page);
    await expect(page.getByTestId('dashboard-page')).toHaveCount(0);
    await expect(page.getByTestId('kpi-active-value')).toHaveCount(0);
  });

  test('3 ADMIN Last 30 KPIs load without schema error', async ({ page }) => {
    const email = requireSecret('E2E_ADMIN_EMAIL');
    const password = requireSecret('E2E_ADMIN_PASSWORD');
    await submitLoginFromRoot(page, email, password);
    await expectCrmAfterLogin(page);
    await expectDashboardReady(page);
  });

  test('4 VIEWER Last 30 KPIs match ADMIN', async ({ browser }) => {
    test.setTimeout(60_000);
    const adminEmail = requireSecret('E2E_ADMIN_EMAIL');
    const adminPassword = requireSecret('E2E_ADMIN_PASSWORD');
    const viewerEmail = requireSecret('E2E_VIEWER_EMAIL');
    const viewerPassword = requireSecret('E2E_VIEWER_PASSWORD');
    const adminContext = await browser.newContext();
    const viewerContext = await browser.newContext();
    try {
      const adminPage = await adminContext.newPage();
      const viewerPage = await viewerContext.newPage();
      await submitLoginFromRoot(adminPage, adminEmail, adminPassword);
      await expectCrmAfterLogin(adminPage);
      const adminKpis = await readLast30Kpis(adminPage);
      await submitLoginFromRoot(viewerPage, viewerEmail, viewerPassword);
      await expectCrmAfterLogin(viewerPage);
      await expect(viewerPage.getByTestId('viewer-read-hint')).toBeVisible();
      const viewerKpis = await readLast30Kpis(viewerPage);
      expect(viewerKpis).toEqual(adminKpis);
    } finally {
      await adminContext.close();
      await viewerContext.close();
    }
  });
});
