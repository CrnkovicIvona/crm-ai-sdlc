# CRM-001 UI/UX proposal

- Status: **Proposed — waiting for PO**
- Date: 2026-08-23
- Scope: visual layout, hierarchy, and optional validation copy for
  **existing** AUTH-001 + CRM-001 screens
- Not in this document: new features, DASH-001, Product admin, restore
- Skill: `.cursor/skills/ui-ux-redesign/SKILL.md`

Do **not** apply CSS or copy from this file until the PO names which
items to implement. Approved product copy remains in
[decisions.md](decisions.md) (BD-T009, BD-T011, BD-T012) until a human
accepts a Proposed line.

## Must not change

- Routes: `/login`, `/access-denied`, `/app/clients`,
  `/app/clients/new`, `/app/clients/:id`
- Roles ADMIN / VIEWER and fail-closed access
- Soft-delete behavior and optional products
- `data-testid` values used by Playwright (including
  `crm-shell`, `logout`, `user-role`, `nav-clients`,
  `product-bank_account`, `field-error-first_name` and other
  `field-error-*`, `delete-dialog`)
- ADR-0002 (Vite + React; no new CSS framework unless PO asks)

## Current state (audit)

Global ([src/index.css](../../../src/index.css)): system-ui font, `body`
margin 2rem, unstyled labels/inputs, table with only a bottom border.
No max-width, no header bar, no focus-visible treatment.

### Login

Stacked heading, two fields, submit. Error sits **below** the button.
Test-user aside is full-width grey text at the bottom. No card, no
constraint on line length.

### Access denied

Heading + paragraph + logout + login link, no visual grouping.

### App shell

`h1` BankCRM, role string, one nav link, ADMIN/VIEWER hint, logout
button, then the page. Logout sits in the content flow, not a bar.
ADMIN still shows “Write actions will be available when CRM records
exist.” which is stale now that Clients exist.

### Client list

Title, optional success, “New client” as a text link, search label,
then table (name, email, phone, OIB, products, created). Products as
a comma-separated cell. Pager is two buttons + `page / total`. Loading
and empty are plain paragraphs. Search and primary action compete for
the same vertical stack.

### Client form

Long single column: five fields, created_at on edit, product fieldset
with “Products are optional.”, then Create/Save, then Delete on edit.
Field errors are the field **name** only (`first name`, `email`),
below the input. Generic `Operation failed.` at the top.

### Client detail (VIEWER)

Definition list of all fields including products. No visual
distinction between identity and products.

### Delete confirm

Bordered box in-page (`delete-dialog`), not a modal overlay.

## Layout recommendations

1. **Page frame:** max-width ~72rem, centered; shell as a top bar
   (product name | Clients | role | Log out).
2. **Login:** centered card (max-width ~24rem); error adjacent to the
   submit control; keep test-user aside visually secondary (smaller,
   not competing with the form).
3. **List toolbar:** title + “New client” on one row (ADMIN); search
   full width below; table in a contained surface; products column
   can wrap chips later (still text is fine for v1).
4. **Form:** max-width ~32rem; error text immediately under the
   control; products as a two-column checkbox grid inside the
   fieldset; primary button distinct from Delete (Delete secondary /
   danger, not the same as Save).
5. **Detail:** two groups — identity vs products.
6. **Delete:** keep in-page confirm (BD-T010) but visually separate
   (overlay or highlighted panel) so it is not mistaken for the form.
7. **Focus and contrast:** visible focus ring; error color not
   red-only (icon or prefix) so it is not color-only.
8. **Stale ADMIN hint:** replace or drop
   “Write actions will be available when CRM records exist.”
   Proposed: omit it, or “You can create and edit clients.”
   — **Proposed**, needs PO.

## Proposed validation copy (not applied)

Rules stay BD-T001–T003. Only the **string** would change if accepted.

| Situation        | Current                             | Proposed                                     |
| ---------------- | ----------------------------------- | -------------------------------------------- |
| Empty first name | `first name`                        | `Enter a first name.`                        |
| Empty last name  | `last name`                         | `Enter a last name.`                         |
| Bad email        | `email`                             | `Enter an email like name@bank.example.`     |
| Bad phone        | `phone`                             | `Enter a phone with 8–15 digits.`            |
| Bad OIB          | `OIB`                               | `Enter an 11-digit OIB.`                     |
| Duplicate email  | still `email` / generic             | `This email is already used.` (field)        |
| Generic failure  | `Operation failed.`                 | keep (BD-T011) unless PO wants a longer line |
| Login failure    | `Authentication failed.`            | keep (AUTH-001)                              |
| Empty list       | `No clients yet.`                   | keep (BD-T009)                               |
| No search hits   | `No matching clients.`              | keep (BD-T009)                               |
| No products      | `No products assigned.`             | keep                                         |
| Success          | `Client created.` / saved / deleted | keep (BD-T012)                               |

Field errors must still use `data-testid="field-error-first_name"`
(and the other `field-error-*` ids).

## Implementation order (after PO pick)

1. Shell header + page max-width (CSS + AppShell structure, keep
   testids).
2. Login card + error placement.
3. List toolbar + table container.
4. Form width, field-error styling, product grid, button hierarchy.
5. Apply only PO-accepted copy strings.
6. Playwright smoke of login + client create/delete (secrets).

## PO checklist

Reply with which of 1–8 layout items to apply, and whether Proposed
validation strings are accepted, rejected, or mixed.
