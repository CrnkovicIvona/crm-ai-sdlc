# CRM-001 UI/UX proposal

- Status: **Accepted and applied** (2026-08-23). PO approved layout
  items 1–8 and the proposed validation copy (`može`).
- Date: 2026-08-23
- Scope: visual layout, hierarchy, and validation copy for
  **existing** AUTH-001 + CRM-001 screens
- Not in this document: new features, DASH-001, Product admin, restore
- Skill: `.cursor/skills/ui-ux-redesign/SKILL.md`

Approved product copy for success / empty / generic failure remains in
[decisions.md](decisions.md) (BD-T009, BD-T011, BD-T012). Field-error
strings below were accepted as an overlay on BD-T001–T003 (same rules,
new wording).

## Must not change

- Routes: `/login`, `/access-denied`, `/app/clients`,
  `/app/clients/new`, `/app/clients/:id`
- Roles ADMIN / VIEWER and fail-closed access
- Soft-delete behavior and optional products
- Frozen `data-testid` values (src + Playwright; do not rename):
  `login-form`, `login-email`, `login-password`, `login-submit`,
  `login-error`, `test-users`, `crm-shell`, `logout`, `user-role`,
  `nav-clients`, `admin-write-hint`, `viewer-read-hint`,
  `access-denied`, `denied-logout`, `client-list`, `client-create`,
  `client-search`, `client-loading`, `client-empty`, `client-error`,
  `client-success`, `client-form`, `client-first-name`,
  `client-last-name`, `client-email`, `client-phone`, `client-oib`,
  `client-created-at`, `client-save`, `client-delete`,
  `field-error-first_name`, `field-error-last_name`,
  `field-error-email`, `field-error-phone`, `field-error-oib`,
  `product-bank_account` and `product-{code}` for catalog codes,
  `client-products`, `delete-dialog`, `delete-cancel`,
  `delete-confirm`. (Do not use `product-bank_account` or
  `field-error-first_name` — those names are not in the freeze.)
- ADR-0002 (Vite + React; no new CSS framework unless PO asks)

## Applied layout

1. **Page frame:** max-width ~72rem, centered; shell as a top bar
   (BankCRM | Clients | role | hint | Log out).
2. **Login:** centered card (max-width ~24rem); error adjacent to the
   submit control; test-user aside visually secondary.
3. **List toolbar:** title + “New client” on one row (ADMIN); search
   below; table in a contained surface.
4. **Form:** max-width ~32rem; error text immediately under the
   control; products as a two-column checkbox grid; Delete secondary /
   danger vs Save.
5. **Detail:** two groups — identity vs products.
6. **Delete:** in-page confirm kept (`delete-dialog`); dimmed overlay
   plus highlighted panel.
7. **Focus and contrast:** `:focus-visible` ring; errors use border +
   icon background (not color-only). Icon is CSS background so the
   DOM text stays the JS string for Playwright.
8. **ADMIN hint:** `You can create and edit clients.` (`admin-write-hint`
   unchanged).

## Applied validation copy

| Situation        | String                                                |
| ---------------- | ----------------------------------------------------- |
| Empty first name | `Enter a first name.`                                 |
| Empty last name  | `Enter a last name.`                                  |
| Bad email        | `Enter an email like name@bank.example.`              |
| Bad phone        | `Enter a phone with 8–15 digits.`                     |
| Bad OIB          | `Enter an 11-digit OIB.`                              |
| Duplicate email  | `This email is already used.` (field)                 |
| Generic failure  | `Operation failed.` (kept)                            |
| Login failure    | `Authentication failed.` (kept; `GENERIC_AUTH_ERROR`) |
| Empty list       | `No clients yet.` (kept)                              |
| No search hits   | `No matching clients.` (kept)                         |
| No products      | `No products assigned.` (kept)                        |
| Success          | `Client created.` / saved / deleted (kept)            |
