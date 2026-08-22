# BankCRM

BankCRM is a customer relationship management product. This repository is
set up for an AI-assisted software development lifecycle using Cursor,
GitHub, GitHub Actions, Vercel, and Supabase.

BankCRM is a **simple professional CRM** used to demonstrate an
agentic SDLC. A human is PO/BA. Agents draft specs, tests, and (after
gates) code. GitHub + `docs/` are the source of truth.

**There is no application source, database schema, or production
deployment configuration yet.** AUTH-001 is `SPECIFIED` (not Ready).
CRM-001 specifications live under `docs/features/CRM-001/` (not Ready,
not implemented). Product behavior must come from approved requirements;
it must not be invented.

Canonical process: [docs/sdlc/lifecycle.md](docs/sdlc/lifecycle.md).
Start feature work with `.cursor/skills/feature-orchestrator/SKILL.md`.

## Stack (approved)

| Concern                       | Choice                                     |
| ----------------------------- | ------------------------------------------ |
| Language                      | TypeScript                                 |
| UI                            | Vite + React (ADR-0002; do not reopen)     |
| Routing                       | React Router                               |
| Unit / integration tests      | Vitest                                     |
| End-to-end tests              | Playwright                                 |
| Lint                          | ESLint (configured when `src/` exists)     |
| Format                        | Prettier                                   |
| Database, auth, authorization | Supabase Auth, PostgreSQL, RLS             |
| Preview / production hosting  | Vercel                                     |
| CI                            | GitHub Actions                             |
| Secrets scan                  | gitleaks                                   |
| Work tracking                 | GitHub Issues (not Jira / Notion-as-truth) |

## Repository layout

| Path                                      | Purpose                                       |
| ----------------------------------------- | --------------------------------------------- |
| `.cursor/rules/`                          | Persistent project constraints                |
| `.cursor/skills/`                         | Reusable engineering procedures               |
| `docs/sdlc/`                              | Canonical lifecycle, risk, DoR/DoD            |
| `docs/features/`                          | New feature packs (CRM-001+)                  |
| `docs/product/`                           | Product truth pointers                        |
| `docs/requirements/` through `docs/bugs/` | AUTH-001 and shared QA artifacts              |
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
