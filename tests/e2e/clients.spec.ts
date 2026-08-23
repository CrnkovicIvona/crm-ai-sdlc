import { expect, test, type Page } from '@playwright/test';
import { expectCrmAfterLogin, submitLogin } from './login';

const hasAdmin = Boolean(
  process.env.E2E_ADMIN_EMAIL && process.env.E2E_ADMIN_PASSWORD,
);
const hasViewer = Boolean(
  process.env.E2E_VIEWER_EMAIL && process.env.E2E_VIEWER_PASSWORD,
);

async function expectClientsSchemaReady(page: Page): Promise<void> {
  await expect(page.getByTestId('client-list')).toBeVisible();
  await expect(page.getByTestId('client-loading')).toHaveCount(0);
  if (await page.getByTestId('client-error').isVisible()) {
    test.skip(
      true,
      'clients table is not available (apply 20260823190000_clients_and_audit.sql then 20260823210000_products_and_soft_delete.sql to non-prod). SKIPPED ≠ PASSED',
    );
  }
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

test('TC-C001 CRM-001 exposes only Clients', async ({ page }) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  await submitLogin(
    page,
    process.env.E2E_ADMIN_EMAIL!,
    process.env.E2E_ADMIN_PASSWORD!,
  );
  await expectCrmAfterLogin(page);
  await expect(page.getByTestId('nav-clients')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Clients' })).toHaveCount(1);
  await expect(
    page.getByRole('link', { name: /Account|Deal|Contact/i }),
  ).toHaveCount(0);
});

test('TC-C003–C006 ADMIN can create, read, update, delete a Client', async ({
  page,
}) => {
  test.skip(!hasAdmin, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set');
  const payload = uniquePayload();
  await submitLogin(
    page,
    process.env.E2E_ADMIN_EMAIL!,
    process.env.E2E_ADMIN_PASSWORD!,
  );
  await expectCrmAfterLogin(page);
  await page.getByTestId('nav-clients').click();
  await expectClientsSchemaReady(page);
  await page.getByTestId('client-create').click();
  if ((await page.getByTestId('product-bank_account').count()) === 0) {
    test.skip(
      true,
      'products catalog is not available (apply 20260823210000_products_and_soft_delete.sql to non-prod). SKIPPED ≠ PASSED',
    );
  }
  await page.getByTestId('client-first-name').fill(payload.first_name);
  await page.getByTestId('client-last-name').fill(payload.last_name);
  await page.getByTestId('client-email').fill(payload.email);
  await page.getByTestId('client-phone').fill(payload.phone);
  await page.getByTestId('client-oib').fill(payload.oib);
  await page.getByTestId('product-bank_account').check();
  await page.getByTestId('client-save').click();
  await expect(page.getByTestId('client-success')).toHaveText(
    'Client created.',
  );
  await expect(page.getByTestId('client-first-name')).toHaveValue(
    payload.first_name,
  );
  await expect(page.getByTestId('client-created-at')).toBeVisible();
  await expect(page.getByTestId('product-bank_account')).toBeChecked();

  await page.getByTestId('client-first-name').fill('Updated');
  await page.getByTestId('client-save').click();
  await expect(page.getByTestId('client-success')).toHaveText('Client saved.');

  await page.getByTestId('client-delete').click();
  await page.getByTestId('delete-cancel').click();
  await expect(page.getByTestId('client-first-name')).toHaveValue('Updated');

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
  await submitLogin(
    page,
    process.env.E2E_ADMIN_EMAIL!,
    process.env.E2E_ADMIN_PASSWORD!,
  );
  await expectCrmAfterLogin(page);
  await page.getByTestId('client-create').click();
  await page.getByTestId('client-save').click();
  await expect(page.getByTestId('field-error-first_name')).toHaveText(
    'first name',
  );
  await expect(page.getByTestId('field-error-email')).toHaveText('email');
  await expect(page.getByTestId('field-error-oib')).toHaveText('OIB');
});

test('TC-C007–C011 VIEWER can read and search, not write', async ({ page }) => {
  test.skip(!hasViewer, 'E2E_VIEWER_EMAIL / E2E_VIEWER_PASSWORD not set');
  await submitLogin(
    page,
    process.env.E2E_VIEWER_EMAIL!,
    process.env.E2E_VIEWER_PASSWORD!,
  );
  await expectCrmAfterLogin(page);
  await page.getByTestId('nav-clients').click();
  await expectClientsSchemaReady(page);
  await expect(page.getByTestId('client-create')).toHaveCount(0);
  await page.getByTestId('client-search').fill('zzzz-no-such-client');
  await expect(page).toHaveURL(/q=/);
  await expect(page.getByTestId('client-loading')).toHaveCount(0);
  await expect(page.getByTestId('client-empty')).toHaveText(
    'No matching clients.',
  );
  await page.goto('/app/clients/new');
  await expect(page).toHaveURL(/\/app\/clients$/);
  await expect(page.getByTestId('client-form')).toHaveCount(0);
});
