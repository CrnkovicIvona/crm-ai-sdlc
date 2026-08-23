---
name: release-and-verify
description: Prepare a release from test to main, describe production smoke, and sync the release branch to test. Never merge main or deploy production. Use at READY_FOR_RELEASE, ON_MAIN, and RELEASED.
---

# Release and verify

## Rules

- Only after human QA (`READY_FOR_RELEASE`).
- Agent prepares `release/<rel-id>` (canonical) from `test`, the
  release → `main` PR, and `docs/releases/<rel-id>.md`.
- Agent does **not** merge to `main`. Only a human merges the release PR.
- Before that PR is ready: run `sync-feature-docs` with target status
  **`ON_MAIN`**. Do not label artifacts `RELEASED` yet.
- After human merge: state is **`ON_MAIN`**, not `RELEASED`.
- Production smoke must actually run against production via
  `tests/smoke/` (`SMOKE_BASE_URL=… npm run test:smoke` or
  `.github/workflows/production-smoke.yml`). If it has not
  **PASSED**, say **ON_MAIN — not RELEASED.** Never treat skipped,
  missing, deferred, or markdown-only smoke as PASSED.
- After smoke **PASSED**: `sync-feature-docs` at `RELEASED` (follow-up
  PR to `main`; human merges because `main` requires a PR).
- **Release → `test`:** primary is `.github/workflows/release-sync.yml`
  (merge **release branch** into `test`, then delete the branch).
  Fallback: this skill on an **Agent** turn. Ask mode cannot push.
  Do **not** merge `main` into `test` as the normal sync.
  Do **not** invent a second product-approval gate. A PR to `test` is
  allowed only if GitHub rejects a direct push.
- Delete the release branch **only after** a successful `test` sync.
  If sync fails: keep the branch, record the failure, do not claim
  success.

## Steps

1. Confirm `docs/sdlc/production-readiness.md` and human QA on the Issue.
2. Cut `release/<rel-id>` from `test` (or document a `cursor/rel-…` alias).
3. `sync-feature-docs` → `ON_MAIN`.
4. Write `docs/releases/<rel-id>.md` (point at `tests/smoke/`; result
   = not executed until the suite runs).
5. Open `release/<rel-id>` → `main` if the human asked.
6. After human merge: record `ON_MAIN`, production URL if known.
7. Run `npm run test:smoke` only with `SMOKE_BASE_URL` and
   authorization; file evidence in the REL note.
8. If smoke PASSED: `sync-feature-docs` → `RELEASED`; follow-up PR to `main`.
9. Confirm Actions synced `test`, or perform the agent fallback merge of
   the **release branch** into `test`.
10. Delete remote release branch only after step 9 succeeds.

## Done

Release PR exists or merged; statuses match `ON_MAIN` or `RELEASED`
per `docs/sdlc/lifecycle.md`; `test` has the release branch tree or
failure is recorded; smoke is PASSED or explicitly not executed
(state stays `ON_MAIN`). Production is not deployed by the agent.
