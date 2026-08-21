# AUTH-001 user stories

- Requirement: REQ-001
- Work item (proposed): AUTH-001
- Issue: [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5)
- Status: Draft

Do not add behavior that is not in REQ-001.

## US-001: Log in before using BankCRM

As a bank employee, I want to log into BankCRM, so that I can access
the application.

### Acceptance criteria

- AC-001: A bank employee who has logged in may access the CRM.
- AC-002: Logging in is required before accessing the CRM.

## US-002: Unauthenticated access is denied

As BankCRM, only authenticated users may access the CRM.

### Acceptance criteria

- AC-003: A person who is not authenticated cannot access the CRM.

## US-003: ADMIN and VIEWER roles

As BankCRM, users have role ADMIN or VIEWER, with different access.

### Acceptance criteria

- AC-004: An authenticated ADMIN user has full access to the CRM.
- AC-005: An authenticated VIEWER user has read-only access to the CRM.

What “full” and “read-only” mean for screens or data that are not yet
specified is **TBD (human)** (REQ-001 open questions).

## US-004: Log out

As an authenticated bank employee, I want to log out, so that I end my
access to the CRM.

### Acceptance criteria

- AC-006: An authenticated user can log out.
- AC-007: After logout, the user is not authenticated and cannot access
  the CRM until they log in again.

AC-007 follows “only authenticated users may access the CRM” plus
“users must be able to log out”. Session timeout is **TBD (human)**
and is not an acceptance criterion.
