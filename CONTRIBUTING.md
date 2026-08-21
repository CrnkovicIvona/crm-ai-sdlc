# Contributing to BankCRM

This repository uses an AI-assisted SDLC. Humans own requirements truth,
approval gates, merges to `main`, and production.

Read these before starting work:

- [docs/sdlc/lifecycle.md](docs/sdlc/lifecycle.md)
- [docs/sdlc/definition-of-ready.md](docs/sdlc/definition-of-ready.md)
- [docs/specifications/README.md](docs/specifications/README.md)
- [docs/sdlc/definition-of-done.md](docs/sdlc/definition-of-done.md)
- [docs/git/branching.md](docs/git/branching.md)
- [docs/git/commits.md](docs/git/commits.md)
- [docs/ai/guardrails.md](docs/ai/guardrails.md)

## Branching

| Branch                               | Role                                                |
| ------------------------------------ | --------------------------------------------------- |
| `main`                               | Production. Protected. No direct development.       |
| `test`                               | Integration and QA. Feature work merges here first. |
| `feature/<feature-id>-<description>` | Implementation                                      |
| `bugfix/<bug-id>-<description>`      | Fixes                                               |
| `docs/<description>`                 | Documentation only                                  |
| `chore/<description>`                | Maintenance                                         |

All implementation PRs target `test`. Release PRs go from `test` to `main`
and require human approval and human merge.

## Commits

Use Conventional Commits. Include the work item ID when one exists:

```
feat(AUTH-001): implement user login
test(AUTH-001): add login e2e tests
fix(AUTH-001): handle invalid credentials
docs(AUTH-001): add login test plan
```

Foundation and process work uses IDs such as `ENG-001`.

## Pull requests

Use the pull request template. Do not merge to `main` without human
approval. The AI agent must not merge to `main` and must not push to
`main`.

## Quality

Until application source exists:

- format Markdown and config with Prettier (`npm run format:check`)
- Conventional Commits are enforced on pull requests
- secret scanning runs on pull requests

When `src/` exists, ESLint, Vitest, and Playwright become required CI
gates as described in [docs/sdlc/testing-strategy.md](docs/sdlc/testing-strategy.md).
Do not weaken those gates to make CI pass.

## AI contributors

Follow `.cursor/rules` and start feature work with the
`feature-orchestrator` skill. Do not invent business requirements. Do not
skip human approval gates.
