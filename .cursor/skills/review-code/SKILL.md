---
name: review-code
description: Review a diff for correctness, security, and process compliance. Use before prepare-pr and on incoming PRs.
---

# Review code

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
