import { test, expect } from '@playwright/test';
import {
  expectCrmAfterLogin,
  expectGenericAuthError,
  expectLoginAfterLogout,
  expectLoginSurface,
  submitLogin,
} from './login';

const hasAdmin = Boolean(
  process.env.E2E_ADMIN_EMAIL && process.env.E2E_ADMIN_PASSWORD,
);

test('TC-002 / TC-008 unauthenticated CRM is only login', async ({ page }) => {
  await page.goto('/app');
  await expect(page).toHaveURL(/\/login/);
  await expectLoginSurface(page);
});

test('TC-008 unauthenticated root goes to login', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login/);
  await expectLoginSurface(page);
  await expect(page.getByTestId('test-users')).toBeVisible();
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

test('TC-007 failed login is generic', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('login-email').fill('nobody@example.com');
  await page.getByTestId('login-password').fill('wrong-password');
  await page.getByTestId('login-submit').click();
  await expectGenericAuthError(page);
});

test('TC-001 logged-in employee can open CRM', async ({ page }) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  await submitLogin(
    page,
    process.env.E2E_ADMIN_EMAIL!,
    process.env.E2E_ADMIN_PASSWORD!,
  );
  await expectCrmAfterLogin(page);
});

test('TC-005 / TC-006 logout then CRM denied', async ({ page }) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  await submitLogin(
    page,
    process.env.E2E_ADMIN_EMAIL!,
    process.env.E2E_ADMIN_PASSWORD!,
  );
  await expectCrmAfterLogin(page);
  await page.getByTestId('logout').click();
  await expectLoginAfterLogout(page);
  await page.goto('/app');
  await expect(page).toHaveURL(/\/login/);
  await expectLoginSurface(page);
});
