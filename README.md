# BankCRM

BankCRM is a customer relationship management product. This repository is
set up for an AI-assisted software development lifecycle using Cursor,
GitHub, GitHub Actions, Vercel, and Supabase.

BankCRM is a **simple professional CRM** used to demonstrate an
agentic SDLC. A human is PO/BA. Agents draft specs, tests, and (after
gates) code. GitHub + `docs/` are the source of truth.

**AUTH-001 is `RELEASED` (REL-003).** Human merged
[#12](https://github.com/CrnkovicIvona/crm-ai-sdlc/pull/12) to `main`
(2026-08-22). Production smoke **5/5 PASSED** 2026-08-23 against
`https://crm-ai-sdlc.vercel.app` (PO removed `GET /login` from the
suite). Login UI lives under `src/`.
Copy `.env.example` to `.env` and add a non-prod Supabase URL and anon
key. Apply
`supabase/migrations/20260822150000_profiles.sql` to **non-prod** only
unless a human applies production. CRM-001 is `SPECIFIED` (not Ready).
DASH-001 waits until CRM-001 is accepted for planning.

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
| Lint                          | ESLint (`eslint.config.js`)                |
| Format                        | Prettier                                   |
| Database, auth, authorization | Supabase Auth, PostgreSQL, RLS             |
| Preview / production hosting  | Vercel                                     |
| CI                            | GitHub Actions                             |
| Secrets scan                  | gitleaks                                   |
| Work tracking                 | GitHub Issues (not Jira / Notion-as-truth) |

## Repository layout

| Path                                      | Purpose                                      |
| ----------------------------------------- | -------------------------------------------- |
| `.cursor/rules/`                          | Persistent project constraints               |
| `.cursor/skills/`                         | Reusable engineering procedures              |
| `docs/sdlc/`                              | Canonical lifecycle, risk, DoR/DoD           |
| `docs/features/`                          | New feature packs (CRM-001+)                 |
| `docs/product/`                           | Product truth pointers                       |
| `docs/requirements/` through `docs/bugs/` | AUTH-001 and shared QA artifacts             |
| `docs/architecture/` and `docs/adr/`      | Technical context and decisions              |
| `docs/ai/`                                | AI operating model; guardrails live in rules |
| `src/`                                    | Vite + React application (AUTH-001)          |
| `supabase/migrations/`                    | Non-prod SQL (human applies; not production) |
| `tests/`                                  | Vitest unit tests and Playwright e2e         |
| `.github/`                                | Issue/PR templates and CI                    |

## Git workflow (summary)

- `main` — production, protected, Vercel Production (when connected)
- `test` — integration / QA, CI, Vercel Preview/QA (when connected)
- Feature, bugfix, docs, and chore branches merge into `test`
- Production changes enter `main` only through an approved release PR

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/git/branching.md](docs/git/branching.md).

## Local checks

```bash
npm install
npm run format:check
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
```

Credentialed Playwright cases (TC-001, TC-003–TC-006, TC-009)
need `E2E_*` and `VITE_SUPABASE_*` env vars. Without them those tests
are **skipped**, not passed. Live Auth that reaches `/access-denied`
usually means the Auth user has no `public.profiles` row with
`ADMIN` or `VIEWER`. AC-012 (session without usable role) is covered
by Vitest `decideAccess(true, null)`, not a third e2e user.

Unauthenticated e2e (TC-002, TC-007, TC-008) run without secrets.

## Security

See [SECURITY.md](SECURITY.md). Never commit secrets.
