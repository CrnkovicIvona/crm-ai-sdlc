# AUTH-001 test cases

Issue: [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5). Risk: High (authentication / authorization).
Automation: `tests/e2e/auth.spec.ts`, `tests/e2e/roles.spec.ts`,
`tests/unit/errors.test.ts`, `tests/unit/require-auth.test.ts`.
Live-auth Playwright cases skip without `E2E_*` (SKIPPED ≠ PASSED).

## TC-001: Logged-in employee may access CRM

- AC: AC-001, AC-008
- BDD: Authenticated employee can access the CRM; email and password
- Type: e2e (`tests/e2e/auth.spec.ts`; skip without `E2E_ADMIN_*`)
- Risk: High

### Preconditions

A bank employee is provisioned out of band (BD-002) and is logged in
with email and password (BD-001).

### Steps

1. Access the CRM as that employee.

### Expected result

Access is allowed.

## TC-002: CRM access requires login

- AC: AC-002, AC-003
- BDD: Accessing the CRM requires login; unauthenticated cannot access
- Type: e2e (`tests/e2e/`)
- Risk: High

### Preconditions

The actor is not logged in / not authenticated.

### Steps

1. Access the CRM.

### Expected result

Access is denied.

## TC-003: ADMIN permitted CRM read and write

- AC: AC-004
- BDD: ADMIN has permitted read and write
- Type: e2e (`tests/e2e/`)
- Risk: High

### Preconditions

An authenticated user with role ADMIN only (BD-003).

### Steps

1. Use the CRM as that user.

### Expected result

The user may perform permitted CRM read and write operations
(BD-006). AUTH-001 has no CRM resource modules; when none exist,
record that resource-level writes are not observable yet and that the
authorization model is still AC-004.

## TC-004: VIEWER read-only CRM access

- AC: AC-005
- BDD: VIEWER has read-only access
- Type: e2e (`tests/e2e/`)
- Risk: High

### Preconditions

An authenticated user with role VIEWER only (BD-003).

### Steps

1. Use the CRM as that user.

### Expected result

The user may perform permitted CRM reads and must not perform CRM
writes (BD-006). Same observability note as TC-003 if no CRM
resources exist.

## TC-005: User can log out

- AC: AC-006
- BDD: Authenticated user can log out
- Type: e2e (`tests/e2e/`)
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
- Type: e2e (`tests/e2e/`)
- Risk: High

### Preconditions

An authenticated bank employee has logged out.

### Steps

1. Access the CRM.

### Expected result

Access is denied until the employee authenticates again (BD-007).

## TC-007: Failed login is generic and does not enumerate accounts

- AC: AC-009
- BDD: Failed authentication is generic
- Type: e2e (`tests/e2e/`)
- Risk: High
- Decisions: BD-004

### Preconditions

The person is not authenticated.

### Steps

1. Submit login credentials that are not accepted.

### Expected result

A generic authentication failure is shown. The outcome does not
reveal whether a particular account exists. The person is not
authenticated. Lockout is not required.

## TC-008: Unauthenticated access is only the login surface

- AC: AC-010
- BDD: Unauthenticated person may use only the login surface
- Type: e2e (`tests/e2e/`)
- Risk: High
- Decisions: BD-007

### Preconditions

The person is not authenticated.

### Steps

1. Use BankCRM without logging in.

### Expected result

Only the login surface is available. CRM functionality is not.

## TC-009: Employee has exactly one role

- AC: AC-011
- BDD: Employee has exactly one role
- Type: unit (`tests/unit/require-auth.test.ts`) and e2e (`tests/e2e/roles.spec.ts`; skip without seed)
- Risk: High
- Decisions: BD-003

### Preconditions

A provisioned bank employee (BD-002).

### Steps

1. Read the employee’s application role after authentication.

### Expected result

The role is exactly one of ADMIN or VIEWER, not both.

## Not in AUTH-001

- Playwright for a third Auth user without a profile (former TC-010).
  Random/unknown credentials are TC-007. Fail-closed without a usable
  role remains AC-012 / BD-008, verified by Vitest
  `decideAccess(true, null)` in `tests/unit/require-auth.test.ts`.
- Lockout, timeout, MFA, password reset
- In-app provisioning
- Automatic session expiration (BD-005 deferred)
