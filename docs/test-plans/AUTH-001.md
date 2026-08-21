# Test plan: AUTH-001

- Issue: [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5)
- Risk level: High
- Impact summary: Authentication and authorization. No application
  source exists yet, so automated suites cannot run.

## In scope

- TC-001 logged-in access
- TC-002 unauthenticated denied
- TC-003 ADMIN full access
- TC-004 VIEWER read-only
- TC-005 logout
- TC-006 access denied after logout

When an application exists, these are candidates for Playwright/e2e
and supporting unit/integration tests. They are **not executed** now.

## Out of scope

- Failed-login, lockout, timeout, MFA, provisioning — not in REQ-001
- Full product regression — no other product behavior exists
- ESLint / Vitest / Playwright execution — no `src/`; **NOT APPLICABLE**
  until an app exists. Do not report them as passed.

## Regression pack

- None for other product features (none exist)
- After implementation: TC-001–TC-006 as the auth pack; skipping this
  pack would require human approval (High risk)

## Environments

- Specification only in this phase
- Later: local / QA Preview / as decided in the implementation plan

## Entry / exit criteria

- Entry to implementation: Definition of Ready and human-approved
  implementation plan (`PLANNED`)
- Exit of this specification phase: REQ, functional spec, US/AC, BDD,
  test cases/plan, traceability, and technical spec exist; human DoR
  is not given while open questions remain

## Security review

Required at High risk before `READY_FOR_PR` of the future
implementation. Not a substitute for unanswered login-method
questions.

## Healing

Failures go to the `heal` skill; re-execution uses `execute-tests`.
No test execution in this phase.
