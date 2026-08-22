import { test, expect } from '@playwright/test';

const hasAdmin = Boolean(
  process.env.E2E_ADMIN_EMAIL && process.env.E2E_ADMIN_PASSWORD,
);
const hasNoProfile = Boolean(
  process.env.E2E_NOPROFILE_EMAIL && process.env.E2E_NOPROFILE_PASSWORD,
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
});

test('TC-007 failed login is generic', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('login-email').fill('nobody@example.com');
  await page.getByTestId('login-password').fill('wrong-password');
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('login-error')).toHaveText(
    'Authentication failed.',
  );
});

test('TC-001 logged-in employee can open CRM', async ({ page }) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  await page.goto('/login');
  await page.getByTestId('login-email').fill(process.env.E2E_ADMIN_EMAIL!);
  await page
    .getByTestId('login-password')
    .fill(process.env.E2E_ADMIN_PASSWORD!);
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('crm-shell')).toBeVisible();
  await expect(page).toHaveURL(/\/app/);
});

test('TC-005 / TC-006 logout then CRM denied', async ({ page }) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  await page.goto('/login');
  await page.getByTestId('login-email').fill(process.env.E2E_ADMIN_EMAIL!);
  await page
    .getByTestId('login-password')
    .fill(process.env.E2E_ADMIN_PASSWORD!);
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('crm-shell')).toBeVisible();
  await page.getByTestId('logout').click();
  await expect(page).toHaveURL(/\/login/);
  await page.goto('/app');
  await expect(page).toHaveURL(/\/login/);
});

test('TC-010 session without profile is denied CRM', async ({ page }) => {
  test.skip(
    !hasNoProfile,
    'E2E_NOPROFILE_EMAIL / E2E_NOPROFILE_PASSWORD not set',
  );
  await page.goto('/login');
  await page.getByTestId('login-email').fill(process.env.E2E_NOPROFILE_EMAIL!);
  await page
    .getByTestId('login-password')
    .fill(process.env.E2E_NOPROFILE_PASSWORD!);
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('access-denied')).toBeVisible();
  await expect(page.getByTestId('crm-shell')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /provision/i })).toHaveCount(0);
});
