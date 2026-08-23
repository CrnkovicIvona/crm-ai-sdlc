import { expect, test, type APIRequestContext } from '@playwright/test';
import {
  expectGenericAuthError,
  expectLoginAfterLogout,
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

async function fetchEntryScript(
  request: APIRequestContext,
): Promise<{ url: string; body: string }> {
  const htmlResponse = await request.get('/');
  expect(htmlResponse.status()).toBe(200);
  const html = await htmlResponse.text();
  const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
  expect(
    match,
    'production index.html must reference /assets/index-*.js',
  ).toBeTruthy();
  const url = match![1];
  const jsResponse = await request.get(url);
  expect(jsResponse.status(), `GET ${url}`).toBe(200);
  return { url, body: await jsResponse.text() };
}

/**
 * REL-003 production smoke. Steps 1–4 overlap AUTH TCs on purpose: this suite
 * runs against SMOKE_BASE_URL and fails closed without secrets. Local e2e is
 * TC-named, skip-gated, and may hit Vite. Shared UI helpers: tests/e2e/login.ts.
 * Do not copy these journeys into a third file. Step 5 is smoke-only.
 */
test.describe('REL-003 production smoke', () => {
  test('1 unauthenticated / shows login only', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
    await expectLoginSurface(page);
  });

  test('2 failed login shows only the generic auth error', async ({ page }) => {
    await submitLoginFromRoot(page, 'nobody@example.com', 'wrong-password');
    await expectGenericAuthError(page);
  });

  test('3 ADMIN login shows CRM shell then logout returns to login', async ({
    page,
  }) => {
    const email = requireSecret('E2E_ADMIN_EMAIL');
    const password = requireSecret('E2E_ADMIN_PASSWORD');
    await submitLoginFromRoot(page, email, password);
    await expect(page.getByTestId('crm-shell')).toBeVisible();
    await expect(page.getByTestId('user-role')).toHaveText('ADMIN');
    await expect(page.getByTestId('admin-write-hint')).toBeVisible();
    await page.getByTestId('logout').click();
    await expectLoginAfterLogout(page);
  });

  test('4 VIEWER login shows CRM shell without write controls', async ({
    page,
  }) => {
    const email = requireSecret('E2E_VIEWER_EMAIL');
    const password = requireSecret('E2E_VIEWER_PASSWORD');
    await submitLoginFromRoot(page, email, password);
    await expect(page.getByTestId('crm-shell')).toBeVisible();
    await expect(page.getByTestId('user-role')).toHaveText('VIEWER');
    await expect(page.getByTestId('viewer-read-hint')).toBeVisible();
    await expect(page.getByTestId('admin-write-hint')).toHaveCount(0);
  });

  test('5 browser bundle does not embed the service role', async ({
    request,
  }) => {
    const { body } = await fetchEntryScript(request);
    expect(body.match(/service_role/g) ?? []).toHaveLength(0);
    expect(body.match(/SERVICE_ROLE/g) ?? []).toHaveLength(0);
    const secretLiteral = body.match(/sb_secret_[A-Za-z0-9]+/g) ?? [];
    expect(
      secretLiteral,
      'sb_secret_ must not appear as an embedded key; prefix detection in JS is allowed',
    ).toHaveLength(0);
  });
});
