# CRM-001 decision log

- Work item: CRM-001
- Issue: none yet
- Risk: High
- Status of log: **APPROVED for Ready** — BD-C001–BD-C015, reuse TDs,
  BD-T001–BD-T018, TD-C005 (names in the implementation plan), and
  TD-C006. Source: PO Gate 1 chat 2026-08-23 (accepted
  [dor-gate-1.md](dor-gate-1.md) §5.1 and §5.2).
- This is not an ADR. Platform: ADR-0001, ADR-0002, AUTH-001 TD-001–TD-008.

Gate 1 Ready does **not** authorize `src/` Client modules until the
implementation plan is human-approved (`PLANNED`).

---

## Business decisions (approved)

### BD-C001 Entity

| Field          | Value                               |
| -------------- | ----------------------------------- |
| Decision       | Which CRM entities exist in CRM-001 |
| Approved value | **Client** only                     |
| Status         | **APPROVED**                        |

### BD-C002 Fields

| Field          | Value                                                         |
| -------------- | ------------------------------------------------------------- |
| Decision       | Client business fields                                        |
| Approved value | Exactly: first name, last name, email, phone, OIB, created_at |
| Status         | **APPROVED**                                                  |

### BD-C003 ADMIN authorization

| Field          | Value                        |
| -------------- | ---------------------------- |
| Decision       | ADMIN operations on Client   |
| Approved value | READ, CREATE, UPDATE, DELETE |
| Status         | **APPROVED**                 |

### BD-C004 VIEWER authorization

| Field          | Value                                               |
| -------------- | --------------------------------------------------- |
| Decision       | VIEWER operations on Client                         |
| Approved value | READ and SEARCH. Must not CREATE, UPDATE, or DELETE |
| Status         | **APPROVED**                                        |

### BD-C005 Field visibility

| Field          | Value                                                         |
| -------------- | ------------------------------------------------------------- |
| Decision       | Whether VIEWER is restricted by field                         |
| Approved value | VIEWER may see **all** Client fields. No field-level security |
| Status         | **APPROVED**                                                  |

### BD-C006 Database authorization boundary

| Field          | Value                                                           |
| -------------- | --------------------------------------------------------------- |
| Decision       | Whether UI hiding is sufficient                                 |
| Approved value | **RLS is mandatory**. UI hiding alone is not sufficient         |
| Status         | **APPROVED** (intent). SQL policies are not written in this log |

### BD-C007 Audit events

| Field          | Value                               |
| -------------- | ----------------------------------- |
| Decision       | Which Client operations are audited |
| Approved value | Successful CREATE, UPDATE, DELETE   |
| Status         | **APPROVED**                        |

### BD-C008 Audit minimum content

| Field          | Value                                               |
| -------------- | --------------------------------------------------- |
| Decision       | Minimum audit information                           |
| Approved value | actor/user ID; action; entity; entity ID; timestamp |
| Status         | **APPROVED**                                        |

### BD-C009 Audit UPDATE payload

| Field          | Value                        |
| -------------- | ---------------------------- |
| Decision       | Extra content on UPDATE      |
| Approved value | previous value and new value |
| Status         | **APPROVED**                 |

### BD-C010 Append-only audit

| Field          | Value                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| Decision       | Whether users can change audit records in the CRM app                                                            |
| Approved value | Append-only from the application. Even ADMIN must not modify or delete audit records through the CRM application |
| Status         | **APPROVED**                                                                                                     |

### BD-C011 READ not audited

| Field          | Value                        |
| -------------- | ---------------------------- |
| Decision       | Whether VIEW/READ is audited |
| Approved value | Not audited in CRM-001       |
| Status         | **APPROVED**                 |

### BD-C012 Failed attempts not audited

| Field          | Value                                               |
| -------------- | --------------------------------------------------- |
| Decision       | Whether failed or unauthorized attempts are audited |
| Approved value | Not in CRM-001. Do not add a requirement for it     |
| Status         | **APPROVED**                                        |

### BD-C013 No extra entities

| Field          | Value                   |
| -------------- | ----------------------- |
| Decision       | Additional CRM entities |
| Approved value | None in CRM-001         |
| Status         | **APPROVED**            |

### BD-C014 No field-level security

| Field          | Value                    |
| -------------- | ------------------------ |
| Decision       | Field-level restrictions |
| Approved value | None                     |
| Status         | **APPROVED**             |

### BD-C015 No audit administration feature

| Field          | Value                                              |
| -------------- | -------------------------------------------------- |
| Decision       | Audit management functionality                     |
| Approved value | Do not invent modify/delete/admin of audit records |
| Status         | **APPROVED**                                       |

---

## Business decisions accepted at Gate 1 (2026-08-23)

PO accepted [dor-gate-1.md](dor-gate-1.md) §5.1 and §5.2. Status
**APPROVED**.

| ID      | Approved value                                                                                                                    |
| ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| BD-T001 | Email required; `local@domain` with a dot in the domain; no MX                                                                    |
| BD-T002 | Phone required; digits, optional `+`, optional spaces; 8–15 digits after stripping spaces                                         |
| BD-T003 | OIB required; exactly 11 digits; no checksum                                                                                      |
| BD-T004 | Email unique among Clients, case-insensitive                                                                                      |
| BD-T005 | Phone not unique                                                                                                                  |
| BD-T006 | ADMIN and VIEWER; case-insensitive partial match on first name, last name, email, phone, OIB; empty query = full list (paginated) |
| BD-T007 | Last name, then first name, A–Z, case-insensitive                                                                                 |
| BD-T008 | 20 Clients per page                                                                                                               |
| BD-T009 | `No clients yet.` / `No matching clients.`                                                                                        |
| BD-T010 | UI confirm before DELETE; Cancel leaves the row; no type-to-confirm                                                               |
| BD-T011 | `Operation failed.` Field errors name the field                                                                                   |
| BD-T012 | `Client created.` / `Client saved.` / `Client deleted.`                                                                           |
| BD-T013 | AUTH-001 shell; list+search; ADMIN form; VIEWER read-only detail                                                                  |
| BD-T014 | `/app/clients`, `/app/clients/new`, `/app/clients/:id`                                                                            |
| BD-T015 | Keep all audit rows; no purge                                                                                                     |
| BD-T016 | No audit query UI                                                                                                                 |
| BD-T017 | Generic error; no success UI on failure                                                                                           |
| BD-T018 | Client write and audit row in one DB transaction (trigger)                                                                        |

---

## Technical decisions (reuse vs TBD)

### TD-C001 Frontend platform

| Field          | Value                                               |
| -------------- | --------------------------------------------------- |
| Decision       | UI stack                                            |
| Approved value | Vite + React + TypeScript (ADR-0002). Do not reopen |
| Status         | **APPROVED** (reuse)                                |

### TD-C002 Routing

| Field          | Value                                                                  |
| -------------- | ---------------------------------------------------------------------- |
| Decision       | Routing library                                                        |
| Approved value | React Router; protected CRM routes after AUTH-001                      |
| Status         | **APPROVED** (reuse AUTH-001 TD-002). Exact Client path names: BD-T014 |

### TD-C003 Backend

| Field          | Value                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| Decision       | BaaS                                                                                                         |
| Approved value | Supabase Auth, PostgreSQL, RLS. Supabase client; no custom REST for CRM-001 unless a human later requires it |
| Status         | **APPROVED** (reuse AUTH-001 TD-003, TD-005, TD-006)                                                         |

### TD-C004 Roles

| Field          | Value                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------- |
| Decision       | Role model                                                                                        |
| Approved value | Exactly one of ADMIN or VIEWER from AUTH-001 `profiles`. Fail-closed if missing (AUTH-001 BD-008) |
| Status         | **APPROVED** (reuse)                                                                              |

### TD-C005 Client persistence

| Field          | Value                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Decision       | Where Client rows live                                                                                                               |
| Approved value | Table `public.clients` as named in [implementation-plan.md](implementation-plan.md) §3. Approving that plan approves physical names. |
| Status         | **APPROVED in plan (draft until Gate 2)**                                                                                            |

### TD-C006 Audit storage and write mechanism

| Field          | Value                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| Decision       | How audit records are stored and written                                                                     |
| Approved value | Table `public.client_audit_events` + AFTER trigger on `clients`; app does not insert audit rows; no audit UI |
| Status         | **APPROVED** (Gate 1 §5.1). SQL text is in the implementation plan.                                          |

### TD-C007 Tooling

| Field          | Value                                                                  |
| -------------- | ---------------------------------------------------------------------- |
| Decision       | Test and quality tools                                                 |
| Approved value | Vitest, Playwright, ESLint, Prettier, gitleaks, GitHub Actions, Vercel |
| Status         | **APPROVED** (reuse)                                                   |

No new ADR. No conflict with ADR-0002.
