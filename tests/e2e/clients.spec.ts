import { expect, test, type Page } from '@playwright/test';
import {
  expectCrmAfterLogin,
  expectLoginAfterLogout,
  submitLogin,
} from './login';

const hasAdmin = Boolean(
  process.env.E2E_ADMIN_EMAIL && process.env.E2E_ADMIN_PASSWORD,
);
const hasViewer = Boolean(
  process.env.E2E_VIEWER_EMAIL && process.env.E2E_VIEWER_PASSWORD,
);

async function expectClientsSchemaReady(page: Page): Promise<void> {
  await expect(page.getByTestId('client-list')).toBeVisible();
  await expect(page.getByTestId('client-loading')).toHaveCount(0);
  await expect(
    page.getByTestId('client-error'),
    'clients schema must be on non-prod (apply 20260823190000 then 20260823210000). Missing schema is FAIL, not SKIPPED.',
  ).toHaveCount(0);
}

function uniquePayload() {
  const stamp = `${Date.now()}${Math.floor(Math.random() * 1_000_000)}`.slice(
    -11,
  );
  return {
    first_name: 'Crmone',
    last_name: `E2e${stamp.slice(0, 8)}`,
    email: `crm001.e2e.${stamp}@bank.example`,
    phone: '+385 91 123 4567',
    oib: stamp.padStart(11, '0').slice(0, 11),
  };
}

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

async function openClients(page: Page): Promise<void> {
  await page.getByTestId('nav-clients').click();
  await expectClientsSchemaReady(page);
}

async function fillClientForm(
  page: Page,
  payload: ReturnType<typeof uniquePayload>,
): Promise<void> {
  await page.getByTestId('client-first-name').fill(payload.first_name);
  await page.getByTestId('client-last-name').fill(payload.last_name);
  await page.getByTestId('client-email').fill(payload.email);
  await page.getByTestId('client-phone').fill(payload.phone);
  await page.getByTestId('client-oib').fill(payload.oib);
}

async function createClientAsAdmin(
  page: Page,
  payload: ReturnType<typeof uniquePayload>,
  assignBankAccount: boolean,
): Promise<string> {
  await openClients(page);
  await page.getByTestId('client-create').click();
  await expect(page.getByTestId('product-bank_account')).toBeVisible({
    timeout: 15_000,
  });
  await fillClientForm(page, payload);
  if (assignBankAccount) {
    await page.getByTestId('product-bank_account').check();
  }
  await page.getByTestId('client-save').click();
  await expect(page.getByTestId('client-success')).toHaveText(
    'Client created.',
  );
  const id = page.url().match(/\/app\/clients\/([^/?#]+)/)?.[1];
  expect(id, 'create must land on /app/clients/:id').toBeTruthy();
  // After navigate, success comes from location.state before getClient
  // hydrates the controlled inputs. Wait for the edit form or Save
  // submits empty values and never shows "Client saved."
  await expect(page.getByTestId('client-first-name')).toHaveValue(
    payload.first_name,
  );
  await expect(page.getByTestId('client-created-at')).toBeVisible();
  await expect(page.getByTestId('client-save')).toBeEnabled();
  return id!;
}

test('TC-C001 CRM-001 exposes only Clients', async ({ page }) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  await loginAdmin(page);
  await expect(page.getByTestId('nav-clients')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Clients' })).toHaveCount(1);
  await expect(
    page.getByRole('link', { name: /Account|Deal|Contact/i }),
  ).toHaveCount(0);
});

test('TC-C003 ADMIN can read Clients', async ({ page }) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  await loginAdmin(page);
  await openClients(page);
  await expect(page.getByTestId('client-list')).toBeVisible();
});

test('TC-C004 ADMIN can create a Client', async ({ page }) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  const payload = uniquePayload();
  await loginAdmin(page);
  await createClientAsAdmin(page, payload, false);
  await expect(page.getByTestId('client-first-name')).toHaveValue(
    payload.first_name,
  );
  await expect(page.getByTestId('client-created-at')).toBeVisible();
});

test('TC-C021 ADMIN may assign a catalog product on create', async ({
  page,
}) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  const payload = uniquePayload();
  await loginAdmin(page);
  await createClientAsAdmin(page, payload, true);
  await expect(page.getByTestId('product-bank_account')).toBeChecked();
});

test('TC-C005 ADMIN can update a Client', async ({ page }) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  const payload = uniquePayload();
  await loginAdmin(page);
  await createClientAsAdmin(page, payload, false);
  await page.getByTestId('client-first-name').fill('Updated');
  await expect(page.getByTestId('client-first-name')).toHaveValue('Updated');
  await page.getByTestId('client-save').click();
  await expect(page.getByTestId('client-success')).toHaveText('Client saved.', {
    timeout: 15_000,
  });
  await expect(page.getByTestId('client-first-name')).toHaveValue('Updated');
});

test('TC-C006 ADMIN delete confirm and cancel', async ({ page }) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  const payload = uniquePayload();
  await loginAdmin(page);
  await createClientAsAdmin(page, payload, false);
  await page.getByTestId('client-delete').click();
  await page.getByTestId('delete-cancel').click();
  await expect(page.getByTestId('client-first-name')).toHaveValue(
    payload.first_name,
  );
  await page.getByTestId('client-delete').click();
  await page.getByTestId('delete-confirm').click();
  await expect(page.getByTestId('client-success')).toHaveText(
    'Client deleted.',
  );
});

test('TC-C022 soft-deleted Client is hidden from search', async ({ page }) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  const payload = uniquePayload();
  await loginAdmin(page);
  await createClientAsAdmin(page, payload, false);
  await page.getByTestId('client-delete').click();
  await page.getByTestId('delete-confirm').click();
  await expect(page.getByTestId('client-success')).toHaveText(
    'Client deleted.',
  );
  await page.getByTestId('client-search').fill(payload.email);
  await expect(page).toHaveURL(/q=/);
  await expect(page.getByTestId('client-loading')).toHaveCount(0);
  await expect(page.getByTestId('client-empty')).toHaveText(
    'No matching clients.',
  );
});

test('TC-C002 / TC-C004 invalid fields are named', async ({ page }) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  await loginAdmin(page);
  await openClients(page);
  await page.getByTestId('client-create').click();
  await page.getByTestId('client-save').click();
  await expect(page.getByTestId('field-error-first_name')).toHaveText(
    'Enter a first name.',
  );
  await expect(page.getByTestId('field-error-last_name')).toHaveText(
    'Enter a last name.',
  );
  await expect(page.getByTestId('field-error-email')).toHaveText(
    'Enter an email like name@bank.example.',
  );
  await expect(page.getByTestId('field-error-phone')).toHaveText(
    'Enter a phone with 8–15 digits.',
  );
  await expect(page.getByTestId('field-error-oib')).toHaveText(
    'Enter an 11-digit OIB.',
  );
});

test('TC-C007 VIEWER can read Clients', async ({ page }) => {
  test.skip(!hasViewer, 'E2E_VIEWER_EMAIL / E2E_VIEWER_PASSWORD not set');
  await loginViewer(page);
  await openClients(page);
  await expect(page.getByTestId('client-list')).toBeVisible();
});

test('TC-C008 VIEWER search UI (match rule BLOCKED)', async ({ page }) => {
  test.skip(!hasViewer, 'E2E_VIEWER_EMAIL / E2E_VIEWER_PASSWORD not set');
  await loginViewer(page);
  await openClients(page);
  await expect(page.getByTestId('client-search')).toBeVisible();
  await page.getByTestId('client-search').fill('zzzz-no-such-client');
  await expect(page).toHaveURL(/q=/);
  await expect(page.getByTestId('client-loading')).toHaveCount(0);
});

test('TC-C009 VIEWER cannot create a Client', async ({ page }) => {
  test.skip(!hasViewer, 'E2E_VIEWER_EMAIL / E2E_VIEWER_PASSWORD not set');
  await loginViewer(page);
  await openClients(page);
  await expect(page.getByTestId('client-create')).toHaveCount(0);
  await page.goto('/app/clients/new');
  await expect(page).toHaveURL(/\/app\/clients$/);
  await expect(page.getByTestId('client-form')).toHaveCount(0);
});

test('TC-C010 VIEWER cannot update or delete', async ({ page }) => {
  test.skip(!hasAdmin || !hasViewer, 'E2E_ADMIN_* and E2E_VIEWER_* required');
  const payload = uniquePayload();
  await loginAdmin(page);
  const id = await createClientAsAdmin(page, payload, false);
  await page.getByTestId('logout').click();
  await expectLoginAfterLogout(page);
  await loginViewer(page);
  await page.goto(`/app/clients/${id}`);
  await expect(page.getByTestId('client-detail')).toBeVisible();
  await expect(page.getByTestId('client-save')).toHaveCount(0);
  await expect(page.getByTestId('client-delete')).toHaveCount(0);
  await expect(page.getByTestId('client-form')).toHaveCount(0);
});

test('TC-C011 VIEWER sees all approved Client fields', async ({ page }) => {
  test.skip(!hasAdmin || !hasViewer, 'E2E_ADMIN_* and E2E_VIEWER_* required');
  const payload = uniquePayload();
  await loginAdmin(page);
  const id = await createClientAsAdmin(page, payload, false);
  await page.getByTestId('logout').click();
  await expectLoginAfterLogout(page);
  await loginViewer(page);
  await page.goto(`/app/clients/${id}`);
  await expect(page.getByTestId('client-detail')).toBeVisible();
  await expect(page.getByTestId('client-first-name')).toHaveText(
    payload.first_name,
  );
  await expect(page.getByTestId('client-last-name')).toHaveText(
    payload.last_name,
  );
  await expect(page.getByTestId('client-email')).toHaveText(payload.email);
  await expect(page.getByTestId('client-phone')).toHaveText(payload.phone);
  await expect(page.getByTestId('client-oib')).toHaveText(payload.oib);
  await expect(page.getByTestId('client-created-at')).toBeVisible();
  await expect(page.getByTestId('client-products')).toBeVisible();
});
