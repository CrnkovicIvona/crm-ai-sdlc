# REQ-CRM-001: Client records in BankCRM

- Work item: CRM-001
- Issue: **none** (see [issue-draft.md](issue-draft.md))
- Status: **`ON_MAIN` — not `RELEASED`** (REL-004). Product +
  ClientProduct + soft-delete are in scope. Human QA on `test`
  2026-08-24. Production smoke not executed.
- Owner (draft): Agent as BA
- Owner (approve): Human PO/BA
- Source: Human-approved CRM-001 business decisions (this task)
- Risk: High
- Approval: BD-C001–BD-C018 **APPROVED**. Gate 1 pack:
  [dor-gate-1.md](dor-gate-1.md). Gate 2 revision:
  [implementation-plan.md](implementation-plan.md).

## Problem

Authenticated bank employees need to work with Client records in
BankCRM after login (AUTH-001). CRM-001 is the first CRM business
module. It must respect ADMIN vs VIEWER and record an audit trail for
successful writes.

## Stated requirements (approved; not TBD)

1. CRM-001 entities are **Client**, fixed **Product** catalog, and
   **ClientProduct** assignments. Products are optional on a Client.
2. Client business fields are exactly: first name, last name, email,
   phone, OIB, created_at.
3. ADMIN may READ, CREATE, UPDATE, and **soft-DELETE** Clients, and
   assign catalog products on create/edit. UI delete does not destroy
   the row or its audit history. Restore is out of scope.
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

- Additional Client fields unless a human marks a TBD and then
  approves a field
- Product admin UI, contract numbers, rates, balances, limits,
  currency, schedules, start/end dates, restore of soft-deleted Clients
- Field-level security
- Audit management UI (query/export/retention screens) unless later
  approved
- Auditing READ or failed/unauthorized attempts
- AUTH-001 login/provisioning (reuse existing AUTH-001)
- DASH-001
- Agent apply SQL to production or merge `main`

## Open questions

None blocking. BD-T001–BD-T018 were accepted at Gate 1. Product catalog,
optional ClientProduct, and soft-delete were accepted in the Gate 2
revision (2026-08-23).

## Traceability

- Functional specification: [functional-spec.md](functional-spec.md)
- Technical specification: [technical-spec.md](technical-spec.md)
- Decisions: [decisions.md](decisions.md)
- Stories: [user-stories.md](user-stories.md)
- Tests: [test-plan.md](test-plan.md), [test-cases.md](test-cases.md)
- Matrix: [../../traceability/matrix.md](../../traceability/matrix.md)
