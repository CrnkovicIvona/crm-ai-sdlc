# Branching

## Branches

| Branch                               | Purpose                                                                                                                                                           |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main`                               | Production. Protected. No direct development. Source for Vercel Production when connected. Changes enter only through an approved pull request merged by a human. |
| `test`                               | Integration and QA. Feature branches merge here. CI runs here. Regression and QA happen here. Vercel Preview/QA may track this branch later.                      |
| `release/<rel-id>`                   | Cut from test for a release. Merged into main only by a human. After that, the agent syncs it into test and deletes the branch.                                   |
| `feature/<feature-id>-<description>` | Feature **implementation**. Create only in state `PLANNED` (human-approved implementation plan). Spec work uses `docs/`.                                          |
| `bugfix/<bug-id>-<description>`      | Bug fixes                                                                                                                                                         |
| `docs/<description>`                 | Documentation only                                                                                                                                                |
| `chore/<description>`                | Maintenance                                                                                                                                                       |

## Flow

```
feature|bugfix|docs|chore  →  PR  →  test  →  CI/QA  →  human approval
                                              →  release/<rel-id> → PR → main (human merge)
                                              →  agent merges release/<rel-id> → test
                                              →  agent deletes release/<rel-id>
                                              →  Vercel Production (later)
                                              →  smoke tests
```

## Protection (human-configured on GitHub)

These settings are **not** applied by the agent. Humans should enable:

- `main` and `test`: require pull requests
- `main`: required reviews (CODEOWNERS), required status checks
- No force push, no deletion of `main`
- Do not grant the AI agent permission to bypass protection

## Agent rules

- Do not commit or push to `main`.
- Do not merge to `main` — only a human merges `release/<rel-id>` → `main`.
- After that merge, the agent merges `release/<rel-id>` → `test` automatically, no separate approval needed.
- The agent deletes `release/<rel-id>` only after both merges succeed. If the merge into `test` fails, the branch stays and the conflict is escalated to a human.
- Do not disable protection.

## Implementation

PRs target `test`. Release PRs target `main` and are opened from `release/<rel-id>`.
