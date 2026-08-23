# FS-AUTH-001: Bank employee login and role-based access

- Work item: AUTH-001
- Requirement: [REQ-001](../../requirements/REQ-001.md)
- Issue: [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5)
- Spec PR: [#6](https://github.com/CrnkovicIvona/crm-ai-sdlc/pull/6)
- Decisions: [AUTH-001-decisions.md](../../decisions/AUTH-001-decisions.md)
  (BD-001–BD-008 **APPROVED**)
- Status: **RELEASED** (REL-003). Production smoke 5/5 PASSED
  2026-08-23 against `https://crm-ai-sdlc.vercel.app`. Live Auth e2e
  without secrets is SKIPPED (skipped ≠ passed).
- Author: Agent; business decisions recorded from human approval
  2026-08-21

This document is the **functional specification**: what AUTH-001 must
do. It does not describe frameworks, tables, RLS, or APIs.

## Feature

Bank employees must authenticate with email and password before using
BankCRM. Authenticated employees have exactly one role, ADMIN or
VIEWER, with different permitted CRM operations. Authenticated
employees must be able to log out. Unauthenticated people may use
only the login surface.

## Purpose

Prevent CRM use without login, apply ADMIN vs VIEWER permissions, and
allow an authenticated employee to end access.

## Business Context

Source: Issue #5 / REQ-001, clarified by BD-001–BD-008. There is no
approved CRM business module. Role permissions apply to future CRM
resources (BD-006); AUTH-001 does not add those resources.

## Scope

In scope:

- Email + password login (FR-006, FR-012, BD-001)
- Access after login (FR-001)
- CRM requires authentication (FR-002, BD-007)
- Unauthenticated access limited to the login surface (FR-010, BD-007)
- Two roles, exactly one per employee (FR-003, FR-011, BD-003)
- ADMIN permitted CRM read and write (FR-004, BD-006)
- VIEWER permitted CRM read only; no CRM write (FR-005, BD-006)
- Logout (FR-007, BD-005)
- After logout, authenticate again before CRM (FR-008, BD-007)
- Generic failure on failed authentication; no account enumeration
  (FR-009, BD-004)
- Session without usable profile/role is denied CRM (FR-013, BD-008)

Out of scope: see [Out of Scope](#out-of-scope).

## Actors

| Actor                  | Description                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------- |
| Bank employee          | Person who may log in with email and password                                       |
| Authenticated user     | Bank employee after successful login                                                |
| ADMIN                  | Authenticated user permitted CRM read and write (BD-006)                            |
| VIEWER                 | Authenticated user permitted CRM read only (BD-006)                                 |
| Unauthenticated person | Person who is not logged in; login surface only (BD-007)                            |
| BankCRM                | Grants or denies CRM access                                                         |
| External administrator | Provisions employees and roles outside the app (BD-002); not a UI actor in AUTH-001 |

## Preconditions

- BankCRM exists as a product the employee is trying to use.
- The employee has been provisioned **outside** AUTH-001 with email,
  password, and exactly one role (BD-002, BD-003).
- No CRM business resources exist yet (BD-006).

## Functional Requirements

| ID     | Statement                                                                                                    | Source              |
| ------ | ------------------------------------------------------------------------------------------------------------ | ------------------- |
| FR-001 | A bank employee who has logged in may access the CRM.                                                        | REQ-001.1           |
| FR-002 | A person who is not authenticated cannot access the CRM. Login is required before CRM access.                | REQ-001.1, .5       |
| FR-003 | The application has two user roles: ADMIN and VIEWER.                                                        | REQ-001.2           |
| FR-004 | An authenticated ADMIN may perform permitted CRM read operations and permitted CRM write operations.         | REQ-001.3, BD-006   |
| FR-005 | An authenticated VIEWER may perform permitted CRM read operations and must not perform CRM write operations. | REQ-001.4, BD-006   |
| FR-006 | Bank employees need to log into BankCRM before they can access the application.                              | REQ-001.1           |
| FR-007 | Users must be able to log out.                                                                               | REQ-001.6           |
| FR-008 | After logout, the user is not authenticated and cannot access the CRM until they log in again.               | REQ-001.5–6, BD-007 |
| FR-009 | Failed authentication presents a generic failure and must not reveal whether a particular account exists.    | BD-004              |
| FR-010 | Unauthenticated users may access only the login surface.                                                     | BD-007              |
| FR-011 | Each employee has exactly one application role, ADMIN or VIEWER, never both at once.                         | BD-003              |
| FR-012 | Bank employees authenticate with email and password.                                                         | BD-001              |
| FR-013 | If a session exists but there is no usable ADMIN or VIEWER profile, protected CRM access is denied.          | BD-008              |

FR-001 and FR-006 are two views of REQ-001 item 1.

AUTH-001 does not introduce CRM resources, so FR-004/FR-005 are the
**authorization model** for future resources (BD-006). They are not a
license to add modules in this increment.

## Business Rules

| ID     | Rule                                                                                             | Status          |
| ------ | ------------------------------------------------------------------------------------------------ | --------------- |
| BR-001 | CRM access is limited to authenticated users.                                                    | REQ-001, BD-007 |
| BR-002 | ADMIN may perform permitted CRM read and write operations.                                       | BD-006          |
| BR-003 | VIEWER may perform permitted CRM read operations and not write.                                  | BD-006          |
| BR-004 | An employee must log in before using the application.                                            | REQ-001         |
| BR-005 | Explicit logout ends authenticated CRM access.                                                   | BD-005, BD-007  |
| BR-006 | Exactly one role per employee: ADMIN or VIEWER.                                                  | BD-003          |
| BR-007 | AUTH-001 adds no CRM business resources; the permission model still applies to future resources. | BD-006          |
| BR-008 | Employee/account provisioning is outside AUTH-001.                                               | BD-002          |
| BR-009 | Failed login must not enumerate accounts.                                                        | BD-004          |
| BR-010 | Unauthenticated access is limited to the login surface.                                          | BD-007          |
| BR-011 | A session without a usable ADMIN or VIEWER profile is denied protected CRM access.               | BD-008          |

## Authentication Behavior

- Employees authenticate with **email and password** (FR-012, BD-001).
- After successful login they are authenticated (FR-001, FR-006).
- After logout they are not authenticated (FR-008, BD-005).
- SSO and MFA are out of scope (BD-001).
- Failed authentication: generic failure; no indication whether the
  account exists (FR-009, BD-004).
- Unauthenticated people may use only the login surface (FR-010).

This specification does not define exact field labels, password
complexity, or failure-message wording.

## Authorization Behavior

- Authorization applies only after authentication (FR-002).
- ADMIN: permitted CRM read and write (FR-004, BD-006).
- VIEWER: permitted CRM read; must not write (FR-005, BD-006).
- Exactly one role (FR-011, BD-003).
- No CRM modules in AUTH-001, so this increment does not add resource
  screens to exercise write vs read. Future features must follow
  BD-006.
- Enforcement mechanisms belong in the technical specification
  (TD-005), not here.

## Login Behavior

- Login uses email and password (FR-012).
- After login, CRM access is allowed (FR-001).
- Without login, CRM access is not allowed (FR-002); only the login
  surface is available (FR-010).
- Failed login: generic failure, no account enumeration (FR-009).
- Exact form layout and copy: not specified (does not block the
  increment if email, password, submit, and generic failure exist).

## Logout Behavior

- An authenticated user can log out (FR-007).
- After logout they are not authenticated (FR-008).
- After logout they cannot access CRM until they log in again
  (FR-008, BD-007).
- Control placement/confirmation: not specified (does not block if a
  logout action exists).

## Session Behavior

- Explicit logout terminates authenticated CRM access (BD-005, FR-008).
- Automatic session timeout: **deferred** (BD-005). Not in AUTH-001
  scope.
- Remember-me, multiple devices, concurrent sessions: out of scope.

## Error Behavior

- Failed authentication: generic message; must not reveal whether
  the account exists (FR-009, BD-004).
- Lockout: out of scope (BD-004).
- Exact wording: not specified.
- Network/system failure messaging: not specified; deferred, not an
  AUTH-001 permission-model change.

## Access Restrictions

- Unauthenticated: login surface only; no CRM (FR-002, FR-010).
- Session without usable profile/role: deny protected CRM (FR-013,
  BD-008).
- Authenticated ADMIN: permitted CRM read and write (FR-004).
- Authenticated VIEWER: permitted CRM read only (FR-005).

## Out of Scope

- SSO, MFA, password reset
- In-app provisioning
- Lockout
- Automatic session timeout
- Remember-me, multi-device, concurrent sessions
- CRM business modules and resource CRUD screens
- Exact UI copy, branding, languages
- Technical stack (see technical specification / ADRs)

## Open Questions

None that block specifying AUTH-001. Deferred items:

1. Automatic session expiration — deferred (BD-005).
2. Exact failure-message text — not specified (BD-004).
3. Back-button/cache after logout — not specified; re-authentication
   before CRM is required (FR-008).
4. Operational steps for external provisioning — outside AUTH-001
   (BD-002).
5. Concrete ADMIN/VIEWER screens — wait for future CRM resources
   (BD-006).

## Dependencies

- REQ-001 and approved BD-001–BD-008.
- Technical realization: technical specification and ADR-0001/0002.
- No other approved CRM features.

## Traceability

| FR     | REQ / BD          | US             | AC                     | BDD                                        | TC                          |
| ------ | ----------------- | -------------- | ---------------------- | ------------------------------------------ | --------------------------- |
| FR-001 | REQ-001.1         | US-001         | AC-001                 | Authenticated employee can access the CRM  | TC-001                      |
| FR-002 | REQ-001.1, .5     | US-001, US-002 | AC-002, AC-003         | CRM requires login; unauthenticated denied | TC-002                      |
| FR-003 | REQ-001.2         | US-003         | AC-004, AC-005, AC-011 | ADMIN and VIEWER access                    | TC-003, TC-004, TC-009      |
| FR-004 | REQ-001.3, BD-006 | US-003         | AC-004                 | ADMIN permitted read and write             | TC-003                      |
| FR-005 | REQ-001.4, BD-006 | US-003         | AC-005                 | VIEWER read only                           | TC-004                      |
| FR-006 | REQ-001.1         | US-001         | AC-001, AC-002         | Log in to access BankCRM                   | TC-001, TC-002              |
| FR-007 | REQ-001.6         | US-004         | AC-006                 | Authenticated user can log out             | TC-005                      |
| FR-008 | BD-007            | US-004         | AC-007                 | After logout CRM access is denied          | TC-006                      |
| FR-009 | BD-004            | US-001         | AC-009                 | Failed login is generic                    | TC-007                      |
| FR-010 | BD-007            | US-002         | AC-010                 | Unauthenticated only login surface         | TC-008                      |
| FR-011 | BD-003            | US-003         | AC-011                 | Exactly one role                           | TC-009                      |
| FR-012 | BD-001            | US-001         | AC-008                 | Email and password login                   | TC-001, TC-007              |
| FR-013 | BD-008            | US-002         | AC-012                 | Session without role denied CRM            | unit `require-auth.test.ts` |

Technical design: [../technical/AUTH-001.md](../technical/AUTH-001.md).
Implementation: `src/auth/`, `src/lib/auth.ts`, `src/lib/access.ts`,
`src/pages/LoginPage.tsx`, `src/pages/AppShell.tsx`,
`src/pages/AccessDeniedPage.tsx` (AUTH-001 shell only; no Client module).
