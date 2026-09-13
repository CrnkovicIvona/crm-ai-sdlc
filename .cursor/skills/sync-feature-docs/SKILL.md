---
name: sync-feature-docs
description: Synchronize feature documentation and traceability before calling ON_MAIN or RELEASED. Never invent test or smoke evidence. Use before the release PR merge (status ON_MAIN) and after production smoke PASSED (status RELEASED).
---

# Sync feature documentation

**Always run this skill** when preparing a release PR and again after
production smoke **PASSED**. Do not implement product features here.
Do not claim `RELEASED` from a merge to `main` alone.

Canonical states: `docs/sdlc/lifecycle.md`.
Validation: `docs/sdlc/validation-rules.md`.

## When

1. **Before the release PR is merged** (state becoming `ON_MAIN`):
   set applicable artifacts to `ON_MAIN`. Smoke has not PASSED.
2. **After production smoke PASSED**: set applicable artifacts to
   `RELEASED`. Open a follow-up PR to `main` if `main` still says
   `ON_MAIN`.

Never use `VERIFICATION_PENDING` or `DEFERRED_VERIFICATION` as a
lifecycle state. Pending smoke is `ON_MAIN`.

## Required artifacts (where they exist)

Update status and links for:

- REQ
- Functional specification
- User stories / AC
- Technical specification
- Feature README (`docs/features/<ID>/README.md` or equivalent)
- `docs/sdlc/roadmap.md`
- `docs/releases/<REL>.md`
- `docs/traceability/matrix.md`
- Test report (`docs/test-reports/<ID>.md`)
- Implementation paths in the matrix

## Rules

- Verify implementation paths **exist** on the relevant Git SHA
  (`git ls-tree` or equivalent). Do not list files that are absent.
- Do **not** invent test evidence. Copy CI run URLs and counts from
  real runs.
- Evidence grades: PASS / FAIL / MISSING / NOT APPLICABLE.
  SKIPPED, NOT APPLICABLE, NOT EXECUTED, MISSING ≠ PASSED.
- Healing is never PASSED.
- If smoke has not PASSED, every public status must stay `ON_MAIN`
  (or earlier). The required phrase is: **ON_MAIN — not RELEASED.**
- Do **not** write increment `ON_MAIN` / `RELEASED` (or CI counts,
  SHAs, “as of DATE”) into root `README.md`. That file is a landing
  page (`.cursor/rules/readme.mdc`). Status belongs in the feature
  README, roadmap, release record, matrix, and test reports.
- After a status sync, only touch root `README.md` if it has **broken
  links**, missing required sections, or live-status dump to strip.
- Do not close the GitHub Issue from this skill.

## Steps

1. Identify feature ID, release ID, `main` SHA (or intended release SHA).
2. Collect CI evidence (run URL). If missing, record missing — do not
   claim PASSED.
3. Collect deployment state (Vercel production URL or “not configured”).
   Unknown is a blocker for `RELEASED`, not for `ON_MAIN`.
4. Collect smoke result: PASSED with log, or not executed.
5. Update the artifact list. Match Status to `ON_MAIN` or `RELEASED`
   per **When**.
6. Update matrix columns: implementation paths, test execution, verification
   (`not executed` until smoke PASSED), release id.
7. Run `docs/sdlc/validation-rules.md` items 16–19.
8. Commit on the release branch or a docs follow-up branch. PRs to
   `main` still require **human merge**.

## Done

Files on the branch being merged to `main` match the allowed status
for this invocation, paths exist, and no SKIPPED result is labeled
PASSED. If conditions for `RELEASED` fail, output **ON_MAIN — not
RELEASED.** and list gaps.
