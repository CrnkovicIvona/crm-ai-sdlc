# Issue draft: CRM-001 Client records

Paste into a GitHub Feature issue. The agent **cannot** create the
Issue with the current GitHub token. Specs in this folder are valid
without an Issue number; record the number here, in
`requirement.md`, and in `dor-gate-1.md` when it exists.

Gate 1 pack: [dor-gate-1.md](dor-gate-1.md).

## Title

`[FEATURE] CRM-001 Client records (ADMIN CRUD / VIEWER read+search)`

## Body

Work item: CRM-001
Risk: High
State: SPECIFIED (documentation in `docs/features/CRM-001/`)
Gate: **1 — Requirements / DoR** (human). Not Ready. Not PLANNED. Do
not implement.

BankCRM must support a single CRM entity: **Client**.

Approved (do not reopen):

- Fields: first name, last name, email, phone, OIB, created_at
- ADMIN: READ, CREATE, UPDATE, DELETE
- VIEWER: READ, SEARCH; no CREATE/UPDATE/DELETE
- VIEWER sees all Client fields (no field-level security)
- RLS is the database authorization boundary
- Audit trail for successful CREATE, UPDATE, DELETE (append-only via
  the CRM application). READ and failed attempts are not audited.

Reuse AUTH-001 login/roles (AUTH-001 is RELEASED). Do not recreate
AUTH-001.

Review pack: `docs/features/CRM-001/dor-gate-1.md`

Unresolved items remain `TBD — HUMAN DECISION REQUIRED` until the PO
answers them or accepts the recommended defaults in that pack.

### PO/BA — pick one comment after opening this Issue

**Option A — Ready with recommended defaults**

```text
Gate 1: I accept docs/features/CRM-001/dor-gate-1.md §5.1 and §5.2
recommended defaults as product decisions.
CRM-001 is READY.
Do not implement. Next: implementation plan (Gate 2) only.
```

**Option B — Ready with my own TBD answers**

```text
Gate 1 TBD answers:
BD-T001:
BD-T002:
BD-T003:
BD-T004:
BD-T005:
BD-T006:
BD-T007:
BD-T008:
BD-T009:
BD-T010:
BD-T011:
BD-T012:
BD-T013:
BD-T014:
BD-T015:
BD-T016:
BD-T017:
BD-T018:
TD-C005:
TD-C006:
CRM-001 is READY.
Do not implement. Next: implementation plan (Gate 2) only.
```

**Option C — stay SPECIFIED**

```text
Gate 1: CRM-001 stays SPECIFIED. Not READY.
```

Do not treat silence as Ready.
