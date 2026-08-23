# AUTH-001 user stories

- Requirement: REQ-001
- Functional specification: `docs/specifications/functional/AUTH-001.md`
- Decisions: BD-001–BD-008 approved
- Work item: AUTH-001
- Issue: [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5)
- Status: **RELEASED** (REL-003). Production smoke 5/5 PASSED
  2026-08-23 against `https://crm-ai-sdlc.vercel.app`. Live Auth e2e
  without secrets is SKIPPED (skipped ≠ passed).

Do not add behavior that is not in REQ-001 or approved BD-\* items.

## US-001: Log in before using BankCRM

As a bank employee, I want to log into BankCRM with email and
password, so that I can access the application.

- Functional requirements: FR-001, FR-006, FR-009, FR-012

### Acceptance criteria

- AC-001: A bank employee who has logged in may access the CRM.
- AC-002: Logging in is required before accessing the CRM.
- AC-008: A bank employee authenticates with email and password
  (BD-001).
- AC-009: Failed authentication shows a generic failure and does not
  reveal whether a particular account exists (BD-004).

## US-002: Unauthenticated access is denied

As BankCRM, only authenticated users may access the CRM.

- Functional requirements: FR-002, FR-010, FR-013

### Acceptance criteria

- AC-003: A person who is not authenticated cannot access the CRM.
- AC-010: An unauthenticated person may access only the login surface
  (BD-007).
- AC-012: A session without a usable ADMIN or VIEWER profile cannot
  access protected CRM (BD-008).

## US-003: ADMIN and VIEWER roles

As BankCRM, each employee has exactly one role, ADMIN or VIEWER, with
different permitted CRM operations.

- Functional requirements: FR-003, FR-004, FR-005, FR-011

### Acceptance criteria

- AC-004: An authenticated ADMIN may perform permitted CRM read
  operations and permitted CRM write operations (BD-006).
- AC-005: An authenticated VIEWER may perform permitted CRM read
  operations and must not perform CRM write operations (BD-006).
- AC-011: Each employee has exactly one application role, ADMIN or
  VIEWER, never both (BD-003).

AUTH-001 does not introduce CRM business resources. AC-004 and AC-005
define the model future resources must follow (BD-006).

## US-004: Log out

As an authenticated bank employee, I want to log out, so that I end my
access to the CRM.

- Functional requirements: FR-007, FR-008

### Acceptance criteria

- AC-006: An authenticated user can log out.
- AC-007: After logout, the user is not authenticated and cannot access
  the CRM until they log in again (BD-005, BD-007).

Automatic session timeout is deferred (BD-005) and is not an
acceptance criterion.
