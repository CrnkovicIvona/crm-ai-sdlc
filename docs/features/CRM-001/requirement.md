# REQ-CRM-001: Client records in BankCRM

- Work item: CRM-001
- Issue: **none** (see [issue-draft.md](issue-draft.md))
- Status: Specified (not Definition of Ready)
- Owner (draft): Agent as BA
- Owner (approve): Human PO/BA
- Source: Human-approved CRM-001 business decisions (this task)
- Risk: High
- Approval: Business decisions BD-C001–BD-C015 **APPROVED**. Remaining
  items are `TBD — HUMAN DECISION REQUIRED`. Human DoR **not** given.

## Problem

Authenticated bank employees need to work with Client records in
BankCRM after login (AUTH-001). CRM-001 is the first CRM business
module. It must respect ADMIN vs VIEWER and record an audit trail for
successful writes.

## Stated requirements (approved; not TBD)

1. The only CRM entity in CRM-001 is **Client**.
2. Client business fields are exactly: first name, last name, email,
   phone, OIB, created_at.
3. ADMIN may READ, CREATE, UPDATE, DELETE Clients.
4. VIEWER may READ and SEARCH Clients. VIEWER may not CREATE, UPDATE,
   or DELETE.
5. VIEWER may see all Client fields. There is no field-level security.
6. Authorization must be enforced at the database layer (RLS). UI
   hiding alone is not sufficient.
7. Successful CREATE, UPDATE, and DELETE of a Client must produce an
   audit record. Minimum: actor/user ID, action, entity, entity ID,
   timestamp. UPDATE must also record previous value and new value.
8. The audit trail is append-only from the CRM application. Users,
   including ADMIN, must not modify or delete audit records through
   the application.
9. READ/VIEW is not audited. Failed or unauthorized attempts are not
   audited in CRM-001.

## Out of scope

- Additional CRM entities
- Additional Client fields unless a human marks a TBD and then
  approves a field
- Field-level security
- Audit management UI (query/export/retention screens) unless later
  approved
- Auditing READ or failed/unauthorized attempts
- AUTH-001 login/provisioning (reuse existing AUTH-001)
- DASH-001
- Implementation, `src/`, migrations, RLS SQL, deploy

## Open questions

All listed in [decisions.md](decisions.md) as TBD. Examples: email /
phone / OIB validation, uniqueness, search behavior, sorting,
pagination, empty state, DELETE confirmation, messages, UI layout,
routes, audit storage schema, audit write mechanism, retention, audit
query UI, failed database operations, transactions.

The agent must not answer these as product truth.

## Traceability

- Functional specification: [functional-spec.md](functional-spec.md)
- Technical specification: [technical-spec.md](technical-spec.md)
- Decisions: [decisions.md](decisions.md)
- Stories: [user-stories.md](user-stories.md)
- Tests: [test-plan.md](test-plan.md), [test-cases.md](test-cases.md)
- Matrix: [../../traceability/matrix.md](../../traceability/matrix.md)
