# Implementation plan: AUTH-001

- Work item: AUTH-001
- Issue: [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5)
- Owner: Agent (draft) / Human (approve → `PLANNED`)
- Source: Human DoR on Issue #5 (2026-08-22). Spec PR [#6](https://github.com/CrnkovicIvona/crm-ai-sdlc/pull/6) merged to `test`.
- Open Questions: none blocking. Copy, timeout, and CRM screens remain non-blocking per DoR.
- Approval: **Approved** (human on Issue #5, 2026-08-22)
- Traceability: [REQ-001](../../requirements/REQ-001.md), [FS](../../specifications/functional/AUTH-001.md), [TS](../../specifications/technical/AUTH-001.md), TC-001–TC-009
- Prerequisite: human **Definition of Ready** recorded
- Status: **Approved** — state **`PLANNED`**. Implementation may proceed.

This is **not** the functional or technical specification.

Human on Issue #5: “Implementation plan approved. State: PLANNED.
Coding may start.”

Implementation branch for this agent run:
`cursor/auth-001-implementation-plan-73b9` targeting `test`.

## DoR evidence

Issue #5 comment by owner: AUTH-001 Ready; remaining REQ/FS/TS items
accepted as non-blocking; plan may be written; **not** PLANNED until
this plan is approved.

## Scope of code changes

Bootstrap Vite + React + TypeScript (ADR-0002) **in this repo**
(existing `package.json` is process-only today).

### Files to add

| Path                                                       | Purpose                                                   |
| ---------------------------------------------------------- | --------------------------------------------------------- |
| `index.html`                                               | Vite entry                                                |
| `vite.config.ts`                                           | Vite + React                                              |
| `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` | TypeScript                                                |
| `src/main.tsx`                                             | React mount                                               |
| `src/App.tsx`                                              | Router                                                    |
| `src/vite-env.d.ts`                                        | Vite types                                                |
| `src/lib/supabase.ts`                                      | Browser client (URL + anon key only)                      |
| `src/lib/auth.ts`                                          | signIn, signOut, getSession                               |
| `src/lib/profile.ts`                                       | SELECT own `profiles.role`                                |
| `src/lib/errors.ts`                                        | Map all auth failures to one generic message              |
| `src/auth/AuthProvider.tsx`                                | Session + profile/role; fail-closed                       |
| `src/auth/RequireAuth.tsx`                                 | Guard: no session → `/login`; no usable role → deny CRM   |
| `src/pages/LoginPage.tsx`                                  | Email, password, submit; generic failure                  |
| `src/pages/AppShell.tsx`                                   | Protected CRM placeholder + logout + role label           |
| `src/pages/AccessDeniedPage.tsx`                           | Fail-closed (session, no usable role); no provisioning UI |
| `eslint.config.js`                                         | Flat config, TS + React                                   |
| `.env.example`                                             | Names only (below)                                        |
| `supabase/migrations/YYYYMMDDHHMMSS_profiles.sql`          | `profiles` + RLS intent (apply to **non-prod** only)      |
| `tests/unit/errors.test.ts`                                | Generic failure mapping                                   |
| `tests/unit/require-auth.test.ts`                          | Guard / fail-closed logic                                 |
| `tests/e2e/auth.spec.ts`                                   | Playwright TC-001–TC-002, TC-005–TC-008                   |
| `tests/e2e/roles.spec.ts`                                  | TC-003, TC-004, TC-009 (role display; no Client CRUD)     |
| `playwright.config.ts`                                     | e2e config                                                |
| `vitest.config.ts`                                         | unit/integration                                          |

### Files to change

| Path                          | Purpose                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `package.json`                | scripts: `dev`, `build`, `preview`, `lint`, `test`, `test:e2e` + deps            |
| `.github/workflows/ci.yml`    | Playwright: skip live-auth tests when e2e secrets absent (`SKIPPED`, not PASSED) |
| `docs/test-plans/AUTH-001.md` | Execution vs skip rules after code exists                                        |
| `docs/traceability/matrix.md` | Fill implementation paths when files exist                                       |
| `README.md`                   | How to run locally                                                               |

### Routes (this plan; TD-002 allowed names here)

| Path             | Access                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| `/login`         | Public. Authenticated users with a usable role redirect to `/app`.                                          |
| `/app`           | Protected CRM shell (no Client module).                                                                     |
| `/`              | Redirect: usable role → `/app`, else → `/login`.                                                            |
| `/access-denied` | Session present, no usable ADMIN/VIEWER profile (BD-008). Login surface remains reachable via logout/login. |

## Env (names only; no values in git)

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Optional e2e (CI/local secrets, never committed):

```
E2E_ADMIN_EMAIL=
E2E_ADMIN_PASSWORD=
E2E_VIEWER_EMAIL=
E2E_VIEWER_PASSWORD=
```

No service role in the client or in Vite env.

## Migrations / RLS / order (non-prod)

Human applies to a **non-production** Supabase project. Agent does not
configure the cloud project or touch production.

1. Enable Email provider (Supabase Auth). No extra password policy.
2. Create table `public.profiles` as in TS (id UUID PK = `auth.users.id`,
   `role` text check `ADMIN` \| `VIEWER`, timestamps).
3. Enable RLS on `profiles`.
4. Policy: authenticated user `SELECT` own row (`id = auth.uid()`).
5. No INSERT/UPDATE/DELETE via end-user UI (BD-002). Provisioning
   out of band (dashboard / service role **outside** the SPA).
6. Seed two users (ADMIN, VIEWER) + matching `profiles` rows.

Exact SQL is in `supabase/migrations/` on the implementation branch
after `PLANNED`. Apply to **non-prod** only.

## Mapping

| AC / TC                         | Automated test path (to be created after PLANNED)              | CI without secrets                                   |
| ------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| AC-008, AC-001 / TC-001         | `tests/e2e/auth.spec.ts`                                       | Skip if no `E2E_ADMIN_*`                             |
| AC-002, AC-003 / TC-002         | `tests/e2e/auth.spec.ts` visit `/app` logged out               | Run (no secrets)                                     |
| AC-004 / TC-003                 | `tests/e2e/roles.spec.ts` ADMIN role visible; no Client write  | Skip if no admin e2e user                            |
| AC-005 / TC-004                 | VIEWER role visible; no write control                          | Skip if no viewer e2e user                           |
| AC-006, AC-007 / TC-005, TC-006 | logout then `/app` denied                                      | Skip if no e2e user                                  |
| AC-009 / TC-007                 | bad password → generic failure                                 | Skip if no login page against live Auth; unit always |
| AC-010 / TC-008                 | unauthenticated only `/login`                                  | Run                                                  |
| AC-011 / TC-009                 | role is exactly one of ADMIN\|VIEWER                           | Skip without seed; unit on parser                    |
| AC-012                          | `tests/unit/require-auth.test.ts` (`decideAccess(true, null)`) | Always                                               |
| FR-009 mapping                  | `tests/unit/errors.test.ts`                                    | Always                                               |
| Fail-closed guard               | `tests/unit/require-auth.test.ts`                              | Always                                               |

Skipped e2e tests are **SKIPPED** / **NOT EXECUTED**, never PASSED.

Vitest always runs in CI once `src/` exists. Playwright job: run
unauthenticated specs always; credentialed specs only when secrets
are configured on the GitHub Environment.

## Security notes

- High risk: authn, authz, fail-closed, RLS on `profiles`.
- Generic auth error; no account enumeration.
- No provisioning UI on fail-closed.
- UI is not the data boundary; CRM tables still do not exist.
- Security review before `READY_FOR_PR` of the implementation PR.
- Do not weaken Playwright to go green.

## Test execution after code (so you can see the full flow)

1. `IN_DEVELOPMENT`: implement + write tests (DESIGNED → automated).
2. `TESTING`: `execute-tests` (`npm test`, `npx playwright test`).
3. Failures → `HEALING` (`heal`) → re-run `execute-tests`. Product
   defects → `manage-bugs`.
4. `report-tests` → `docs/test-reports/AUTH-001.md` with SHA/evidence.
5. PR to `test` → human QA.

Unauthenticated Playwright can demonstrate the flow **without**
Supabase secrets. Live login/logout/fail-closed needs your non-prod
project and e2e users.

## Rollout / rollback risk

- First `src/` turns on ESLint/Vitest/Playwright in CI.
- Rollback: revert implementation PR on `test`; drop non-prod
  `profiles` if needed. No production.

## Out of scope

CRM-001 Client CRUD, audit UI, DASH-001, lockout, timeout, SSO, MFA,
password reset, in-app provisioning, Next.js, custom REST, service
role in the client.

## Human next step

Plan is **Approved** (`PLANNED`). Implementation is on this branch;
test report: [docs/test-reports/AUTH-001.md](../../test-reports/AUTH-001.md).

This change includes application source after plan approval.
