# AUTH-001 test cases

Issue: [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5). Risk: High (authentication / authorization).
Automation: `not automated` (no application yet).

## TC-001: Logged-in employee may access CRM

- AC: AC-001
- BDD: Authenticated employee can access the CRM
- Type: e2e (when an app exists); until then manual / not executed
- Risk: High

### Preconditions

A bank employee is logged in. How they logged in is TBD (human).

### Steps

1. Access the CRM as that employee.

### Expected result

Access is allowed.

## TC-002: CRM access requires login

- AC: AC-002, AC-003
- BDD: Accessing the CRM requires login; unauthenticated cannot access
- Type: e2e (when an app exists)
- Risk: High

### Preconditions

The actor is not logged in / not authenticated.

### Steps

1. Access the CRM.

### Expected result

Access is denied.

## TC-003: ADMIN has full CRM access

- AC: AC-004
- BDD: ADMIN has full access
- Type: e2e (when an app exists)
- Risk: High

### Preconditions

An authenticated user with role ADMIN.

### Steps

1. Use the CRM as that user.

### Expected result

The user has full access to the CRM, as specified. Exact ADMIN
actions are TBD (human) until other features exist.

## TC-004: VIEWER has read-only CRM access

- AC: AC-005
- BDD: VIEWER has read-only access
- Type: e2e (when an app exists)
- Risk: High

### Preconditions

An authenticated user with role VIEWER.

### Steps

1. Use the CRM as that user.

### Expected result

The user has read-only access. Exact VIEWER reads vs denied writes
are TBD (human) until other features exist.

## TC-005: User can log out

- AC: AC-006
- BDD: Authenticated user can log out
- Type: e2e (when an app exists)
- Risk: High

### Preconditions

An authenticated bank employee.

### Steps

1. Log out.

### Expected result

The employee is no longer authenticated.

## TC-006: After logout, CRM access is denied

- AC: AC-007
- BDD: After logout CRM access is denied
- Type: e2e (when an app exists)
- Risk: High

### Preconditions

An authenticated bank employee has logged out.

### Steps

1. Access the CRM.

### Expected result

Access is denied.

## Not written (not in REQ-001)

- Invalid credentials, lockout, timeout, MFA, password reset
- How roles are assigned
