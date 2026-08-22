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
| TC-010 session without profile             | SKIPPED | `E2E_NOPROFILE_*` not set. Unit `decideAccess(true, null) === 'denied'` passed.                           |
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

## Bugs filed

None.
