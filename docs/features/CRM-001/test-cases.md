# CRM-001 test cases

- Work item: CRM-001
- Design status: **DESIGNED**
- Automation status: **AUTOMATED** (Playwright + Vitest unit + Vitest
  integration). Paths: `tests/e2e/clients.spec.ts`,
  `tests/unit/clientValidation.test.ts`, `tests/unit/products.test.ts`,
  `tests/integration/clients-rls.test.ts`.
- Execution status: **PARTIAL** on SHA `1c98f14` (2026-08-23).
  See [../../test-reports/CRM-001.md](../../test-reports/CRM-001.md).
  E2E **PASSED** in CI (11/11). Unit **PASSED** (13). RLS integration
  **BLOCKED** (6 skipped). SKIPPED ≠ PASSED.
- Risk: High
- Owner (draft): Agent as QA
- Source: [bdd.md](bdd.md), [user-stories.md](user-stories.md)

## Automation map (not an execution report)

| TC           | Automated in                                             | Execution                                                                           |
| ------------ | -------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| TC-C001      | `tests/e2e/clients.spec.ts`                              | **PASSED** CI SHA `1c98f14` (run 32672184863)                                       |
| TC-C002      | e2e empty-submit + `tests/unit/clientValidation.test.ts` | **PASSED** unit local+CI; empty-submit e2e CI                                       |
| TC-C003–C006 | `tests/e2e/clients.spec.ts` ADMIN CRUD                   | **PASSED** CI (catalog present; not skipped)                                        |
| TC-C007–C011 | `tests/e2e/clients.spec.ts` VIEWER                       | **PASSED** CI grouped; C011 not field-by-field; C008 match oracle still **BLOCKED** |
| TC-C012–C019 | `tests/integration/clients-rls.test.ts`                  | **BLOCKED** — 6 skipped (no live service role). Skip ≠ pass                         |
| TC-C020      | `tests/unit/products.test.ts` + e2e product checkbox     | **PASSED** unit; checkbox in C003–C006 e2e CI                                       |
| TC-C021      | e2e assign on create + integration                       | **PASSED** e2e assign CI; integration write **BLOCKED** with C012 pack              |
| TC-C022      | e2e search after delete                                  | **PASSED** CI (asserted inside C003–C006)                                           |

## ISTQB P/N/E matrix (existing TCs — no new product rules)

Kind: **P** positive, **N** negative, **E** edge/state. Technique per
[testing-strategy.md](../../sdlc/testing-strategy.md). Oracle missing →
**BLOCKED** (do not invent).

| TC   | Kind  | Technique        | Level       | Oracle / note                                                                                                                 |
| ---- | ----- | ---------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| C001 | P     | Use-case         | e2e         | Only Client entity                                                                                                            |
| C002 | P+N+E | EP + BVA         | unit + e2e  | Approved fields; empty submit N; email/phone/OIB BVA in unit (`TC-C002-*`). Search match / extra formats **BLOCKED** (BD TBD) |
| C003 | P     | Use-case         | e2e         | ADMIN read                                                                                                                    |
| C004 | P     | Use-case         | e2e         | ADMIN create with approved fields; optional product                                                                           |
| C005 | P     | Use-case         | e2e         | ADMIN update                                                                                                                  |
| C006 | P+E   | Use-case + state | e2e         | Delete confirm/cancel; soft-delete then search empty (with C022)                                                              |
| C007 | P     | Use-case         | e2e         | VIEWER read                                                                                                                   |
| C008 | P     | Use-case         | e2e         | VIEWER search UI; **matching rule BLOCKED**                                                                                   |
| C009 | N     | Decision         | e2e         | VIEWER cannot create (UI)                                                                                                     |
| C010 | N     | Decision         | e2e         | VIEWER cannot update/delete (UI)                                                                                              |
| C011 | P     | Use-case         | e2e         | VIEWER sees all fields (grouped)                                                                                              |
| C012 | N     | Decision         | integration | VIEWER write denied at DB                                                                                                     |
| C013 | P     | Use-case         | integration | Audit CREATE                                                                                                                  |
| C014 | P     | Use-case         | integration | Audit UPDATE values                                                                                                           |
| C015 | P     | Use-case         | integration | Audit DELETE                                                                                                                  |
| C016 | P     | EP               | integration | Audit attributes                                                                                                              |
| C017 | N     | Decision         | integration | No audit mutate via app                                                                                                       |
| C018 | N     | Decision         | integration | READ not audited                                                                                                              |
| C019 | N     | Decision         | integration | Unauthorized not audited                                                                                                      |
| C020 | P     | EP               | unit + e2e  | Six catalog codes                                                                                                             |
| C021 | P+E   | Use-case + EP    | e2e         | Optional assign; empty products allowed                                                                                       |
| C022 | E     | State            | e2e         | Soft-deleted not in search                                                                                                    |

## TC-C001: Only Client entity

- AC: AC-C001 · Kind: P · Technique: use-case · Level: e2e · Priority: High
- Type: e2e (`tests/e2e/clients.spec.ts`)

### Preconditions

ADMIN session. CRM-001 UI.

### Test data

None.

### Steps

1. Open `/app/clients`.
2. Observe nav: only Clients. No Account/Deal/Contact links.

### Expected result

No other CRM entity is offered. `nav-clients` visible.

## TC-C002: Client fields

- AC: AC-C002 · Kind: P+N+E · Technique: EP+BVA · Level: unit+e2e · Priority: High

### Preconditions

ADMIN on create form (e2e); or unit validators.

### Test data

Unit: valid/invalid email, phone 8–15, OIB 11 digits (BD-T001–T003).
E2e: empty submit.

### Steps

1. Unit: `TC-C002-*` in `clientValidation.test.ts`.
2. E2e: open create, save empty, assert five `field-error-*`.

### Expected result

Approved fields only. Named field errors on empty submit. Extra
formats / search match **BLOCKED**.

## TC-C003: ADMIN READ

- AC: AC-C003 · Kind: P · Technique: use-case · Level: e2e · Priority: High

### Preconditions

ADMIN. Clients table available.

### Test data

Any existing or newly created client (see C004).

### Steps

1. Open client list / form after create.
2. Observe identity fields.

### Expected result

ADMIN can read Clients (`client-list` / form values).

## TC-C004: ADMIN CREATE

- AC: AC-C004 · Kind: P · Technique: use-case · Level: e2e · Priority: High

### Preconditions

ADMIN. Product catalog migrated (else e2e **FAIL**, not skip).

### Test data

Unique first/last/email/phone/OIB; optional `product-bank_account`.

### Steps

1. `client-create` → fill fields → check product → `client-save`.

### Expected result

`Client created.` Form shows values and `client-created-at`.

## TC-C005: ADMIN UPDATE

- AC: AC-C005 · Kind: P · Technique: use-case · Level: e2e · Priority: High

### Preconditions

Client from C004 still open.

### Test data

First name `Updated`.

### Steps

1. Change first name → `client-save`.

### Expected result

`Client saved.`

## TC-C006: ADMIN DELETE

- AC: AC-C006 · Kind: P+E · Technique: use-case + state · Level: e2e · Priority: High

### Preconditions

Client from C005. UI uses frozen `delete-dialog` (BD-T010 copy TBD;
control IDs are frozen).

### Test data

Same client.

### Steps

1. `client-delete` → `delete-cancel` → still `Updated`.
2. `client-delete` → `delete-confirm`.

### Expected result

`Client deleted.` Then C022 search.

## TC-C007: VIEWER READ

- AC: AC-C007 · Kind: P · Technique: use-case · Level: e2e · Priority: High

### Preconditions

VIEWER session.

### Test data

`E2E_VIEWER_*`.

### Steps

1. Open `/app/clients`.

### Expected result

`client-list` visible. Read allowed.

## TC-C008: VIEWER SEARCH

- AC: AC-C008 · Kind: P · Technique: use-case · Level: e2e · Priority: High

### Preconditions

VIEWER. Matching rule **BLOCKED** (BD TBD).

### Test data

Unlikely query `zzzz-no-such-client` (empty result only; not a match
oracle).

### Steps

1. Fill `client-search`.

### Expected result

Search UI works. URL has `q=`. Empty copy `No matching clients.`
Exact vs partial match not asserted.

## TC-C009: VIEWER cannot CREATE

- AC: AC-C009 · Kind: N · Technique: decision · Level: e2e (UI) + integration (RLS) · Priority: High

### Preconditions

VIEWER.

### Test data

None for UI.

### Steps

1. Assert `client-create` count 0.
2. GET `/app/clients/new` → redirected to list.
3. Integration: VIEWER insert denied (C012).

### Expected result

No create UI. DB write denied (BLOCKED until live RLS runs).

## TC-C010: VIEWER cannot UPDATE or DELETE

- AC: AC-C010 · Kind: N · Technique: decision · Level: e2e + integration · Priority: High

### Preconditions

VIEWER.

### Steps

1. No `client-form` when opening new; no write controls on list.
2. RLS update/delete denied (C012).

### Expected result

UI + DB deny. DB **BLOCKED** without secrets.

## TC-C011: VIEWER sees all fields

- AC: AC-C011 · Kind: P · Technique: use-case · Level: e2e · Priority: Medium

### Preconditions

VIEWER. Grouped with C007–C011 (not field-by-field).

### Steps

1. Open clients as VIEWER.

### Expected result

No field-level hide in UI. Detail field-by-field **PARTIAL**.

## TC-C012: Database authorization boundary

- AC: AC-C012 · Kind: N · Technique: decision · Level: integration · Priority: High

### Preconditions

Live Supabase + service role + ADMIN/VIEWER secrets. Else **SKIPPED →
BLOCKED**.

### Test data

Unique client payload.

### Steps

1. VIEWER insert/update/delete via PostgREST.
2. ADMIN row still present.

### Expected result

VIEWER writes fail at RLS. SQL not in the TC. Automation:
`clients-rls.test.ts`.

## TC-C013: Audit CREATE

- AC: AC-C013 · Kind: P · Technique: use-case · Level: integration · Priority: High

### Preconditions

Same as C012.

### Steps

1. ADMIN insert.
2. Read `client_audit_events` action CREATE.

### Expected result

Audit row exists. Actor, entity Client, new_value set.

## TC-C014: Audit UPDATE values

- AC: AC-C014 · Kind: P · Technique: use-case · Level: integration · Priority: High

### Steps

1. ADMIN update first_name.
2. Read UPDATE audit previous_value / new_value.

### Expected result

Old and new first_name in audit.

## TC-C015: Audit DELETE

- AC: AC-C015 · Kind: P · Technique: use-case · Level: integration · Priority: High

### Steps

1. ADMIN soft-delete (`deleted_at`).
2. Read DELETE audit.

### Expected result

DELETE row; new_value null.

## TC-C016: Audit attributes

- AC: AC-C016 · Kind: P · Technique: EP · Level: integration · Priority: High

### Steps

Covered in C013–C015 selects: actor_id, action, entity, entity_id,
occurred_at.

### Expected result

All required attributes present.

## TC-C017: Append-only in application

- AC: AC-C017 · Kind: N · Technique: decision · Level: integration · Priority: High

### Steps

1. ADMIN update/delete audit row via client.

### Expected result

Mutate fails; CREATE row unchanged. (No separate e2e audit screen —
FS has no audit UI.)

## TC-C018: READ not audited

- AC: AC-C018 · Kind: N · Technique: decision · Level: integration · Priority: Medium

### Steps

1. Count audit rows; ADMIN select client; count again.

### Expected result

Count unchanged.

## TC-C019: Unauthorized attempt not audited

- AC: AC-C019 · Kind: N · Technique: decision · Level: integration · Priority: Medium

### Steps

1. VIEWER insert fails; no audit for that email.

### Expected result

No new audit row.

## TC-C020: Fixed Product catalog

- AC: AC-C020 · Kind: P · Technique: EP · Level: unit + e2e · Priority: Medium

### Steps

1. Unit: six `PRODUCT_CODES`.
2. E2e: `product-bank_account` on form.

### Expected result

Six English codes. No product admin UI (C001).

## TC-C021: Optional product assignment

- AC: AC-C021 · Kind: P+E · Technique: use-case + EP · Level: e2e + integration · Priority: High

### Steps

1. E2e: check catalog on create (C004).
2. Integration: ADMIN insert `client_products`; VIEWER insert denied.

### Expected result

Optional assign. VIEWER cannot write assignments. Integration
**BLOCKED** without secrets.

## TC-C022: Soft-delete hides the Client

- AC: AC-C022 · Kind: E · Technique: state · Level: e2e · Priority: High

### Steps

1. After C006 confirm, search email.

### Expected result

`No matching clients.` Restore not offered.

## Not in CRM-001

- AUTH-001 login tests (see AUTH-001 pack)
- DASH-001
- Failed-attempt audit (out of scope)
- Exact validation/search/pagination tests until BD-T\* are decided
