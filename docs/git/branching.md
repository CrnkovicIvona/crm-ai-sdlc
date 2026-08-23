# Branching

## Branches

| Branch                               | Purpose                                                                                                                                                           |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main`                               | Production. Protected. No direct development. Source for Vercel Production when connected. Changes enter only through an approved pull request merged by a human. |
| `test`                               | Integration and QA. Feature branches merge here. CI runs here. Regression and QA happen here. Vercel Preview/QA may track this branch later.                      |
| `release/<rel-id>`                   | Cut from `test` for a release. Merged into `main` **only by a human**. Kept until synced back to `test`. Then deleted.                                            |
| `feature/<feature-id>-<description>` | Feature **implementation**. Create only in state `PLANNED`. Spec work uses `docs/`.                                                                               |
| `bugfix/<bug-id>-<description>`      | Bug fixes                                                                                                                                                         |
| `docs/<description>`                 | Documentation only                                                                                                                                                |
| `chore/<description>`                | Maintenance                                                                                                                                                       |
| `cursor/<description>-<id>`          | **Compatibility alias** for Cursor cloud agents. Treat as `feature/` or `release/` by purpose. New docs use `feature/` and `release/` as canonical names.         |

Never: `feature/*` → `main`. Never direct push to `main`.

## Flow

```
feature|bugfix|docs|chore  →  PR  →  test  →  CI + human QA
                                              →  release/<rel-id>  (+ sync-feature-docs at ON_MAIN)
                                              →  PR → main (human merge)
                                              →  ON_MAIN
                                              →  Vercel Production
                                              →  production smoke (must PASS for RELEASED)
                                              →  follow-up docs PR → main (status RELEASED)
                                              →  sync release branch → test  (Actions, agent fallback)
                                              →  delete release branch
```

`delete_branch_on_merge` for release PRs must stay **disabled**. The
release branch is required after the squash to `main` so it can be
merged into `test`. Same SHA on `test` and `main` is **not** required
after a squash.

## Protection (human-configured on GitHub)

The agent does not apply these settings. Observed (2026-08-23):

- `main`: ruleset requires a pull request (0 approving reviews).
- `test`: ruleset forbids deletion of the branch and non-fast-forward
  (force push). **No pull-request rule** on `test` at that date — a
  fast-forward or merge **push** may succeed. If a later ruleset
  requires PRs on `test`, sync becomes a PR (protection fallback, not
  a product gate).

Humans should keep:

- No force push, no deletion of `main` or `test`
- No AI-agent bypass of protection
- `delete_branch_on_merge` **off** for `main` (so release branches survive squash)

## Agent rules

- Do not commit or push to `main`.
- Do not merge to `main` — only a human merges `release/<rel-id>` → `main`.
- After that merge, **GitHub Actions** (if enabled) merges the **release
  branch** into `test`. The agent is the **fallback** if Actions cannot
  (Ask mode cannot push). Do **not** open a second product-approval PR
  unless GitHub rejects the push.
- **Do not merge `main` into `test` as the normal sync.** Merge the
  **release branch** into `test`.
- Delete the release branch **only after** that sync succeeds. If sync
  fails, leave the branch, record the failure, do not claim success.
- Do not disable protection.

See [release-sync.md](release-sync.md).

## Implementation

PRs target `test`. Release PRs target `main` and are opened from
`release/<rel-id>` (or a `cursor/rel-…` alias).
