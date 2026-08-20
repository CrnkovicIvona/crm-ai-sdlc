# BankCRM

BankCRM is a customer relationship management product. This repository is
set up for an AI-assisted software development lifecycle using Cursor,
GitHub, GitHub Actions, Vercel, and Supabase.

**This phase contains engineering process and repository foundation only.**
There is no application source, database schema, or production deployment
configuration yet. Product behavior must come from approved requirements
in `docs/`; it must not be invented.

## Stack (intended)

| Concern                      | Choice                                             |
| ---------------------------- | -------------------------------------------------- |
| Language                     | TypeScript                                         |
| UI                           | React (framework choice deferred; see ADR 0001)    |
| Unit / integration tests     | Vitest                                             |
| End-to-end tests             | Playwright                                         |
| Lint                         | ESLint (configured when application source exists) |
| Format                       | Prettier                                           |
| Database and auth            | Supabase (PostgreSQL)                              |
| Preview / production hosting | Vercel                                             |
| CI                           | GitHub Actions                                     |
| Work tracking                | GitHub Issues / Projects                           |

## Repository layout

| Path                                      | Purpose                                       |
| ----------------------------------------- | --------------------------------------------- |
| `.cursor/rules/`                          | Persistent project constraints                |
| `.cursor/skills/`                         | Reusable engineering procedures               |
| `docs/sdlc/`                              | Lifecycle orchestration                       |
| `docs/product/`                           | Product truth                                 |
| `docs/requirements/` through `docs/bugs/` | Requirements and QA artifacts                 |
| `docs/architecture/` and `docs/adr/`      | Technical context and decisions               |
| `docs/ai/`                                | AI operating model and guardrails             |
| `tests/`                                  | Reserved for unit, integration, and e2e tests |
| `.github/`                                | Issue/PR templates and CI                     |

## Git workflow (summary)

- `main` — production, protected, Vercel Production (when connected)
- `test` — integration / QA, CI, Vercel Preview/QA (when connected)
- Feature, bugfix, docs, and chore branches merge into `test`
- Production changes enter `main` only through an approved release PR

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/git/branching.md](docs/git/branching.md).

## Local foundation checks

```bash
npm install
npm run format:check
```

Application lint, unit, integration, and Playwright suites are not
runnable until the application is bootstrapped in a later phase.

## Security

See [SECURITY.md](SECURITY.md). Never commit secrets.
