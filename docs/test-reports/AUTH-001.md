# Test report: AUTH-001

- SHA: `b7f181e8d8d85e3dc10922de399455d575627b81` (`cursor/auth-001-implementation-plan-73b9`)
- Date: 2026-08-22
- Plan: [docs/test-plans/AUTH-001.md](../test-plans/AUTH-001.md)
- Risk level: High

## Summary

| Result                            | Count |
| --------------------------------- | ----- |
| Passed (executed, evidence cited) | 10    |
| Failed                            | 0     |
| Skipped / not executed            | 5     |
| Blocked                           | 0     |

Counts: Prettier, ESLint, Vitest (5 unit tests), Playwright (3 unauthenticated), gitleaks. Five Playwright live-Auth tests were skipped (not passed). commitlint is deferred to CI (`wagoid/commitlint-github-action`).

## Evidence

Working directory: `/workspace`. SHA above.

| Test                                       | Result  | Evidence (command + log)                                                                                  |
| ------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------- |
| Prettier `format:check`                    | passed  | `npm run format:check` — exit 0 — "All matched files use Prettier code style!"                            |
| ESLint                                     | passed  | `npm run lint` — exit 0                                                                                   |
| Vitest (FR-009, fail-closed, TC-009 parse) | passed  | `npm test` — exit 0 — 2 files, 5 tests passed                                                             |
| TC-002 / TC-008 unauthenticated `/app`     | passed  | `npm run test:e2e` — Playwright chromium — passed                                                         |
| TC-008 unauthenticated `/`                 | passed  | `npm run test:e2e` — passed                                                                               |
| TC-007 generic failed login                | passed  | `npm run test:e2e` — passed against unconfigured Supabase (mapper still returns `Authentication failed.`) |
| TC-001 logged-in CRM                       | SKIPPED | `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` not set. Not passed.                                             |
| TC-003 / TC-009 ADMIN shell                | SKIPPED | Admin e2e user not set. Unit `parseRole` passed. Not passed as e2e.                                       |
| TC-004 / TC-009 VIEWER shell               | SKIPPED | Viewer e2e user not set.                                                                                  |
| TC-005 / TC-006 logout then deny           | SKIPPED | Admin e2e user not set.                                                                                   |
| AC-012 session without usable role         | passed  | Vitest `decideAccess(true, null) === 'denied'` (no Playwright TC-010)                                     |
| gitleaks git history                       | passed  | `/tmp/gitleaks detect --source /workspace` — exit 0 — "no leaks found" (19 commits)                       |
| `vite build`                               | passed  | `npm run build` — exit 0 (supporting; not a planned TC)                                                   |
| Playwright overall                         | mixed   | 3 passed, 5 skipped, 0 failed (1.5s). Skipped ≠ passed.                                                   |

## Residual risk

High residual until non-prod Supabase + e2e secrets exist: live login, logout, role labels, and fail-closed with a real session are **not** proven.

Security notes for this SHA:

- Client uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- No service role in `src/` or `.env.example`
- Auth failures map to one generic string
- Session without a usable `profiles` role cannot render `/app`
- RLS in migration is SELECT own row only; agent did not apply SQL to production
- UI is not the data boundary; no CRM tables yet

## Production smoke (REL-003)

- Date: 2026-08-23
- URL: `https://crm-ai-sdlc.vercel.app`
- Command: `SMOKE_BASE_URL=https://crm-ai-sdlc.vercel.app npm run test:smoke` (`workers=1`)
- Suite: `tests/smoke/rel-003.spec.ts` (5 tests; PO removed former 1b)

| Step                        | Result |
| --------------------------- | ------ |
| 1 unauthenticated `/`       | PASS   |
| 2 failed login              | PASS   |
| 3 ADMIN login/logout        | PASS   |
| 4 VIEWER login              | PASS   |
| 5 no service_role in bundle | PASS   |

Overall: **PASS**. CI on `test` after PR #22:
[run 32658280782](https://github.com/CrnkovicIvona/crm-ai-sdlc/actions/runs/32658280782)
(Prettier, ESLint, Vitest, Playwright). GitHub Actions job
“Production smoke” on that push was **SKIPPED** (not a Production
deploy) — SKIPPED ≠ PASSED. Evidence for smoke is the executed
Playwright command above, not that skipped job.

## Bugs filed

[BUG-001](../bugs/BUG-001.md): direct `GET /login` 404 on Vercel.
PO removed that path from REL-003 smoke. Residual bookmark risk until
`vercel.json` is on Production (this close-out PR).

## Addendum — feature branch SHA `1c98f14` (2026-08-23)

Does **not** replace REL-003 production smoke evidence above.

- CI: [run 32672184863](https://github.com/CrnkovicIvona/crm-ai-sdlc/actions/runs/32672184863)
- Playwright: TC-001, TC-002/008, TC-005/006, TC-007, TC-003/009,
  TC-004/009 **PASSED** (credentialed). SKIPPED ≠ this addendum.
- Production smoke workflow on this SHA: **SKIPPED** (not Production).
  Historical 5/5 remains the RELEASED evidence, not this SHA.
