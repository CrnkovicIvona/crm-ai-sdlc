import { expect, test, type Page, type Route } from '@playwright/test';
import { expectCrmAfterLogin, expectLoginSurface, submitLogin } from './login';

const hasAdmin = Boolean(
  process.env.E2E_ADMIN_EMAIL && process.env.E2E_ADMIN_PASSWORD,
);
const hasViewer = Boolean(
  process.env.E2E_VIEWER_EMAIL && process.env.E2E_VIEWER_PASSWORD,
);

async function loginAdmin(page: Page): Promise<void> {
  await submitLogin(
    page,
    process.env.E2E_ADMIN_EMAIL!,
    process.env.E2E_ADMIN_PASSWORD!,
  );
  await expectCrmAfterLogin(page);
}

async function loginViewer(page: Page): Promise<void> {
  await submitLogin(
    page,
    process.env.E2E_VIEWER_EMAIL!,
    process.env.E2E_VIEWER_PASSWORD!,
  );
  await expectCrmAfterLogin(page);
}

async function expectNoDashboardWrites(page: Page): Promise<void> {
  await expect(page.getByTestId('client-create')).toHaveCount(0);
  await expect(page.getByTestId('client-save')).toHaveCount(0);
  await expect(page.getByTestId('client-delete')).toHaveCount(0);
  await expect(page.getByTestId('delete-dialog')).toHaveCount(0);
  await expect(page.getByTestId('client-form')).toHaveCount(0);
}

async function expectDashboardReady(page: Page): Promise<void> {
  await expect(page.getByTestId('dashboard-page')).toBeVisible();
  await expect(page.getByTestId('dashboard-loading')).toHaveCount(0);
  const error = page.getByTestId('dashboard-error');
  if (await error.isVisible()) {
    throw new Error(
      `DASH-001 schema/query failed (FAIL, not skip): ${await error.textContent()}`,
    );
  }
  await expect(page.getByTestId('kpi-active-value')).toBeVisible();
}

async function openDashboard(page: Page): Promise<void> {
  await page.getByTestId('nav-dashboard').click();
  await expect(page).toHaveURL(/\/app\/dashboard/);
  await expectDashboardReady(page);
}

async function readDashboardSurface(page: Page) {
  await expectDashboardReady(page);
  const kpiIds = [
    'kpi-active-value',
    'kpi-new-value',
    'kpi-churned-value',
    'kpi-churn-rate-value',
    'kpi-net-growth-value',
    'kpi-adoption-value',
  ] as const;
  const kpis: Record<string, string> = {};
  for (const id of kpiIds) {
    kpis[id] = (await page.getByTestId(id).innerText()).trim();
  }
  const productRows = await page
    .getByTestId('dashboard-product-row')
    .evaluateAll((rows) =>
      rows.map((row) => row.textContent?.replace(/\s+/g, ' ').trim() ?? ''),
    );
  return {
    last30Pressed: await page
      .getByTestId('dashboard-filter-30')
      .getAttribute('aria-pressed'),
    kpis,
    productRows,
    emptyProducts: await page.getByTestId('dashboard-empty-products').count(),
    chartTrendTitles: await page
      .locator('[data-testid="chart-trend"] title')
      .allTextContents(),
    chartNewChurnTitles: await page
      .locator('[data-testid="chart-new-vs-churned"] title')
      .allTextContents(),
    trendEmpty: await page.getByTestId('chart-trend-empty').count(),
    newChurnEmpty: await page.getByTestId('chart-new-vs-churned-empty').count(),
  };
}

function jsonList(route: Route, body: unknown, status = 200): Promise<void> {
  return route.fulfill({
    status,
    contentType: 'application/json',
    headers: { 'content-range': '0-0/0' },
    body: JSON.stringify(body),
  });
}

test('TC-D001-admin authenticated ADMIN can open the read-only dashboard', async ({
  page,
}) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  await loginAdmin(page);
  await openDashboard(page);
  await expectNoDashboardWrites(page);
});

test('TC-D001-viewer authenticated VIEWER can open the read-only dashboard', async ({
  page,
}) => {
  test.skip(!hasViewer, 'E2E_VIEWER_EMAIL / E2E_VIEWER_PASSWORD not set');
  await loginViewer(page);
  await openDashboard(page);
  await expectNoDashboardWrites(page);
});

test('TC-D002 unauthenticated dashboard is only login', async ({ page }) => {
  await page.goto('/app/dashboard');
  await expect(page).toHaveURL(/\/login/);
  await expectLoginSurface(page);
  await expect(page.getByTestId('dashboard-page')).toHaveCount(0);
  await expect(page.getByTestId('kpi-active-value')).toHaveCount(0);
});

test('TC-D009-ui default date filter is Last 30 days', async ({ page }) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  await loginAdmin(page);
  await openDashboard(page);
  await expect(page.getByTestId('dashboard-filter-30')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByTestId('dashboard-filter-30')).toHaveText(
    'Last 30 days',
  );
});

test('TC-D013-ui empty and error states do not show NaN', async ({ page }) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  await loginAdmin(page);
  await page.route('**/rest/v1/clients*', (route) => jsonList(route, []));
  await page.route('**/rest/v1/client_lifecycle_stamps*', (route) =>
    jsonList(route, []),
  );
  await page.route('**/rest/v1/products*', (route) => jsonList(route, []));
  await page.route('**/rest/v1/client_products*', (route) =>
    jsonList(route, []),
  );
  await page.getByTestId('nav-dashboard').click();
  await expect(page.getByTestId('dashboard-loading')).toHaveCount(0);
  await expect(page.getByTestId('kpi-active-value')).toHaveText('0');
  await expect(page.getByTestId('kpi-new-value')).toHaveText('0');
  await expect(page.getByTestId('kpi-churned-value')).toHaveText('0');
  await expect(page.getByTestId('kpi-churn-rate-value')).toHaveText('N/A');
  await expect(page.getByTestId('kpi-net-growth-value')).toHaveText('0');
  await expect(page.getByTestId('kpi-adoption-value')).toHaveText('N/A');
  await expect(page.getByTestId('dashboard-empty-products')).toBeVisible();
  await expect(page.locator('text=NaN')).toHaveCount(0);
  await expect(page.locator('text=Infinity')).toHaveCount(0);

  await page.unroute('**/rest/v1/clients*');
  await page.unroute('**/rest/v1/client_lifecycle_stamps*');
  await page.route('**/rest/v1/clients*', (route) =>
    jsonList(route, { message: 'schema missing' }, 400),
  );
  await page.route('**/rest/v1/client_lifecycle_stamps*', (route) =>
    jsonList(route, { message: 'schema missing' }, 400),
  );
  await page.getByTestId('dashboard-filter-7').click();
  await expect(page.getByTestId('dashboard-error')).toBeVisible();
  await expect(page.getByTestId('kpi-active-value')).toHaveCount(0);
});

test('TC-D014 missing dashboard schema or query FAILs, it is not skipped', async ({
  page,
}) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  await loginAdmin(page);
  await page.goto('/app/dashboard');
  await expect(page.getByTestId('dashboard-page')).toBeVisible();
  await expect(page.getByTestId('dashboard-loading')).toHaveCount(0);
  const error = page.getByTestId('dashboard-error');
  if (await error.isVisible()) {
    throw new Error(
      `DASH-001 schema/query failed (FAIL, not skip): ${await error.textContent()}`,
    );
  }
  await expect(page.getByTestId('kpi-active-value')).toBeVisible();
});

test('TC-D015-ui VIEWER dashboard matches ADMIN for Last 30 days', async ({
  browser,
}) => {
  test.skip(
    !hasAdmin || !hasViewer,
    'E2E_ADMIN_* and E2E_VIEWER_* required (skip ≠ pass)',
  );
  test.skip(
    process.env.TC_D015_REQUIRE_VIEW !== '1',
    'TC-D015-ui SKIPPED (not PASSED): needs stamps view (TC_D015_REQUIRE_VIEW=1). Hosted Preview still mismatches without apply-schema.',
  );
  const adminContext = await browser.newContext();
  const viewerContext = await browser.newContext();
  try {
    const adminPage = await adminContext.newPage();
    const viewerPage = await viewerContext.newPage();
    await loginAdmin(adminPage);
    await openDashboard(adminPage);
    const adminUi = await readDashboardSurface(adminPage);
    await loginViewer(viewerPage);
    await openDashboard(viewerPage);
    await expectNoDashboardWrites(viewerPage);
    const viewerUi = await readDashboardSurface(viewerPage);
    expect(viewerUi).toEqual(adminUi);
  } finally {
    await adminContext.close();
    await viewerContext.close();
  }
});
