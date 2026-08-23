# Implementation plan: CRM-001

- Work item: CRM-001
- Issue: **none** (GitHub App/MCP cannot create Issues in this run).
  Gate 1 Ready is the PO chat instruction of 2026-08-23 (this thread).
- Owner: Agent (draft) / Human (approve → `PLANNED`)
- Source: Gate 1 Ready; [dor-gate-1.md](dor-gate-1.md) §5.1 and §5.2
  accepted as product decisions; specs in this folder
- Open questions: none blocking. Physical names in §3 are **part of
  this plan** (TD-C005). Approving this plan approves those names.
- Approval: **Revised Gate 2** (PO chat 2026-08-23). Original
  Client-only plan is superseded. PO instructed: Product catalog +
  optional ClientProduct assign + soft-delete on this implementation
  branch. State stays `PLANNED`. Coding continues.
- Traceability: [requirement.md](requirement.md),
  [functional-spec.md](functional-spec.md),
  [technical-spec.md](technical-spec.md), AC-C001–AC-C022,
  TC-C001–TC-C022
- Prerequisite: human Definition of Ready (**recorded in chat**,
  2026-08-23)
- Status: **Revised Approved** (`PLANNED`) — Product + ClientProduct +
  soft-delete in progress toward Gate 3 (`test`)

This is **not** the functional or technical specification.

This plan is the **revised Gate 2** plan. Implementation belongs on
`cursor/crm-001-implementation-73b9` into `test`. The agent does
**not** apply SQL to production or merge `main`.

---

## 1. DoR evidence

PO/BA, 2026-08-23, explicit chat:

> Gate 1: I accept docs/features/CRM-001/dor-gate-1.md §5.1 and §5.2
> recommended defaults as product decisions. CRM-001 is READY. Do not
> implement. Next: implementation plan (Gate 2) only.

AUTH-001 is **`RELEASED`**. Dependency met.

GitHub Issue still missing (tooling). Ready is this chat record, not
Issue close.

---

## 2. Product rules this plan implements (frozen)

From approved BD-C\* plus accepted §5 defaults. Do not reopen in code
review.

| ID                | Rule                                                                                                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BD-C001–C018      | Client + fixed Product catalog + ClientProduct; six Client fields; ADMIN CRUD (soft-delete); VIEWER read/search; RLS; audit successful CUD; append-only; no READ/failure audit; no audit UI |
| BD-C016           | Six English catalog products; no Product admin UI                                                                                                                                           |
| BD-C017           | Client 0..N products; create must not require a product; ADMIN assigns on create/edit                                                                                                       |
| BD-C018           | UI delete = soft-delete; hide from active list; keep row and audit as DELETE; no restore                                                                                                    |
| BD-T001           | Email required; `local@domain` with a dot in the domain; no MX                                                                                                                              |
| BD-T002           | Phone required; digits, optional leading `+`, optional spaces; after stripping spaces: 8–15 digits                                                                                          |
| BD-T003           | OIB required; exactly 11 digits; no checksum                                                                                                                                                |
| BD-T004           | Email unique among **active** Clients, case-insensitive                                                                                                                                     |
| BD-T005           | Phone not unique                                                                                                                                                                            |
| BD-T006           | ADMIN and VIEWER search; case-insensitive partial match on first name, last name, email, phone, OIB; empty query = full list (paginated)                                                    |
| BD-T007           | Sort: last name, then first name, A–Z, case-insensitive                                                                                                                                     |
| BD-T008           | 20 Clients per page                                                                                                                                                                         |
| BD-T009           | Empty: `No clients yet.` / no hits: `No matching clients.`                                                                                                                                  |
| BD-T010           | DELETE: UI confirm; Cancel leaves the row; no type-to-confirm                                                                                                                               |
| BD-T011           | Load/save/delete failure: `Operation failed.` Field errors name the field                                                                                                                   |
| BD-T012           | `Client created.` / `Client saved.` / `Client deleted.`                                                                                                                                     |
| BD-T013           | Reuse AUTH-001 shell; list+search; ADMIN form; VIEWER read-only detail                                                                                                                      |
| BD-T014           | `/app/clients`, `/app/clients/new`, `/app/clients/:id`                                                                                                                                      |
| BD-T015           | Keep all audit rows; no purge                                                                                                                                                               |
| BD-T016           | No audit query UI                                                                                                                                                                           |
| BD-T017           | Failed DB: generic error; no success UI; partial UI update ≠ success                                                                                                                        |
| BD-T018 / TD-C006 | Client write and audit row succeed or fail together via **DB trigger**                                                                                                                      |

---

## 3. Data model (TD-C005 — proposed here)

Non-prod migration only. Agent does **not** apply to production.

### 3.1 Table `public.clients`

| Column       | Type          | Constraints                                                |
| ------------ | ------------- | ---------------------------------------------------------- |
| `id`         | `uuid`        | PK, `gen_random_uuid()`                                    |
| `first_name` | `text`        | `not null`, `char_length(btrim(first_name)) >= 1`          |
| `last_name`  | `text`        | `not null`, `char_length(btrim(last_name)) >= 1`           |
| `email`      | `text`        | `not null`                                                 |
| `phone`      | `text`        | `not null`                                                 |
| `oib`        | `text`        | `not null`, `oib ~ '^[0-9]{11}$'`                          |
| `created_at` | `timestamptz` | `not null`, `default now()`                                |
| `deleted_at` | `timestamptz` | null when active (added in products/soft-delete migration) |
| `deleted_by` | `uuid`        | actor who soft-deleted; null when active                   |

Unique: `unique index clients_email_lower_key on public.clients (lower(email)) where deleted_at is null`.

No extra business columns. No `updated_at` (not in BD-C002).

### 3.1a Table `public.products`

| Column       | Type          | Constraints                 |
| ------------ | ------------- | --------------------------- |
| `id`         | `uuid`        | PK, `gen_random_uuid()`     |
| `code`       | `text`        | `not null`, unique          |
| `name`       | `text`        | `not null`, unique          |
| `created_at` | `timestamptz` | `not null`, `default now()` |

Seed (English): `bank_account` Bank account; `credit_card` Credit card;
`loan` Loan; `savings` Savings; `mobile_banking` Mobile banking;
`online_banking` Online banking.

### 3.1b Table `public.client_products`

| Column       | Type          | Constraints                                 |
| ------------ | ------------- | ------------------------------------------- |
| `client_id`  | `uuid`        | PK part, FK `clients(id)` on delete cascade |
| `product_id` | `uuid`        | PK part, FK `products(id)`                  |
| `created_at` | `timestamptz` | `not null`, `default now()`                 |

### 3.2 Table `public.client_audit_events`

| Column           | Type          | Constraints                                                             |
| ---------------- | ------------- | ----------------------------------------------------------------------- |
| `id`             | `uuid`        | PK, `gen_random_uuid()`                                                 |
| `actor_id`       | `uuid`        | `not null` (Auth user id at write time; no FK required if user deleted) |
| `action`         | `text`        | `not null`, check `in ('CREATE','UPDATE','DELETE')`                     |
| `entity`         | `text`        | `not null`, default `'Client'`, check `= 'Client'`                      |
| `entity_id`      | `uuid`        | `not null`                                                              |
| `occurred_at`    | `timestamptz` | `not null`, `default now()`                                             |
| `previous_value` | `jsonb`       | null on CREATE                                                          |
| `new_value`      | `jsonb`       | null on DELETE                                                          |

JSON payloads store the six business fields plus `id` (and
`created_at` when present). UPDATE stores previous and new row
snapshots (BD-C009).

### 3.3 Relationships

- `clients` optionally has 0..N rows in `client_products`.
- Audit `entity_id` is the Client `id` at event time. **No FK** to
  `clients`, so a later hard delete can keep the audit row
  (BD-T015, append-only). UI delete is **soft-delete** (BD-C018).
- `profiles` unchanged (AUTH-001). Role is read from `profiles.role`.

### 3.4 Trigger (TD-C006 / BD-T018)

- Function `public.clients_write_audit()` `security definer`,
  `set search_path = public`.
- `after insert or update or delete on public.clients` for each row.
- `actor_id = auth.uid()`; if null, abort the Client write (fail-closed).
- INSERT audit in the same statement as the Client write (one
  transaction). App does **not** insert into `client_audit_events`.

### 3.5 RLS (intent → SQL in migration after PLANNED)

Helper: authenticated user with `profiles.role` (fail-closed if no
row).

**`clients`**

- RLS on.
- `SELECT` active rows: `authenticated` and role in (`ADMIN`,`VIEWER`)
  and `deleted_at is null`.
- `SELECT` deleted rows: `ADMIN` only (needed for UPDATE RETURNING
  after soft-delete). SPA list/get still filter `deleted_at is null`.
- `INSERT`/`UPDATE`/`DELETE`: `authenticated` and role `ADMIN` only.
- No policies for `anon`.

**`products`**

- RLS on. `SELECT` for ADMIN and VIEWER. No writes for `authenticated`.

**`client_products`**

- RLS on. `SELECT` for ADMIN and VIEWER. `INSERT`/`DELETE` ADMIN only.

**`client_audit_events`**

- RLS on.
- No `INSERT`/`UPDATE`/`DELETE` for `authenticated` or `anon` (trigger
  owner bypasses RLS).
- No `SELECT` for the SPA (no audit UI). Verification of audit rows
  uses **non-prod service role in automated tests only**, never in
  `src/`.

Revoke grants on audit table from `anon`/`authenticated` except as
required for trigger owner.

---

## 4. Application components

Reuse AUTH-001: Vite, React, TS, React Router, `AuthProvider`,
`RequireAuth`, fail-closed missing profile, existing `/login` and
`/app`.

### 4.1 Routing (`src/App.tsx`)

Keep `/login`, `/access-denied`, `/`. Nest under `/app`:

| Path               | Element                                                                | Access                                            |
| ------------------ | ---------------------------------------------------------------------- | ------------------------------------------------- |
| `/app`             | `AppShell` layout + `Outlet`; default child redirect to `/app/clients` | `RequireAuth` (usable ADMIN/VIEWER)               |
| `/app/clients`     | list + search                                                          | both roles                                        |
| `/app/clients/new` | create form                                                            | ADMIN only (VIEWER → `/app/clients`, no write UI) |
| `/app/clients/:id` | ADMIN: edit form; VIEWER: read-only detail                             | both; VIEWER no write controls                    |

### 4.2 Files to add (after PLANNED)

| Path                                                              | Purpose                                                                            |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `supabase/migrations/20260823190000_clients_and_audit.sql`        | tables, indexes, trigger, RLS, grants                                              |
| `src/lib/clientValidation.ts`                                     | BD-T001–T003 (+ unique email is DB + mapped error)                                 |
| `src/lib/clients.ts`                                              | Supabase select/insert/update/delete; search `or`/`ilike`; order; range pagination |
| `src/pages/ClientListPage.tsx`                                    | list, search, empty copy, pager, ADMIN create link, row → `:id`                    |
| `src/pages/ClientFormPage.tsx`                                    | create/edit; field errors; success copy; DELETE + confirm for edit                 |
| `src/pages/ClientDetailPage.tsx`                                  | VIEWER read-only six fields + products                                             |
| `src/components/DeleteClientDialog.tsx`                           | confirm / cancel (BD-T010)                                                         |
| `src/lib/products.ts`                                             | catalog codes and empty/optional copy                                              |
| `supabase/migrations/20260823210000_products_and_soft_delete.sql` | products, client_products, seed, soft-delete, RLS                                  |
| `tests/unit/clientValidation.test.ts`                             | email/phone/OIB rules                                                              |
| `tests/unit/products.test.ts`                                     | six catalog codes                                                                  |
| `tests/e2e/clients.spec.ts`                                       | TC-C001–C011, C017, C020–C022 as UI (secrets)                                      |
| `tests/integration/clients-rls.test.ts`                           | VIEWER write denied; ADMIN CUD + audit; product assign (secrets)                   |

### 4.3 Files to change

| Path                                    | Purpose                                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/App.tsx`                           | nested Client routes                                                                             |
| `src/pages/AppShell.tsx`                | nav to Clients; `Outlet`; keep logout; remove “write when records exist” as the only CRM surface |
| `src/pages/LoginPage.tsx`               | no Client CRUD (unchanged behaviour)                                                             |
| `package.json`                          | description may mention CRM-001; no new deps unless human later requires                         |
| `README.md`                             | how to run Clients locally                                                                       |
| `docs/features/CRM-001/traceability.md` | fill implementation paths after code exists                                                      |
| `docs/features/CRM-001/test-plan.md`    | execution vs skip (same pattern as AUTH-001)                                                     |
| `tests/e2e/roles.spec.ts`               | adjust if shell hints change                                                                     |
| `tests/smoke/rel-003.spec.ts`           | **do not expand** unless a later release plan says so (AUTH smoke stays AUTH)                    |

### 4.4 Data access

- Browser: existing `getSupabase()` + user session (anon key).
- Queries `public.clients`, `public.products`, `public.client_products`.
- Never import or call `client_audit_events` from `src/`.
- Never ship service role in Vite env.

### 4.5 Validation (client)

- Trim names; reject empty.
- Email: non-empty, one `@`, domain contains `.` (BD-T001).
- Phone: strip spaces; optional one leading `+`; remaining 8–15 digits
  (BD-T002).
- OIB: `^[0-9]{11}$` (BD-T003).
- Unique email: rely on unique index; map Postgres unique_violation to
  field error “email”.

Do not invent extra fields or checksum.

### 4.6 Error handling

- Mutation/load catch-all: `Operation failed.` (BD-T011), no success
  toast.
- Do not leave list/detail in a “saved” state if the request failed
  (BD-T017).
- AUTH generic login copy unchanged.

### 4.7 Tests (created after PLANNED; executed then)

| AC / TC                     | Automated path                                                                   | CI without secrets                               |
| --------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------ |
| AC-C001–C002 / TC-C001–C002 | `tests/e2e/clients.spec.ts`                                                      | Skip if no `E2E_*`                               |
| AC-C003–C006 / TC-C003–C006 | e2e ADMIN                                                                        | Skip if no `E2E_ADMIN_*`                         |
| AC-C007–C011 / TC-C007–C011 | e2e VIEWER                                                                       | Skip if no `E2E_VIEWER_*`                        |
| AC-C012 / TC-C012           | `tests/integration/clients-rls.test.ts` VIEWER insert/update/delete denied       | Skip if no Supabase service role **test** secret |
| AC-C013–C016 / TC-C013–C016 | integration: ADMIN CUD then SELECT audit as service role                         | Skip if no test service role                     |
| AC-C017 / TC-C017           | integration: authenticated UPDATE/DELETE on audit table denied                   | Skip if no secrets                               |
| AC-C018–C019 / TC-C018–C019 | integration: SELECT/READ does not insert audit; failed VIEWER write inserts none | Skip if no secrets                               |
| AC-C020–C022 / TC-C020–C022 | e2e product checkboxes + list/detail; integration ADMIN assign / VIEWER deny     | Skip if no secrets / products migration          |
| BD-T001–T003                | `tests/unit/clientValidation.test.ts`                                            | Always run                                       |
| BD-C016                     | `tests/unit/products.test.ts`                                                    | Always run                                       |

SKIPPED ≠ PASSED. Do not mark integration PASSED if skipped.

Playwright already uses `workers: 1` on CI (`test` branch). Keep it.

---

## 5. Security notes

- PII: email, phone, OIB — list/detail only for authenticated usable
  roles.
- Soft-DELETE hides the row; confirm in UI; RLS ADMIN-only. No restore.
- VIEWER: no create/edit/delete controls; RLS still denies CUD.
- Fail-closed AUTH-001 still wraps `/app/*`.
- Audit not readable/writable from the SPA.
- Service role: CI/local **test only**, never `VITE_*`.

Security review of the implementation PR before human QA (Gate 3).

---

## 6. Deployment implications

| Step                                                                                                                     | Who                                                                              |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Merge implementation PR → `test`                                                                                         | Human                                                                            |
| Apply `20260823190000_clients_and_audit.sql` then `20260823210000_products_and_soft_delete.sql` to **non-prod** Supabase | Human (agent does not apply)                                                     |
| Vercel Preview picks up SPA                                                                                              | Automatic on `test`/PR                                                           |
| Production migration                                                                                                     | **Not** this PR. Only after Gate 3 + human merge to `main` + human apply to prod |
| REL production smoke                                                                                                     | Later release plan; do not claim RELEASED from Preview                           |

Rollback: revert `test` merge; human drops/restores non-prod tables
only with an explicit data plan. Do not drop prod.

---

## 7. Out of scope

- DASH-001 / other entities
- Extra Client fields, OIB checksum, MX lookup, country picker
- Product admin UI, restore of soft-deleted Clients, contract/rate/balance fields
- Audit UI, export, purge job
- Custom REST/GraphQL
- AUTH-001 redesign
- Agent apply SQL to production
- Expanding REL-003 production smoke in this increment unless a
  release plan says so
- Merging this plan PR to `main`
- Implementation before this plan is **Approved**

---

## 8. Implementation order (after PLANNED only)

1. Add Client+audit migration, then products+soft-delete migration (not applied by agent to any cloud).
2. Validation helpers + unit tests.
3. `clients.ts` data access.
4. Routes + pages + delete dialog.
5. Wire `AppShell` nav + `Outlet`.
6. e2e + RLS integration tests.
7. Traceability paths + README.
8. PR to **`test`**. Stop for Gate 3 (CI, Preview, PO review).
9. Never merge `main` as agent.

---

## 9. Gate 2 — revised approval

Original approval (Client-only) is **superseded**.

PO re-approval for this revision is the 2026-08-23 instruction to
implement Product + optional assign + soft-delete on the existing
implementation branch. State remains **`PLANNED`**. Coding continues.

If a later PO wants products without soft-delete, that must be an
explicit new decision (BD-C018 would be reversed). This revision
keeps both.
