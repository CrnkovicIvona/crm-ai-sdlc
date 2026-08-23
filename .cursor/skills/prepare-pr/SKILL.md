---
name: prepare-pr
description: Prepare a pull request with Conventional Commits targeting the correct branch. Use at READY_FOR_PR. Never merge to main.
---

# Prepare pull request

## Rules

- Feature/bugfix/docs/chore PRs target **`test`**
- Release PRs target **`main`** from `release/<rel-id>` after `READY_FOR_RELEASE`
- Merged to `main` is `ON_MAIN`, not `RELEASED`
- Do not merge
- Do not push to `main`
- Push the feature branch only if the human asked to prepare/open/update the PR

## Steps

1. Confirm Conventional Commits and the PR template checklist.
2. Link Issue, test report, risk, and traceability.
3. Open or update the PR as **draft** until checks are understood.
4. Request human review (CODEOWNERS).

## Done

PR exists against the correct base with an honest test/status section (no fabricated passes).
