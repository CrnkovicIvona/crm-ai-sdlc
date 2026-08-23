import { expect, type Page } from '@playwright/test';
import { GENERIC_AUTH_ERROR } from '../../src/lib/errors';

const OUTCOME_TIMEOUT_MS = 15_000;

export async function submitLogin(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto('/login');
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();
}

/** Wait until login succeeds into the CRM shell, or fail with a specific cause. */
export async function expectCrmAfterLogin(page: Page): Promise<void> {
  const shell = page.getByTestId('crm-shell');
  const denied = page.getByTestId('access-denied');
  const authError = page.getByTestId('login-error');
  await expect(shell.or(denied).or(authError)).toBeVisible({
    timeout: OUTCOME_TIMEOUT_MS,
  });
  if (await authError.isVisible()) {
    throw new Error(
      `Login returned ${GENERIC_AUTH_ERROR} Check E2E email/password and Email provider.`,
    );
  }
  if (await denied.isVisible()) {
    throw new Error(
      'Session exists but CRM is denied. Add public.profiles row with role ADMIN or VIEWER for this Auth user.',
    );
  }
  await expect(shell).toBeVisible();
  await expect(page).toHaveURL(/\/app/);
}

/**
 * Logout is async (Supabase signOut, then navigate). Playwright click does not
 * wait for that promise; default expect timeout is too short for CI.
 */
export async function expectLoginAfterLogout(page: Page): Promise<void> {
  await expect(page.getByTestId('login-form')).toBeVisible({
    timeout: OUTCOME_TIMEOUT_MS,
  });
  await expect(page).toHaveURL(/\/login/);
}
