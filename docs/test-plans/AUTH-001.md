# Test plan: AUTH-001

- Issue: [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5)
- Risk level: High
- Impact summary: Authentication and authorization. Plan **Approved**
  (`PLANNED`). Application source exists. BD-001–BD-008 and
  TD-001–TD-008 are approved.

## In scope

- TC-001 logged-in access (email + password) — Playwright, skip without `E2E_ADMIN_*`
- TC-002 unauthenticated CRM denied — Playwright, always
- TC-003 ADMIN shell (no Client module) — Playwright, skip without admin e2e user
- TC-004 VIEWER read-only shell — Playwright, skip without viewer e2e user
- TC-005 logout — Playwright, skip without admin e2e user
- TC-006 access denied after logout — with TC-005
- TC-007 generic failed login — Playwright always + Vitest `tests/unit/errors.test.ts`
- TC-008 unauthenticated = login surface only — Playwright, always
- TC-009 exactly one role — Vitest parser always; Playwright skip without seed

Automated paths: `tests/e2e/auth.spec.ts`, `tests/e2e/roles.spec.ts`,
`tests/unit/errors.test.ts`, `tests/unit/require-auth.test.ts`.

## Out of scope

- Lockout, timeout, MFA, in-app provisioning
- Automatic session expiration (BD-005 deferred)
- Client CRUD (CRM-001)
- Session without usable role (AC-012): unit only, not a Playwright case
- Claiming SKIPPED e2e as PASSED

## Regression pack

TC-001–TC-009 as the auth pack; skip of the live-auth subset without
secrets is allowed and must be reported as SKIPPED.

## Environments

- Local Vite (`npm run dev`)
- CI: Vitest always; Playwright unauthenticated always; live Auth when
  GitHub secrets are set
- Non-prod Supabase for live e2e (human-configured)

## Entry / exit criteria

- Entry: `PLANNED`
- Exit to PR: executed tests with evidence in `docs/test-reports/AUTH-001.md`

## Security review

High: no service role in client; generic auth errors; fail-closed
without provisioning UI; RLS SQL in repo is not applied to production
by the agent.

## Healing

Failures go to `heal`; re-execution uses `execute-tests`.
