# Test plan: AUTH-001

- Issue: [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5)
- Risk level: High
- Impact summary: Authentication and authorization. No application
  source exists yet, so automated suites cannot run. BD-001–BD-007
  and TD-001–TD-007 are approved.

## In scope

- TC-001 logged-in access (email + password)
- TC-002 unauthenticated CRM denied
- TC-003 ADMIN permitted read and write (model; no CRM modules yet)
- TC-004 VIEWER read-only (model; no CRM modules yet)
- TC-005 logout
- TC-006 access denied after logout
- TC-007 generic failed login / no enumeration
- TC-008 unauthenticated = login surface only
- TC-009 exactly one role

When an application exists, these are candidates for Playwright/e2e
and supporting unit/integration tests (including RLS when policies
exist). They are **not executed** now.

## Out of scope

- Lockout, timeout, MFA, in-app provisioning
- Automatic session expiration (BD-005 deferred)
- Full product regression — no other product behavior exists
- ESLint / Vitest / Playwright execution — no `src/`; **NOT APPLICABLE**
  until an app exists. Do not report them as passed.

## Regression pack

- None for other product features (none exist)
- After implementation: TC-001–TC-009 as the auth pack; skipping this
  pack would require human approval (High risk)

## Environments

- Specification only in this phase
- Later: local Vite + non-prod Supabase / QA Preview, as decided in
  the implementation plan

## Entry / exit criteria

- Entry to implementation: Definition of Ready and human-approved
  implementation plan (`PLANNED`)
- Exit of this documentation update: approved BD/TD reflected in
  specs and tests; human DoR **not** recorded by the agent

## Security review

Required at High risk before `READY_FOR_PR` of the future
implementation. RLS is designed, not implemented.

## Healing

Failures go to the `heal` skill; re-execution uses `execute-tests`.
No test execution in this phase.
