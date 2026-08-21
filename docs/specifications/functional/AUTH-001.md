# FS-AUTH-001: Bank employee login and role-based access

- Work item: AUTH-001
- Requirement: [REQ-001](../../requirements/REQ-001.md)
- Issue: [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5)
- Spec PR: [#6](https://github.com/CrnkovicIvona/crm-ai-sdlc/pull/6)
- Status: Draft (not Definition of Ready)
- Author: Agent (derived only from REQ-001 and Issue #5; not human-approved)

This document is the **functional specification**: what AUTH-001 must
do. It does not describe implementation, frameworks, database schema,
or APIs.

AUTH-001 already had user stories, acceptance criteria, BDD, and test
cases before this file existed. Those artifacts remain valid. New
features should write the functional specification after requirements
and before user stories.

## Feature

Bank employees must authenticate before using BankCRM. Authenticated
employees have one of two stated roles, ADMIN or VIEWER, with
different access. Authenticated employees must be able to log out.
Unauthenticated people must not access the CRM.

## Purpose

Prevent use of BankCRM without login, distinguish full CRM access
from read-only CRM access by role, and allow an authenticated
employee to end access.

## Business Context

Source: human business request on Issue #5, captured in REQ-001
(Draft). There is no other approved BankCRM product module. Role
meanings apply to “the CRM” as stated; they do not invent customers,
accounts, or other capabilities.

REQ-001 status is Draft. This functional specification is therefore
also Draft.

## Scope

In scope (stated in REQ-001):

- A bank employee can log in and then access the CRM (FR-001, FR-006).
- Accessing the CRM requires login (FR-002).
- Only authenticated users may access the CRM (FR-002).
- Two roles exist: ADMIN and VIEWER (FR-003).
- ADMIN has full access to the CRM (FR-004).
- VIEWER has read-only access (FR-005).
- An authenticated user can log out (FR-007).
- After logout the user is not authenticated and cannot access the CRM
  until they log in again (FR-008).

Out of scope: see [Out of Scope](#out-of-scope).

## Actors

| Actor                  | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| Bank employee          | Person who may log in to BankCRM                         |
| Authenticated user     | Bank employee after successful login                     |
| ADMIN                  | Authenticated user with full CRM access (as stated)      |
| VIEWER                 | Authenticated user with read-only CRM access (as stated) |
| Unauthenticated person | Person who is not logged in                              |
| BankCRM                | The application that grants or denies CRM access         |

Who provisions employees and assigns roles:
`TBD — HUMAN DECISION REQUIRED`.

## Preconditions

- BankCRM exists as a product the employee is trying to use.
- How a given person becomes a bank employee with a role in the
  system: `TBD — HUMAN DECISION REQUIRED`.
- How login is performed (identifier, secret, SSO, or other):
  `TBD — HUMAN DECISION REQUIRED`.
- Other CRM features against which “full” vs “read-only” can be
  observed: none specified yet (`TBD — HUMAN DECISION REQUIRED`).

## Functional Requirements

Derived only from REQ-001 stated requirements.

| ID     | Statement                                                                                      | REQ-001 item                           |
| ------ | ---------------------------------------------------------------------------------------------- | -------------------------------------- |
| FR-001 | A bank employee who has logged in may access the CRM.                                          | 1                                      |
| FR-002 | A person who is not authenticated cannot access the CRM. Login is required before CRM access.  | 1, 5                                   |
| FR-003 | The application has two user roles: ADMIN and VIEWER.                                          | 2                                      |
| FR-004 | An authenticated ADMIN user has full access to the CRM.                                        | 3                                      |
| FR-005 | An authenticated VIEWER user has read-only access.                                             | 4                                      |
| FR-006 | Bank employees need to log into BankCRM before they can access the application.                | 1                                      |
| FR-007 | Users must be able to log out.                                                                 | 6                                      |
| FR-008 | After logout, the user is not authenticated and cannot access the CRM until they log in again. | 5, 6 (as specified in US-004 / AC-007) |

FR-001 and FR-006 are two views of REQ-001 item 1 (allowed access after
login vs the need to log in). They are not separate product
capabilities.

FR-003 (two roles exist) has no dedicated acceptance criterion. It is
covered only through AC-004 and AC-005.

FR-008 is the combination of “only authenticated users may access the
CRM” and “users must be able to log out”, already recorded as AC-007.
Session timeout is **not** an FR.

## Business Rules

| ID     | Rule                                                                             | Status                                            |
| ------ | -------------------------------------------------------------------------------- | ------------------------------------------------- |
| BR-001 | CRM access is limited to authenticated users.                                    | Stated                                            |
| BR-002 | ADMIN has full access to the CRM.                                                | Stated; operational meaning of “full” is TBD      |
| BR-003 | VIEWER has read-only access.                                                     | Stated; operational meaning of “read-only” is TBD |
| BR-004 | An employee must log in before using the application.                            | Stated                                            |
| BR-005 | Logout ends authenticated access.                                                | Stated via FR-007 and FR-008                      |
| BR-006 | Whether one person may hold both ADMIN and VIEWER, or exactly one role.          | `TBD — HUMAN DECISION REQUIRED`                   |
| BR-007 | What VIEWER may read and what ADMIN may change while no other CRM modules exist. | `TBD — HUMAN DECISION REQUIRED`                   |
| BR-008 | Who creates accounts and assigns ADMIN vs VIEWER.                                | `TBD — HUMAN DECISION REQUIRED`                   |

## Authentication Behavior

- Unauthenticated people are not authenticated.
- After a successful login, the bank employee is authenticated
  (FR-001, FR-006).
- After logout, the employee is no longer authenticated (FR-008).
- Login method (password, SSO, other):
  `TBD — HUMAN DECISION REQUIRED`.
- Failed login behavior (message, retry, lockout):
  `TBD — HUMAN DECISION REQUIRED`.
- Whether the login surface is the only thing an unauthenticated
  person may see: `TBD — HUMAN DECISION REQUIRED`.

This specification does not define credential format, identity
provider, or MFA.

## Authorization Behavior

- Authorization applies only after authentication (FR-002).
- ADMIN: full access to the CRM (FR-004, BR-002).
- VIEWER: read-only access (FR-005, BR-003).
- Observable ADMIN vs VIEWER behavior on unspecified CRM modules:
  `TBD — HUMAN DECISION REQUIRED`.
- This is a business rule, not a technical enforcement mechanism.
  How the application or database enforces it belongs in the
  technical specification.

## Login Behavior

- A bank employee can become logged in (FR-006).
- After login, CRM access is allowed (FR-001).
- Without login, CRM access is not allowed (FR-002).
- Steps, fields, and success/failure copy:
  `TBD — HUMAN DECISION REQUIRED`.

## Logout Behavior

- An authenticated user can log out (FR-007).
- After logout they are not authenticated (FR-008).
- After logout they cannot access the CRM until they log in again
  (FR-008).
- Logout control placement and confirmation:
  `TBD — HUMAN DECISION REQUIRED`.

## Session Behavior

- Explicit logout ends the authenticated session for the purpose of
  CRM access (FR-008).
- Session timeout: `TBD — HUMAN DECISION REQUIRED` (not in REQ-001).
- Remember-me, multiple devices, concurrent sessions: out of scope
  (REQ-001).
- Browser back-button after logout:
  `TBD — HUMAN DECISION REQUIRED` (REQ-001 question 6).

## Error Behavior

No error messages or failed-login rules were stated.

- Invalid credentials: `TBD — HUMAN DECISION REQUIRED`
- Lockout: `TBD — HUMAN DECISION REQUIRED`
- Network / system failure messaging: `TBD — HUMAN DECISION REQUIRED`

Do not treat example error copy as a requirement.

## Access Restrictions

- Unauthenticated person: no CRM access (FR-002).
- Authenticated ADMIN: full CRM access (FR-004).
- Authenticated VIEWER: read-only CRM access (FR-005).
- Unauthenticated UI beyond login:
  `TBD — HUMAN DECISION REQUIRED`.

## Out of Scope

Not stated in the request; not approved:

- Identity proof method (password, SSO, or other)
- User and role provisioning
- Password reset, MFA, lockout, session duration
- Remember-me, multiple devices, concurrent sessions
- Any CRM business module beyond access control
- Unstated error messages, branding, or languages
- Technical stack (React, hosting, database, auth vendor) — not a
  functional requirement

## Open Questions

Copied from REQ-001. Do not implement until a human answers them.

1. How does a bank employee log in (identifier + secret, SSO, other)?
   `TBD — HUMAN DECISION REQUIRED`
2. Who creates employee accounts and assigns ADMIN vs VIEWER?
   `TBD — HUMAN DECISION REQUIRED`
3. Can one person have both roles, or exactly one?
   `TBD — HUMAN DECISION REQUIRED`
4. What happens when login fails (message, retry, lockout)?
   `TBD — HUMAN DECISION REQUIRED`
5. When is a session over besides explicit logout (timeout)?
   `TBD — HUMAN DECISION REQUIRED`
6. After logout, must the next access require login again including
   timeout and back-button cases?
   `TBD — HUMAN DECISION REQUIRED` (login-again after logout is
   specified as FR-008; timeout/back-button remain unspecified)
7. What must VIEWER be able to read, and what must ADMIN be able to
   change, while no other CRM features exist?
   `TBD — HUMAN DECISION REQUIRED`
8. Is the login surface the only thing an unauthenticated person may
   see? `TBD — HUMAN DECISION REQUIRED`

## Dependencies

- REQ-001 (Draft) must remain the business source. If REQ-001
  changes, this specification must be updated.
- User stories US-001–US-004 and AC-001–AC-007 already exist and map
  to the FRs above.
- No other approved CRM features.
- Technical realization depends on the technical specification and on
  accepted ADRs; those are not functional dependencies.

## Traceability

| FR     | REQ     | US             | AC             | BDD (docs/bdd/AUTH-001.md)                                      | TC             |
| ------ | ------- | -------------- | -------------- | --------------------------------------------------------------- | -------------- |
| FR-001 | REQ-001 | US-001         | AC-001         | Authenticated employee can access the CRM                       | TC-001         |
| FR-002 | REQ-001 | US-001, US-002 | AC-002, AC-003 | Accessing the CRM requires login; unauthenticated cannot access | TC-002         |
| FR-003 | REQ-001 | US-003         | AC-004, AC-005 | ADMIN and VIEWER access feature                                 | TC-003, TC-004 |
| FR-004 | REQ-001 | US-003         | AC-004         | ADMIN has full access                                           | TC-003         |
| FR-005 | REQ-001 | US-003         | AC-005         | VIEWER has read-only access                                     | TC-004         |
| FR-006 | REQ-001 | US-001         | AC-001, AC-002 | Log in to access BankCRM                                        | TC-001, TC-002 |
| FR-007 | REQ-001 | US-004         | AC-006         | Authenticated user can log out                                  | TC-005         |
| FR-008 | REQ-001 | US-004         | AC-007         | After logout CRM access is denied                               | TC-006         |

Technical design elements: [../technical/AUTH-001.md](../technical/AUTH-001.md).
Implementation: none (pre-implementation).
