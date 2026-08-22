import { test, expect } from '@playwright/test';

const hasAdmin = Boolean(
  process.env.E2E_ADMIN_EMAIL && process.env.E2E_ADMIN_PASSWORD,
);
const hasViewer = Boolean(
  process.env.E2E_VIEWER_EMAIL && process.env.E2E_VIEWER_PASSWORD,
);

test('TC-003 / TC-009 ADMIN role is shown without Client write UI', async ({
  page,
}) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  await page.goto('/login');
  await page.getByTestId('login-email').fill(process.env.E2E_ADMIN_EMAIL!);
  await page
    .getByTestId('login-password')
    .fill(process.env.E2E_ADMIN_PASSWORD!);
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('user-role')).toHaveText('ADMIN');
  await expect(page.getByTestId('admin-write-hint')).toBeVisible();
});

test('TC-004 / TC-009 VIEWER is read-only on the shell', async ({ page }) => {
  test.skip(!hasViewer, 'E2E_VIEWER_EMAIL / E2E_VIEWER_PASSWORD not set');
  await page.goto('/login');
  await page.getByTestId('login-email').fill(process.env.E2E_VIEWER_EMAIL!);
  await page
    .getByTestId('login-password')
    .fill(process.env.E2E_VIEWER_PASSWORD!);
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('user-role')).toHaveText('VIEWER');
  await expect(page.getByTestId('viewer-read-hint')).toBeVisible();
  await expect(page.getByTestId('admin-write-hint')).toHaveCount(0);
});
