---
name: review-code
description: Review a diff for correctness, security, and process compliance. Use before prepare-pr and on incoming PRs.
---

# Review code

Agent step at `READY_FOR_PR`, **before** `prepare-pr`. This is not
human QA. Human reading of the diff is the `IN_QA` gate in
`docs/sdlc/lifecycle.md`.

## Steps

1. Diff against the PR base (`test` for features).
2. Check AC coverage, test presence, secret leakage, and CI gate integrity.
3. Run `docs/sdlc/security-review.md` checklist at the level required by risk.
4. Confirm no invented requirements and no silent AC edits.
5. Record findings in the PR; do not merge to `main`.

## Fail the review if

- Secrets present
- Tests weakened
- Human gates skipped
- Production deploy or schema included without authorization
