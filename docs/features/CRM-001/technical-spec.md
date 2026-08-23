# TS-CRM-001: Client records

- Work item: CRM-001
- Functional specification: [functional-spec.md](functional-spec.md)
- Requirement: [requirement.md](requirement.md)
- Status: Ready for planning (not implemented)
- Owner (draft): Agent as architect
- Source: AUTH-001 TS, ADR-0001, ADR-0002, [decisions.md](decisions.md)
- Open questions: TD-C005 physical names, TD-C006 audit mechanism,
  BD-T014 routes
- Approval: Platform reuse approved; audit HOW is TBD
- Traceability: [traceability.md](traceability.md)

This document answers **HOW** approved WHAT fits the **existing**
architecture. It does not create `src/`, tables, RLS policies, or
endpoints. It does not invent business rules.

## Architecture

Reuse AUTH-001. Do not reopen ADR-0002. Do not add Next.js, GraphQL,
Redux, microservices, or a custom REST API for CRM-001.

| Decision                                                        | Status               | Source                   |
| --------------------------------------------------------------- | -------------------- | ------------------------ |
| Vite + React + TypeScript                                       | Accepted             | ADR-0002, TD-C001        |
| React Router; protected CRM routes                              | Accepted             | AUTH-001 TD-002, TD-C002 |
| Supabase Auth email/password                                    | Accepted             | AUTH-001 TD-003          |
| `profiles` ADMIN \| VIEWER; fail-closed                         | Accepted             | AUTH-001 TD-004, TD-008  |
| UI UX + PostgreSQL RLS data boundary                            | Accepted             | AUTH-001 TD-005, BD-C006 |
| Supabase client; no custom REST                                 | Accepted for CRM-001 | AUTH-001 TD-006, TD-C003 |
| Session via Supabase Auth                                       | Accepted             | AUTH-001 TD-007          |
| Vitest, Playwright, ESLint, Prettier, gitleaks, Actions, Vercel | Accepted             | ADR-0001, TD-C007        |

No application source. No Supabase project configured by this spec.

### Layers (logical)

1. Presentation — Client list/detail/forms behind AUTH-001 guards.
2. Client application logic — Supabase client calls for Clients and
   audit **if** the approved mechanism is client-visible; otherwise
   server-side DB behavior. Mechanism: TBD (TD-C006).
3. BaaS — Supabase PostgreSQL. RLS is the authorization boundary for
   Client rows.
4. Data — logical Client store + logical audit store. **No migration
   in this phase.**

### Modules (logical; no file paths)

| Module               | Responsibility                                    |
| -------------------- | ------------------------------------------------- |
| AUTH-001 access gate | Session + usable role before any Client UI        |
| Client read/search   | SELECT for ADMIN and VIEWER                       |
| Client write         | INSERT/UPDATE/DELETE for ADMIN only               |
| Audit append         | Record successful CUD; no app-level mutate/delete |
| Role-aware UI        | Hide write controls from VIEWER (UX only)         |

Physical paths belong in the implementation plan after Ready.

## Frontend

React SPA (Vite). React Router protected routes. Exact route names:
`TBD — HUMAN DECISION REQUIRED` (BD-T014). Layout: TBD (BD-T013).

VIEWER UI must not present working CREATE/UPDATE/DELETE. That is UX.
Security is RLS (below).

## Supabase

Same Auth and client as AUTH-001. Client data access uses the user
session (anon key). Service role must never ship in the client.

## Database

Logical Client entity with business fields: first name, last name,
email, phone, OIB, created_at. Column types, nullability, uniqueness,
and table name: `TBD — HUMAN DECISION REQUIRED`.

Logical audit records with at least: actor/user ID, action, entity,
entity ID, timestamp; UPDATE also previous and new values. Schema:
TBD (TD-C006).

Do not invent extra SQL in application code. Physical names are in
the implementation plan (TD-C005).

Logical Product catalog (six rows) and ClientProduct assignments.
`clients.deleted_at` / `deleted_by` support soft-delete. SELECT of
active Clients requires `deleted_at is null`. Soft-delete UPDATE is
audited as DELETE.

## Row Level Security

**Intent (mandatory):**

- Authenticated ADMIN may SELECT, INSERT, UPDATE, DELETE Client rows.
- Authenticated VIEWER may SELECT Client rows (and use search that
  reads those rows). VIEWER must not INSERT, UPDATE, or DELETE Client
  rows.
- Unauthenticated and fail-closed users must not read or write Client
  rows.
- Audit records: application users must not UPDATE or DELETE them.
  INSERT of audit rows must be possible for successful ADMIN CUD
  (exact grant path TBD with TD-C006). VIEWER must not insert fake
  audit rows if that would violate append-only integrity — **exact
  insert privilege: TBD — HUMAN DECISION REQUIRED** without blocking
  the _intent_ that users cannot mutate history.

Do **not** invent SQL policies in this specification.

## API / RPC / Data Access

Supabase client (and/or database triggers if later approved). No REST
or GraphQL layer for CRM-001.

## Security

| Control              | CRM-001 treatment                                    |
| -------------------- | ---------------------------------------------------- |
| Authentication       | AUTH-001; no Client access without session + role    |
| Authorization        | UI + RLS; UI insufficient                            |
| Fail-closed          | AUTH-001 BD-008 still applies to Client routes       |
| PII                  | email, phone, OIB; no extra fields                   |
| DELETE               | ADMIN only; UI confirm; **soft-delete** (no restore) |
| Audit                | Successful CUD; append-only in app; no failure audit |
| Privilege escalation | VIEWER must not become ADMIN via client tampering    |
| Secrets              | No service role in client                            |

Security review required before `READY_FOR_PR` of a future
implementation.

## Testing Architecture

| Layer            | Tool               | CRM-001                                         |
| ---------------- | ------------------ | ----------------------------------------------- |
| Unit             | Vitest             | Role-aware UI helpers                           |
| Integration      | Vitest             | RLS deny VIEWER writes; audit insert on CUD     |
| E2E              | Playwright         | TC-C001–TC-C011, TC-C017, TC-C020–TC-C022 as UI |
| Format / secrets | Prettier, gitleaks | Foundation CI                                   |

No tests executed in this phase.

## Dependencies

AUTH-001 specs (not re-copied). ADR-0001, ADR-0002.
`docs/architecture/environments.md`. Configured Supabase is a
**runtime** dependency of a future `PLANNED` implementation, not of
this documentation change.

## Open Technical Questions

All `TBD — HUMAN DECISION REQUIRED` unless noted reuse:

1. Physical table/column names and types (TD-C005)
2. Audit storage and write mechanism (TD-C006)
3. Exact routes (BD-T014)
4. Whether CREATE+audit is one transaction (BD-T018)
5. Failed DB operation UX (BD-T017)
6. Audit insert privileges vs VIEWER (see RLS intent)

Do not create an ADR for Client columns.

## Traceability

| TDE      | Maps to FR                         | Notes                                       |
| -------- | ---------------------------------- | ------------------------------------------- |
| TDE-C001 | FR-C001, FR-C002, FR-C014, FR-C015 | Client + Product + ClientProduct model      |
| TDE-C002 | FR-C003, FR-C004, FR-C005, FR-C016 | Role-aware Client UI (UX), soft-delete      |
| TDE-C003 | FR-C003, FR-C004, FR-C006, FR-C015 | RLS intent on Client and ClientProduct data |
| TDE-C004 | FR-C007–FR-C013                    | Logical audit model                         |
| TDE-C005 | FR-C011                            | Append-only audit (no app mutate)           |
| TDE-C006 | FR-C004, FR-C006                   | VIEWER data-path deny                       |
| TDE-C007 | AUTH-001 FR-013                    | Reuse fail-closed gate                      |
| TDE-C008 | FR-C001–FR-C016                    | Playwright/Vitest TC-C001–TC-C022           |

Presentation restyle: proposals only until PO selection —
[ui-ux-proposal.md](ui-ux-proposal.md). Keep `data-testid` values.
Do not add a CSS framework (ADR-0002).
