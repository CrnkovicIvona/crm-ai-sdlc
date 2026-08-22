# Issue draft: CRM-001 Client records

Paste into a GitHub Feature issue. The agent must not create the Issue
unless a human asks. Specs in this folder are valid without an Issue
number; record the number here and in `requirement.md` when it exists.

## Title

`[FEATURE] CRM-001 Client records (ADMIN CRUD / VIEWER read+search)`

## Body

Work item: CRM-001  
Risk: High  
State: SPECIFIED (documentation in `docs/features/CRM-001/`)  
Not Ready. Not PLANNED. Do not implement.

BankCRM must support a single CRM entity: **Client**.

Approved (do not reopen):

- Fields: first name, last name, email, phone, OIB, created_at
- ADMIN: READ, CREATE, UPDATE, DELETE
- VIEWER: READ, SEARCH; no CREATE/UPDATE/DELETE
- VIEWER sees all Client fields (no field-level security)
- RLS is the database authorization boundary
- Audit trail for successful CREATE, UPDATE, DELETE (append-only via
  the CRM application). READ and failed attempts are not audited.

Reuse AUTH-001 login/roles. Do not recreate AUTH-001.

Unresolved items remain `TBD — HUMAN DECISION REQUIRED` in
`docs/features/CRM-001/`.
