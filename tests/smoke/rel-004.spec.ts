import { expect, test } from '@playwright/test';
import { expectCrmAfterLogin, submitLoginFromRoot } from '../e2e/login';

function requireSecret(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Production smoke requires ${name}. Missing credentials is FAIL, not SKIPPED.`,
    );
  }
  return value;
}

/**
 * REL-004 production smoke for CRM-001. Fail-closed without secrets.
 * Does not invent search-match rules (C008). Does not write Clients.
 */
test.describe('REL-004 production smoke', () => {
  test('1 ADMIN sees Clients list and create', async ({ page }) => {
    const email = requireSecret('E2E_ADMIN_EMAIL');
    const password = requireSecret('E2E_ADMIN_PASSWORD');
    await submitLoginFromRoot(page, email, password);
    await expectCrmAfterLogin(page);
    await expect(page.getByTestId('nav-clients')).toBeVisible();
    await page.getByTestId('nav-clients').click();
    await expect(page.getByTestId('client-list')).toBeVisible();
    await expect(page.getByTestId('client-loading')).toHaveCount(0);
    await expect(page.getByTestId('client-error')).toHaveCount(0);
    await expect(page.getByTestId('client-create')).toBeVisible();
    await expect(page.getByTestId('admin-write-hint')).toBeVisible();
  });

  test('2 VIEWER sees Clients list without create', async ({ page }) => {
    const email = requireSecret('E2E_VIEWER_EMAIL');
    const password = requireSecret('E2E_VIEWER_PASSWORD');
    await submitLoginFromRoot(page, email, password);
    await expectCrmAfterLogin(page);
    await page.getByTestId('nav-clients').click();
    await expect(page.getByTestId('client-list')).toBeVisible();
    await expect(page.getByTestId('client-loading')).toHaveCount(0);
    await expect(page.getByTestId('client-error')).toHaveCount(0);
    await expect(page.getByTestId('client-create')).toHaveCount(0);
    await expect(page.getByTestId('admin-write-hint')).toHaveCount(0);
    await expect(page.getByTestId('viewer-read-hint')).toBeVisible();
  });
});
