# CRM-001 decision log

- Work item: CRM-001
- Issue: none yet
- Risk: High
- Status of log: **PARTIAL** — BD-C001–BD-C015 and reuse TDs are
  **APPROVED**. Remaining items are `TBD — HUMAN DECISION REQUIRED`.
- This is not an ADR. Platform: ADR-0001, ADR-0002, AUTH-001 TD-001–TD-008.

These approvals do **not** authorize implementation, `feature/`,
`src/`, migrations, RLS policies, or Definition of Ready.

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

## Business decisions still open

Each of the following is **`TBD — HUMAN DECISION REQUIRED`**. Do not
treat examples in specs as decisions.

| ID      | Topic                                                       |
| ------- | ----------------------------------------------------------- |
| BD-T001 | Email validation rules                                      |
| BD-T002 | Phone validation rules                                      |
| BD-T003 | OIB validation rules                                        |
| BD-T004 | Whether email must be unique                                |
| BD-T005 | Whether phone must be unique                                |
| BD-T006 | Search behavior, fields, case sensitivity, partial vs exact |
| BD-T007 | Sorting                                                     |
| BD-T008 | Pagination                                                  |
| BD-T009 | Empty-state behavior                                        |
| BD-T010 | DELETE confirmation behavior                                |
| BD-T011 | Error messages                                              |
| BD-T012 | Success messages                                            |
| BD-T013 | UI layout                                                   |
| BD-T014 | Exact route names                                           |
| BD-T015 | Audit retention                                             |
| BD-T016 | Audit querying UI, if any                                   |
| BD-T017 | Handling of failed database operations                      |
| BD-T018 | Transaction behavior where relevant                         |

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

| Field          | Value                                                                                                                                                                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision       | Where Client rows live                                                                                                                                                                                                                                              |
| Proposed value | Logical PostgreSQL table for Clients, RLS as boundary                                                                                                                                                                                                               |
| Status         | **INTENT APPROVED** (BD-C006). Physical names, columns types, SQL: **TBD — HUMAN DECISION REQUIRED** at implementation-plan time is still too early for DoR if humans want names now; otherwise acceptable as non-blocking for spec. Exact schema names remain TBD. |

### TD-C006 Audit storage and write mechanism

| Field      | Value                                                                           |
| ---------- | ------------------------------------------------------------------------------- |
| Decision   | How audit records are stored and written                                        |
| Status     | **TBD — HUMAN DECISION REQUIRED** (schema, trigger vs application insert, etc.) |
| Constraint | Must satisfy BD-C007–BD-C012 without inventing extra features                   |

### TD-C007 Tooling

| Field          | Value                                                                  |
| -------------- | ---------------------------------------------------------------------- |
| Decision       | Test and quality tools                                                 |
| Approved value | Vitest, Playwright, ESLint, Prettier, gitleaks, GitHub Actions, Vercel |
| Status         | **APPROVED** (reuse)                                                   |

No new ADR. No conflict with ADR-0002.
