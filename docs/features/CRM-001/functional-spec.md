# FS-CRM-001: Client records

- Work item: CRM-001
- Requirement: [requirement.md](requirement.md)
- Issue: none yet
- Status: Specified (not Definition of Ready)
- Owner (draft): Agent as BA
- Source: [decisions.md](decisions.md)
- Open questions: TBD items in the decision log
- Approval: BD-C001–BD-C015 approved; DoR not recorded
- Traceability: [traceability.md](traceability.md)

This document answers **WHAT** the system must do. It does not specify
Vite, SQL, file paths, or RLS policy text. It **does** require that
authorization remain enforced at the database layer.

## Feature

Authenticated employees work with **Client** records. ADMIN may read
and change them. VIEWER may read and search them. Successful writes
are audited. Audit records cannot be changed through the CRM app.

## Purpose

Provide the first CRM business module after AUTH-001 without expanding
into other entities or AUTH-001 itself.

## Business Context

Depends on AUTH-001 login, roles, fail-closed access, and the
permission model. CRM-001 does not redefine login.

## Scope

In scope: Client entity and fields (FR-C001, FR-C002); ADMIN CRUD
(FR-C003); VIEWER read and search (FR-C004); full field visibility
(FR-C005); database authorization boundary (FR-C006); audit of
successful CREATE/UPDATE/DELETE (FR-C007–FR-C010); append-only audit
(FR-C011); no READ or failed-attempt audit (FR-C012, FR-C013).

Out of scope: see below.

## Actors

| Actor                       | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| ADMIN                       | Authenticated employee; Client READ/CREATE/UPDATE/DELETE |
| VIEWER                      | Authenticated employee; Client READ/SEARCH only          |
| Unauthenticated person      | No Client access (AUTH-001)                              |
| Session without usable role | No Client access (AUTH-001 BD-008)                       |

## Preconditions

- Employee is authenticated with a usable ADMIN or VIEWER profile
  (AUTH-001).
- Identities are provisioned outside the app (AUTH-001 BD-002).

## Functional Requirements

| ID      | Statement                                                                                                                                                 | Source           |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| FR-C001 | CRM-001 has exactly one CRM entity: Client.                                                                                                               | BD-C001          |
| FR-C002 | A Client has exactly these business fields: first name, last name, email, phone, OIB, created_at.                                                         | BD-C002          |
| FR-C003 | An authenticated ADMIN may READ, CREATE, UPDATE, and DELETE Client records.                                                                               | BD-C003          |
| FR-C004 | An authenticated VIEWER may READ and SEARCH Client records and must not CREATE, UPDATE, or DELETE them.                                                   | BD-C004          |
| FR-C005 | A VIEWER may see all Client fields. There are no field-level restrictions.                                                                                | BD-C005, BD-C014 |
| FR-C006 | Authorization for Client data must be enforced at the database layer. Hiding controls in the UI is not sufficient.                                        | BD-C006          |
| FR-C007 | A successful CREATE of a Client produces an audit record.                                                                                                 | BD-C007          |
| FR-C008 | A successful UPDATE of a Client produces an audit record that includes previous value and new value.                                                      | BD-C007, BD-C009 |
| FR-C009 | A successful DELETE of a Client produces an audit record.                                                                                                 | BD-C007          |
| FR-C010 | Each audit record contains at least actor/user ID, action, entity, entity ID, and timestamp.                                                              | BD-C008          |
| FR-C011 | Users, including ADMIN, must not modify or delete audit records through the CRM application. The trail is append-only from the application’s perspective. | BD-C010, BD-C015 |
| FR-C012 | VIEW/READ operations are not audited in CRM-001.                                                                                                          | BD-C011          |
| FR-C013 | Unsuccessful or unauthorized attempts are not audited in CRM-001.                                                                                         | BD-C012          |

## Business Rules

| ID      | Rule                                                 | Status   |
| ------- | ---------------------------------------------------- | -------- |
| BR-C001 | Only the Client entity exists in this increment.     | Approved |
| BR-C002 | Client fields are the approved six only.             | Approved |
| BR-C003 | ADMIN = READ + CREATE + UPDATE + DELETE.             | Approved |
| BR-C004 | VIEWER = READ + SEARCH; no CUD.                      | Approved |
| BR-C005 | No field-level security.                             | Approved |
| BR-C006 | Database-layer authorization is mandatory.           | Approved |
| BR-C007 | Audit successful CUD only, with required attributes. | Approved |
| BR-C008 | Application must not offer audit mutate/delete.      | Approved |

Validation, uniqueness, search matching, pagination, copy, and
confirmation are **not** business rules until a human decides them.

## Authorization Behavior

- Unauthenticated and fail-closed sessions: no Client access
  (AUTH-001).
- ADMIN: FR-C003.
- VIEWER: FR-C004, FR-C005.
- Enforcement must not rely on the UI alone (FR-C006). How RLS is
  implemented is in the technical specification (intent only).

## Client Behavior

- CREATE/UPDATE/DELETE: ADMIN only (FR-C003, FR-C004).
- READ: ADMIN and VIEWER.
- SEARCH: VIEWER (FR-C004). Whether ADMIN also searches, which fields
  match, and how matching works: `TBD — HUMAN DECISION REQUIRED`
  (BD-T006). Do not invent SEARCH-only-for-VIEWER as excluding ADMIN
  from finding Clients; ADMIN READ is approved. SEARCH as a VIEWER
  capability is approved; ADMIN search UX is TBD.
- Field meaning beyond names: not specified (validation TBD).

## Audit Behavior

- Record successful CREATE, UPDATE, DELETE (FR-C007–FR-C009).
- Minimum attributes (FR-C010); UPDATE includes previous and new
  values (FR-C008).
- Append-only via the application (FR-C011).
- Do not audit READ (FR-C012) or failed/unauthorized attempts
  (FR-C013).
- Storage schema and write mechanism: technical TBD, not specified
  here as HOW.

## Error Behavior

Exact messages: `TBD — HUMAN DECISION REQUIRED` (BD-T011). Failed
database operations: TBD (BD-T017). Do not invent copy.

## Access Restrictions

- VIEWER must not CREATE, UPDATE, DELETE even if UI were compromised
  (FR-C004, FR-C006).
- No audit mutation through the app (FR-C011).

## Out of Scope

- Other entities; extra Client fields; field-level security
- AUTH-001 implementation
- Audit query/admin UI unless BD-T016 is later approved
- Auditing READ or failures
- SQL, frameworks, file trees

## Open Questions

See BD-T001–BD-T018 in [decisions.md](decisions.md). All
`TBD — HUMAN DECISION REQUIRED`.

Blocking for **Ready** if a human requires them before planning:
validation/uniqueness (BD-T001–T005) and DELETE confirmation
(BD-T010) are likely needed to plan tests without inventing rules.
Search matching (BD-T006) is needed to plan SEARCH tests beyond
“some search exists”. The agent must not fill them in. The agent
must **stop** at DoR until a human either answers or explicitly
accepts them as non-blocking.

## Dependencies

- AUTH-001 **READY** (login, roles, fail-closed); not implemented until `PLANNED`
- ADR-0002 / AUTH-001 technical platform (HOW, not WHAT)

## Traceability

| FR      | BD      | US      | AC              | BDD                        | TC              |
| ------- | ------- | ------- | --------------- | -------------------------- | --------------- |
| FR-C001 | BD-C001 | US-C001 | AC-C001         | Client is the only entity  | TC-C001         |
| FR-C002 | BD-C002 | US-C001 | AC-C002         | Client fields              | TC-C002         |
| FR-C003 | BD-C003 | US-C002 | AC-C003–AC-C006 | ADMIN CRUD                 | TC-C003–TC-C006 |
| FR-C004 | BD-C004 | US-C003 | AC-C007–AC-C010 | VIEWER read/search; no CUD | TC-C007–TC-C010 |
| FR-C005 | BD-C005 | US-C003 | AC-C011         | VIEWER sees all fields     | TC-C011         |
| FR-C006 | BD-C006 | US-C004 | AC-C012         | DB authorization boundary  | TC-C012         |
| FR-C007 | BD-C007 | US-C005 | AC-C013         | Audit CREATE               | TC-C013         |
| FR-C008 | BD-C009 | US-C005 | AC-C014         | Audit UPDATE values        | TC-C014         |
| FR-C009 | BD-C007 | US-C005 | AC-C015         | Audit DELETE               | TC-C015         |
| FR-C010 | BD-C008 | US-C005 | AC-C016         | Audit minimum attributes   | TC-C016         |
| FR-C011 | BD-C010 | US-C006 | AC-C017         | Append-only                | TC-C017         |
| FR-C012 | BD-C011 | US-C005 | AC-C018         | READ not audited           | TC-C018         |
| FR-C013 | BD-C012 | US-C005 | AC-C019         | Failures not audited       | TC-C019         |

Technical design: [technical-spec.md](technical-spec.md).
Implementation: none.
