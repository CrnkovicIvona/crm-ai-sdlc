import { expect, type Page } from '@playwright/test';

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
  const { shell, denied, authError } = await waitForLoginOutcome(page);
  if (await authError.isVisible()) {
    throw new Error(
      'Login returned Authentication failed. Check E2E email/password and Email provider.',
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

/** Wait until a session is denied CRM, or fail with a specific cause. */
export async function expectDeniedAfterLogin(page: Page): Promise<void> {
  const { shell, denied, authError } = await waitForLoginOutcome(page);
  if (await authError.isVisible()) {
    throw new Error(
      'Login returned Authentication failed. E2E_NOPROFILE_* must be a real Auth user with no usable ADMIN/VIEWER profile.',
    );
  }
  if (await shell.isVisible()) {
    throw new Error(
      'E2E_NOPROFILE user reached the CRM shell. That Auth user has a usable profile; remove the public.profiles row or use a different user.',
    );
  }
  await expect(denied).toBeVisible();
  await expect(shell).toHaveCount(0);
}

async function waitForLoginOutcome(page: Page): Promise<{
  shell: ReturnType<Page['getByTestId']>;
  denied: ReturnType<Page['getByTestId']>;
  authError: ReturnType<Page['getByTestId']>;
}> {
  const shell = page.getByTestId('crm-shell');
  const denied = page.getByTestId('access-denied');
  const authError = page.getByTestId('login-error');
  const loading = page.getByTestId('auth-loading');
  await expect(shell.or(denied).or(authError).or(loading)).toBeVisible({
    timeout: OUTCOME_TIMEOUT_MS,
  });
  if ((await loading.count()) > 0) {
    await expect(loading).toHaveCount(0, { timeout: OUTCOME_TIMEOUT_MS });
    await expect(shell.or(denied).or(authError)).toBeVisible({
      timeout: OUTCOME_TIMEOUT_MS,
    });
  }
  return { shell, denied, authError };
}
