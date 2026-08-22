# CRM-001 user stories

- Work item: CRM-001
- Requirement: REQ-CRM-001
- Functional specification: [functional-spec.md](functional-spec.md)
- Status: Specified (not Ready)
- Owner (draft): Agent as BA
- Approval: Human DoR not recorded
- Traceability: [traceability.md](traceability.md)

Do not add behavior that is not in the FS or approved BD-C\* items.

## US-C001: Client is the CRM entity

As a bank employee, I work with Client records that have the approved
fields, so that CRM-001 stays limited to one entity.

- FR: FR-C001, FR-C002

### Acceptance criteria

- AC-C001: CRM-001 exposes Client as the CRM entity and does not
  introduce other CRM entities.
- AC-C002: A Client includes first name, last name, email, phone, OIB,
  and created_at, and does not include additional business fields.

## US-C002: ADMIN manages Clients

As an ADMIN, I need to read, create, update, and delete Clients.

- FR: FR-C003

### Acceptance criteria

- AC-C003: An authenticated ADMIN can READ Client records.
- AC-C004: An authenticated ADMIN can CREATE a Client.
- AC-C005: An authenticated ADMIN can UPDATE a Client.
- AC-C006: An authenticated ADMIN can DELETE a Client.

Exact validation, uniqueness, confirmation, and copy:
`TBD — HUMAN DECISION REQUIRED`.

## US-C003: VIEWER reads and searches

As a VIEWER, I need to read and search Clients without changing them.

- FR: FR-C004, FR-C005

### Acceptance criteria

- AC-C007: An authenticated VIEWER can READ Client records.
- AC-C008: An authenticated VIEWER can SEARCH Client records.
- AC-C009: An authenticated VIEWER cannot CREATE a Client.
- AC-C010: An authenticated VIEWER cannot UPDATE or DELETE a Client.
- AC-C011: An authenticated VIEWER can see all Client fields (no
  field-level hiding).

Search matching rules: `TBD — HUMAN DECISION REQUIRED` (BD-T006).
AC-C008 requires that a search capability exists for VIEWER; it does
not define fields or matching.

## US-C004: Database authorization

As BankCRM, Client authorization must hold even if the UI is bypassed.

- FR: FR-C006

### Acceptance criteria

- AC-C012: Client CREATE/UPDATE/DELETE authorization is enforced at
  the database layer, not only by hiding UI controls.

## US-C005: Audit trail for successful writes

As BankCRM, successful Client writes are recorded for accountability.

- FR: FR-C007–FR-C010, FR-C012, FR-C013

### Acceptance criteria

- AC-C013: A successful Client CREATE produces an audit record.
- AC-C014: A successful Client UPDATE produces an audit record that
  includes previous value and new value.
- AC-C015: A successful Client DELETE produces an audit record.
- AC-C016: Each such audit record includes actor/user ID, action,
  entity, entity ID, and timestamp.
- AC-C018: A successful Client READ does not produce an audit record
  required by CRM-001.
- AC-C019: An unsuccessful or unauthorized Client attempt does not
  produce an audit record required by CRM-001.

## US-C006: Audit is append-only in the app

As BankCRM, nobody may change audit history through the CRM
application.

- FR: FR-C011

### Acceptance criteria

- AC-C017: ADMIN and VIEWER cannot modify or delete audit records
  through the CRM application.
