import { expect, test, type APIRequestContext } from '@playwright/test';
import { GENERIC_AUTH_ERROR } from '../../src/lib/errors';
import { expectLoginAfterLogout } from '../e2e/login';

function requireSecret(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Production smoke requires ${name}. Missing credentials is FAIL, not SKIPPED.`,
    );
  }
  return value;
}

async function expectLoginSurface(
  page: import('@playwright/test').Page,
): Promise<void> {
  await expect(page.getByTestId('login-form')).toBeVisible();
  await expect(page.getByTestId('crm-shell')).toHaveCount(0);
}

/** REL-003 steps 2–4 use the SPA via `/` (HTTP 200). */
async function openLoginViaRoot(
  page: import('@playwright/test').Page,
): Promise<void> {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login/);
  await expectLoginSurface(page);
}

async function submitFromLoginForm(
  page: import('@playwright/test').Page,
  email: string,
  password: string,
): Promise<void> {
  await openLoginViaRoot(page);
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();
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

test.describe('REL-003 production smoke', () => {
  test('1 unauthenticated / shows login only', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
    await expectLoginSurface(page);
  });

  test('2 failed login shows only the generic auth error', async ({ page }) => {
    await submitFromLoginForm(page, 'nobody@example.com', 'wrong-password');
    await expect(page.getByTestId('login-error')).toHaveText(
      GENERIC_AUTH_ERROR,
    );
  });

  test('3 ADMIN login shows CRM shell then logout returns to login', async ({
    page,
  }) => {
    const email = requireSecret('E2E_ADMIN_EMAIL');
    const password = requireSecret('E2E_ADMIN_PASSWORD');
    await submitFromLoginForm(page, email, password);
    await expect(page.getByTestId('crm-shell')).toBeVisible();
    await expect(page.getByTestId('user-role')).toHaveText('ADMIN');
    await expect(page.getByTestId('admin-write-hint')).toBeVisible();
    await page.getByTestId('logout').click();
    await expectLoginAfterLogout(page);
    await expectLoginSurface(page);
  });

  test('4 VIEWER login shows CRM shell without write controls', async ({
    page,
  }) => {
    const email = requireSecret('E2E_VIEWER_EMAIL');
    const password = requireSecret('E2E_VIEWER_PASSWORD');
    await submitFromLoginForm(page, email, password);
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
