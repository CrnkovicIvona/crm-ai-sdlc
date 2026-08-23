# AUTH-001 test cases

Issue: [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5). Risk: High (authentication / authorization).
Automation: `tests/e2e/auth.spec.ts`, `tests/e2e/roles.spec.ts`,
`tests/unit/errors.test.ts`, `tests/unit/require-auth.test.ts`.
Live-auth Playwright cases skip without `E2E_*` (SKIPPED ≠ PASSED).
REL-003 smoke steps 1–4 overlap these TCs on purpose
(`tests/smoke/rel-003.spec.ts`; mapping in
[../test-plans/AUTH-001.md](../test-plans/AUTH-001.md)). Smoke
execution is not TC PASSED.

## ISTQB P/N/E matrix (AUTH-001 as shipped — feature remains RELEASED)

| TC     | Kind | Technique | Note                                |
| ------ | ---- | --------- | ----------------------------------- |
| 001    | P    | Use-case  | Logged-in access                    |
| 002    | N    | Use-case  | Unauthenticated CRM denied          |
| 003    | P    | Decision  | ADMIN shell                         |
| 004    | P    | Decision  | VIEWER shell                        |
| 005    | P    | Use-case  | Logout                              |
| 006    | N    | State     | CRM denied after logout             |
| 007    | N    | EP        | Generic failed login                |
| 008    | P    | Use-case  | Unauthenticated = login only        |
| 009    | P    | EP        | Exactly one role                    |
| AC-012 | N    | Decision  | Fail-closed no role — unit, not e2e |

Live-auth e2e without `E2E_*`: SKIPPED ≠ PASSED (historical). New High
work records that gap as **BLOCKED** for DoD until executed.

## TC-001: Logged-in employee may access CRM

- AC: AC-001, AC-008
- Kind: P · Technique: use-case · Level: e2e · Priority: High
- Type: e2e (`tests/e2e/auth.spec.ts`; skip without `E2E_ADMIN_*`)
- Risk: High

### Preconditions

Provisioned employee (BD-002) with email+password (BD-001). `E2E_ADMIN_*`
set for automation.

### Test data

Valid ADMIN email/password from secrets (not committed).

### Steps

1. Open `/login`, submit email and password (`login-email`,
   `login-password`, `login-submit`).
2. Observe CRM shell.

### Expected result

Access allowed: `crm-shell` visible, URL `/app`.

## TC-002: CRM access requires login

- AC: AC-002, AC-003
- Kind: N · Technique: use-case · Level: e2e · Priority: High
- Type: e2e (`tests/e2e/auth.spec.ts`)
- Risk: High

### Preconditions

No session.

### Test data

None.

### Steps

1. GET `/app` while logged out.

### Expected result

Redirect to `/login`. `login-form` visible. `crm-shell` count 0.

## TC-003: ADMIN permitted CRM read and write

- AC: AC-004
- Kind: P · Technique: decision table (role × write) · Level: e2e · Priority: High
- Type: e2e (`tests/e2e/roles.spec.ts`)
- Risk: High

### Preconditions

Authenticated ADMIN (BD-003). CRM-001 Client UI is the write surface
on this branch.

### Test data

`E2E_ADMIN_*`.

### Steps

1. Log in as ADMIN.
2. Observe shell and Client create entry.

### Expected result

`user-role` is ADMIN. `admin-write-hint` and `client-create` visible.
(BD-006 write is observable via CRM-001.)

## TC-004: VIEWER read-only CRM access

- AC: AC-005
- Kind: P/N · Technique: decision table · Level: e2e · Priority: High
- Type: e2e (`tests/e2e/roles.spec.ts`)
- Risk: High

### Preconditions

Authenticated VIEWER.

### Test data

`E2E_VIEWER_*`.

### Steps

1. Log in as VIEWER.
2. Observe shell; confirm no create control.

### Expected result

`user-role` is VIEWER. `viewer-read-hint` visible. `admin-write-hint`
and `client-create` count 0.

## TC-005: User can log out

- AC: AC-006
- Kind: P · Technique: use-case · Level: e2e · Priority: High
- Type: e2e (`tests/e2e/auth.spec.ts`)
- Risk: High

### Preconditions

Authenticated ADMIN.

### Test data

`E2E_ADMIN_*`.

### Steps

1. Log in.
2. Click `logout`.

### Expected result

`login-form` visible. URL `/login`. `crm-shell` count 0.

## TC-006: After logout, CRM access is denied

- AC: AC-007
- Kind: N · Technique: state (session ended) · Level: e2e · Priority: High
- Type: e2e (`tests/e2e/auth.spec.ts`, same test as TC-005)
- Risk: High

### Preconditions

Employee has completed logout (TC-005).

### Test data

None after logout.

### Steps

1. GET `/app`.

### Expected result

Redirect `/login`. `login-form` only (BD-007).

## TC-007: Failed login is generic and does not enumerate accounts

- AC: AC-009
- Kind: N · Technique: EP (any auth failure) · Level: e2e + unit · Priority: High
- Type: e2e + `tests/unit/errors.test.ts`
- Risk: High
- Decisions: BD-004

### Preconditions

Not authenticated.

### Test data

Unknown email + wrong password (`nobody@example.com`).

### Steps

1. Submit login.
2. Unit: `mapAuthError` with any cause.

### Expected result

`login-error` text is `GENERIC_AUTH_ERROR` only. Not authenticated.
No account enumeration. No lockout required.

## TC-008: Unauthenticated access is only the login surface

- AC: AC-010
- Kind: P (login surface) / N (no CRM) · Technique: use-case · Level: e2e · Priority: High
- Type: e2e (`tests/e2e/auth.spec.ts`)
- Risk: High
- Decisions: BD-007

### Preconditions

Not authenticated.

### Test data

None.

### Steps

1. GET `/` and GET `/app`.

### Expected result

Only login surface (`login-form`). No `crm-shell`.

## TC-009: Employee has exactly one role

- AC: AC-011
- Kind: P/N · Technique: EP (ADMIN | VIEWER | invalid) · Level: unit + e2e · Priority: High
- Type: unit `parseRole` + e2e `user-role`
- Risk: High
- Decisions: BD-003

### Preconditions

Provisioned employee, or unit strings.

### Test data

Unit: `ADMIN`, `VIEWER`, `ADMIN,VIEWER`, empty, `admin`.
E2e: seeded ADMIN and VIEWER users.

### Steps

1. Unit: `parseRole`.
2. E2e: after login, read `user-role`.

### Expected result

Exactly one of ADMIN or VIEWER. Invalid strings → null (fail-closed).

## Not in AUTH-001

- Playwright for a third Auth user without a profile (former TC-010).
  Random/unknown credentials are TC-007. Fail-closed without a usable
  role remains AC-012 / BD-008, verified by Vitest
  `decideAccess(true, null)` in `tests/unit/require-auth.test.ts`
  (Kind N, technique decision table, level unit, priority High).
- Lockout, timeout, MFA, password reset
- In-app provisioning
- Automatic session expiration (BD-005 deferred)
