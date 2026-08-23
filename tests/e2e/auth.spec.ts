import { test, expect } from '@playwright/test';
import { GENERIC_AUTH_ERROR } from '../../src/lib/errors';
import {
  expectCrmAfterLogin,
  expectLoginAfterLogout,
  submitLogin,
} from './login';

const hasAdmin = Boolean(
  process.env.E2E_ADMIN_EMAIL && process.env.E2E_ADMIN_PASSWORD,
);

test('TC-002 / TC-008 unauthenticated CRM is only login', async ({ page }) => {
  await page.goto('/app');
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByTestId('login-form')).toBeVisible();
  await expect(page.getByTestId('crm-shell')).toHaveCount(0);
});

test('TC-008 unauthenticated root goes to login', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByTestId('login-form')).toBeVisible();
  await expect(page.getByTestId('test-users')).toBeVisible();
  await expect(page.getByTestId('test-users')).toContainText('admin@test.com');
  await expect(page.getByTestId('test-users')).toContainText('viewer@test.com');
});

test('TC-007 failed login is generic', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('login-email').fill('nobody@example.com');
  await page.getByTestId('login-password').fill('wrong-password');
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('login-error')).toHaveText(GENERIC_AUTH_ERROR);
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
  await expect(page.getByTestId('login-form')).toBeVisible();
});
