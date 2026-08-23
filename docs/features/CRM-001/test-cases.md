# CRM-001 test cases

- Work item: CRM-001
- Design status: **DESIGNED**
- Automation status: **AUTOMATED** (Playwright + Vitest unit + Vitest
  integration). Paths: `tests/e2e/clients.spec.ts`,
  `tests/unit/clientValidation.test.ts`, `tests/unit/products.test.ts`,
  `tests/integration/clients-rls.test.ts`.
- Execution status: **NOT EXECUTED** on this remediation pass.
  Credentialed e2e/RLS **SKIP** without secrets (SKIPPED ≠ PASSED).
  Do not record PASSED without evidence.
- Risk: High
- Owner (draft): Agent as QA
- Source: [bdd.md](bdd.md), [user-stories.md](user-stories.md)

## Automation map (not an execution report)

| TC           | Automated in                                                   | Execution                                                                                      |
| ------------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| TC-C001      | `tests/e2e/clients.spec.ts`                                    | NOT EXECUTED (skip without `E2E_ADMIN_*`)                                                      |
| TC-C002      | e2e invalid-field case + `tests/unit/clientValidation.test.ts` | unit always runnable; e2e NOT EXECUTED                                                         |
| TC-C003–C006 | `tests/e2e/clients.spec.ts` ADMIN CRUD                         | NOT EXECUTED                                                                                   |
| TC-C007–C011 | `tests/e2e/clients.spec.ts` VIEWER                             | NOT EXECUTED (skip without `E2E_VIEWER_*`); C011 grouped, not a separate field-by-field assert |
| TC-C012–C019 | `tests/integration/clients-rls.test.ts`                        | NOT EXECUTED (skip unless live Supabase)                                                       |
| TC-C020      | `tests/unit/products.test.ts` + e2e product checkbox           | unit runnable; e2e NOT EXECUTED                                                                |
| TC-C021      | e2e assign on create + integration                             | NOT EXECUTED                                                                                   |
| TC-C022      | e2e search after delete                                        | NOT EXECUTED                                                                                   |

## TC-C001: Only Client entity

- AC: AC-C001
- BDD: Client is the only CRM entity
- Type: e2e / specification review until UI exists
- Risk: High

### Expected result

No other CRM entity is offered by CRM-001.

## TC-C002: Client fields

- AC: AC-C002
- BDD: Client has the approved fields
- Type: e2e / integration

### Expected result

Fields present: first name, last name, email, phone, OIB, created_at.
No extra business fields.

## TC-C003: ADMIN READ

- AC: AC-C003
- Type: e2e
- Risk: High

### Expected result

ADMIN can read Clients.

## TC-C004: ADMIN CREATE

- AC: AC-C004
- Type: e2e
- Risk: High

### Expected result

ADMIN can create a Client. Validation details TBD — do not invent
invalid/valid examples beyond “approved fields are submitted”.

## TC-C005: ADMIN UPDATE

- AC: AC-C005
- Type: e2e
- Risk: High

### Expected result

ADMIN can update a Client.

## TC-C006: ADMIN DELETE

- AC: AC-C006
- Type: e2e
- Risk: High

### Expected result

ADMIN can delete a Client. Confirmation UX is TBD (BD-T010).

## TC-C007: VIEWER READ

- AC: AC-C007
- Type: e2e
- Risk: High

### Expected result

VIEWER can read Clients.

## TC-C008: VIEWER SEARCH

- AC: AC-C008
- Type: e2e
- Risk: High

### Expected result

VIEWER can search Clients. Matching rules TBD — do not hard-code
partial vs exact in the expected result.

## TC-C009: VIEWER cannot CREATE

- AC: AC-C009
- Type: e2e + data-layer
- Risk: High

### Expected result

CREATE is not allowed for VIEWER.

## TC-C010: VIEWER cannot UPDATE or DELETE

- AC: AC-C010
- Type: e2e + data-layer
- Risk: High

### Expected result

UPDATE and DELETE are not allowed for VIEWER.

## TC-C011: VIEWER sees all fields

- AC: AC-C011
- Type: e2e
- Risk: Medium (privacy: all fields visible is approved)

### Expected result

All Client fields are visible to VIEWER.

## TC-C012: Database authorization boundary

- AC: AC-C012
- Type: integration (Supabase client as VIEWER attempting writes)
- Risk: High

### Expected result

VIEWER write is denied by the database authorization boundary, not
only by missing buttons.

Do not include RLS SQL in this test case. Implementation of the
boundary is later (`PLANNED`).

## TC-C013: Audit CREATE

- AC: AC-C013
- Type: integration
- Risk: High

### Expected result

Successful CREATE yields an audit record.

## TC-C014: Audit UPDATE values

- AC: AC-C014
- Type: integration
- Risk: High

### Expected result

Successful UPDATE yields an audit record with previous and new values.

## TC-C015: Audit DELETE

- AC: AC-C015
- Type: integration
- Risk: High

### Expected result

Successful DELETE yields an audit record.

## TC-C016: Audit attributes

- AC: AC-C016
- Type: integration
- Risk: High

### Expected result

Audit record includes actor/user ID, action, entity, entity ID,
timestamp.

## TC-C017: Append-only in application

- AC: AC-C017
- Type: e2e + data-layer
- Risk: High

### Expected result

CRM application provides no successful modify or delete of audit
records for ADMIN or VIEWER.

## TC-C018: READ not audited

- AC: AC-C018
- Type: integration
- Risk: Medium

### Expected result

Successful READ does not require a CRM-001 audit record.

## TC-C019: Unauthorized attempt not audited

- AC: AC-C019
- Type: integration
- Risk: Medium

### Expected result

Denied VIEWER CREATE does not require a CRM-001 audit record.

## TC-C020: Fixed Product catalog

- AC: AC-C020
- Type: unit / e2e
- Risk: Medium

### Expected result

Six English catalog products exist. No Product admin UI.

## TC-C021: Optional product assignment

- AC: AC-C021
- Type: e2e + integration
- Risk: High

### Expected result

ADMIN can create a Client with no products and can assign catalog
products via checkboxes. VIEWER cannot write `client_products`. List
and detail show assigned names or `No products assigned.`

## TC-C022: Soft-delete hides the Client

- AC: AC-C022
- Type: e2e + integration
- Risk: High

### Expected result

After confirmed UI delete, search for that Client’s email shows
`No matching clients.` Audit action is DELETE. Restore is not offered.

## Not in CRM-001

- AUTH-001 login tests (see AUTH-001 pack)
- DASH-001
- Failed-attempt audit (out of scope)
- Exact validation/search/pagination tests until BD-T\* are decided
