# Branching

## Branches

| Branch                               | Purpose                                                                                                                                                           |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main`                               | Production. Protected. No direct development. Source for Vercel Production when connected. Changes enter only through an approved pull request merged by a human. |
| `test`                               | Integration and QA. Feature branches merge here. CI runs here. Regression and QA happen here. Vercel Preview/QA may track this branch later.                      |
| `feature/<feature-id>-<description>` | Feature development                                                                                                                                               |
| `bugfix/<bug-id>-<description>`      | Bug fixes                                                                                                                                                         |
| `docs/<description>`                 | Documentation only                                                                                                                                                |
| `chore/<description>`                | Maintenance                                                                                                                                                       |

## Flow

```
feature|bugfix|docs|chore  →  PR  →  test  →  CI/QA  →  human approval
                                              →  release PR  →  main
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

- Do not commit or push to `main`
- Do not merge to `main`
- Do not disable protection
- Implementation PRs target `test`
