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
Production smoke (REL-003, not the local e2e pack):
`tests/smoke/rel-003.spec.ts`.

Both suites stay. Shared UI helpers live in `tests/e2e/login.ts`.
Do not add a third copy of these journeys. E2e is skip-gated without
Vite/`E2E_*`. Smoke is fail-closed on `SMOKE_BASE_URL` and `E2E_*`
(missing secrets = FAIL, not SKIPPED). Smoke PASS is not TC PASSED.

| REL-003 smoke step                     | Overlaps AUTH TCs              | Notes                              |
| -------------------------------------- | ------------------------------ | ---------------------------------- |
| 1 unauthenticated `/` shows login only | TC-002, TC-008                 | Login surface; no CRM shell        |
| 2 failed login generic error           | TC-007                         | Same generic copy as e2e           |
| 3 ADMIN login, shell, logout           | TC-001, TC-003, TC-005, TC-006 | Smoke does not replace the TC pack |
| 4 VIEWER login, read-only shell        | TC-004                         | No write hint                      |
| 5 bundle has no service role           | (none)                         | Smoke-only                         |

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

- Local Vite (`npm run dev`) — `npm run test:e2e`
- CI: Vitest always; Playwright unauthenticated always; live Auth when
  GitHub secrets are set
- Non-prod Supabase for live e2e (human-configured)
- Production smoke: `SMOKE_BASE_URL` + `npm run test:smoke` after
  Production deploy (workflow `production-smoke.yml`)

## Entry / exit criteria

- Entry: `PLANNED`
- Exit to PR: executed tests with evidence in `docs/test-reports/AUTH-001.md`

## Security review

High: no service role in client; generic auth errors; fail-closed
without provisioning UI; RLS SQL in repo is not applied to production
by the agent.

## Healing

Failures go to `heal`; re-execution uses `execute-tests`.
