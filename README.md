# BankCRM

## Overview

BankCRM is a **simple banking CRM practice/portfolio project**, not a
production banking system. Staff sign in, then work with **clients**
and catalog **products** (accounts, cards, and similar items). Access
is enforced in the UI and in **PostgreSQL Row Level Security**.

The repository demonstrates an end-to-end, **AI-assisted SDLC**:
product/business analysis, implementation, QA and test automation,
database work, CI/CD, security, and human decision gates. Source of
truth is GitHub plus `docs/`.

**Stack** (from `package.json`): Vite, React, TypeScript, React Router,
Supabase JS. Tests: Vitest and Playwright. Hosting: Vercel. CI: GitHub
Actions.

Vite + React + TypeScript is the accepted frontend
([ADR-0002](docs/adr/0002-vite-react-typescript.md)). Supabase provides
Auth and Postgres with RLS
([AUTH-001 TS](docs/specifications/technical/AUTH-001.md)). Platform
intent: [ADR-0001](docs/adr/0001-engineering-foundation.md).

Production host:
[https://crm-ai-sdlc.vercel.app](https://crm-ai-sdlc.vercel.app)

This README is the public landing page. Increment status and test
evidence live in feature packs, the roadmap, Issues, and test reports
— not as banners here.

## Features

| Area                 | What it covers                                                                 | Specs                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Sign-in and session  | Email/password login, `/login` vs `/app`, ADMIN and VIEWER, logout             | [AUTH-001 FS](docs/specifications/functional/AUTH-001.md), [TS](docs/specifications/technical/AUTH-001.md) |
| Clients and products | Client registry, products by type, soft-delete, RLS (ADMIN write, VIEWER read) | [CRM-001 FS](docs/features/CRM-001/functional-spec.md), [TS](docs/features/CRM-001/technical-spec.md)      |

Later increments are listed on the
[product roadmap](docs/sdlc/roadmap.md). Do not assume a DASH-001 spec
file exists until that directory is in the repo.

## Architecture

```
Browser (Vite + React SPA)
        │  @supabase/supabase-js (anon key)
        ▼
Supabase Auth + PostgreSQL
        │  RLS (profiles.role → ADMIN | VIEWER)
        ▼
Postgres tables (see Database)
```

The SPA talks to Supabase with the **anon** key. Authorization is
**RLS in Postgres**, not only the UI.

- [Architecture index](docs/architecture/README.md)
- [Environments](docs/architecture/environments.md)
- [Data model](docs/architecture/data-model.md)
- RLS: [AUTH-001 TS](docs/specifications/technical/AUTH-001.md),
  [CRM-001 TS](docs/features/CRM-001/technical-spec.md)
- [Branching](docs/git/branching.md)

## Database

Schema truth is `supabase/migrations/`, summarized in
[data-model.md](docs/architecture/data-model.md). Do not paste SQL
here.

```
auth.users (Supabase Auth)
    │  1:1
    ▼
profiles (role: ADMIN | VIEWER)
clients
    ├── client_products ──► products
    └── client_audit_events
```

| Table                 | Purpose                                        | Key relationships                                      |
| --------------------- | ---------------------------------------------- | ------------------------------------------------------ |
| `profiles`            | App role for each auth user                    | `id` → `auth.users`                                    |
| `clients`             | Client registry (soft-delete via `deleted_at`) | —                                                      |
| `products`            | Product catalog (seeded in SQL)                | —                                                      |
| `client_products`     | Client ↔ product assignment                    | FK to `clients`, `products`                            |
| `client_audit_events` | Client change history                          | `entity_id` is client id; **no FK** (history can last) |

**Security:** Postgres + Supabase. RLS uses `profiles.role`. ADMIN
writes clients/products assignments; VIEWER reads. Production schema
is applied by `.github/workflows/production-smoke.yml`, not by pasting
SQL in the Dashboard.

## Project structure

```
.cursor/              always-on rules and on-demand skills
.github/workflows/    ci.yml, production-smoke.yml, release-sync.yml
docs/                 SDLC, features, architecture, tests, AI
src/                  Vite React SPA
supabase/migrations/  PostgreSQL + RLS
tests/                Vitest (unit, rls) and Playwright (e2e, smoke)
package.json
SECURITY.md
LICENSE
README.md
```

| Path                   | What it is                | How you use it                                                                        |
| ---------------------- | ------------------------- | ------------------------------------------------------------------------------------- |
| `src/`                 | UI, auth, data access     | Change only after `PLANNED`; add files named in the approved plan                     |
| `supabase/migrations/` | Schema and RLS in git     | Commit SQL as planned; apply non-prod yourself; production via `production-smoke.yml` |
| `tests/`               | Automated checks          | `npm test`, `npm run test:e2e`, `npm run test:smoke`                                  |
| `docs/`                | Product and process truth | Specs and SDLC; not increment banners in this README                                  |
| `.github/workflows/`   | CI and smoke              | Gates on PRs; Vercel builds production                                                |
| `.cursor/`             | Rules and skills          | Rules always load; skills run when you invoke them                                    |

Extending `src/` or SQL is part of the documented process
([lifecycle](docs/sdlc/lifecycle.md)), not ad-hoc scaffolding.

## Engineering and skills

What this repository actually demonstrates:

**Product / business analysis** — requirements, functional specs, user
stories, acceptance criteria, BDD, decision logs (see `docs/`).

**QA and testing** — Vitest (unit + RLS integration), Playwright E2E
and production smoke, test plans/cases/reports, CI quality gates.
Skip is not pass. There is no Newman/Postman suite in this repo.

**Data and database** — PostgreSQL, Supabase, relational modelling,
migrations in git, RLS, seeded product catalog.

**Development** — TypeScript, React, Vite, Git, pull requests,
Conventional Commits, ESLint, Prettier.

**CI/CD** — GitHub Actions (`ci.yml`, `production-smoke.yml`,
`release-sync.yml`), Vercel for the production SPA.

## AI-assisted engineering

Index: [docs/ai/README.md](docs/ai/README.md).

- `.cursor/rules/` — always-on constraints (git, SDLC, tests,
  security, this README rule)
- `.cursor/skills/` — on-demand procedures

Skills on disk: `feature-orchestrator`, `analyze-requirements`,
`author-specifications`, `author-user-stories`, `author-bdd`,
`author-decisions`, `author-adr`, `plan-implementation`, `plan-tests`,
`execute-tests`, `report-tests`, `review-code`, `prepare-pr`,
`sync-feature-docs`, `release-and-verify`, `manage-bugs`, `heal`,
`ui-ux-redesign`.

Skills do **not** start by themselves. They are not a cron or
background workflow.

### What the agent does when asked

Draft requirements, FS/TS, stories, BDD, tests, and plans; implement
**after** human `PLANNED`; run tests when `execute-tests` is invoked;
open a PR to `test`; keep this README aligned with
`.cursor/rules/readme.mdc`. If CI Prettier fails on an agent-owned PR
branch, `heal` formats locally, commits, and pushes a new SHA.

The agent does **not** merge `main`.

### What the human must do

- Definition of Ready and plan approval (`PLANNED`)
- QA on `test`
- Merge to `main`
- GitHub secret `PRODUCTION_SUPABASE_DB_URL` once (never `VITE_*`)
- Approve Vercel production
- Invoke skills with a prompt

Production schema apply is the smoke workflow, not the Dashboard.

## Development workflow

Canonical: [docs/sdlc/lifecycle.md](docs/sdlc/lifecycle.md). There is
no `docs/sdlc/README.md`.

```
Requirement
    ↓
Specification
    ↓
DoR (human)
    ↓
Implementation plan
    ↓
Human approval → PLANNED
    ↓
Implementation + tests
    ↓
PR → test
    ↓
CI + QA
    ↓
Human merge → main
    ↓
Vercel Production
    ↓
production-smoke.yml
```

Application roles: **ADMIN** (write) and **VIEWER** (read).

## Git workflow

GitHub holds source, Issues, pull requests, and Actions. Details:
[docs/git/branching.md](docs/git/branching.md). The agent does not
merge `main`.

| Branch / pattern                     | Purpose                 |
| ------------------------------------ | ----------------------- |
| `main`                               | Production              |
| `test`                               | Integration and QA      |
| `release/<rel-id>`                   | Release train to `main` |
| `feature/<feature-id>-<description>` | Feature implementation  |
| `bugfix/`                            | Fixes                   |
| `docs/`                              | Documentation           |
| `chore/`                             | Maintenance             |

## Installation

Requires **Node.js 20+** (`package.json` `engines`) and npm.

```bash
git clone https://github.com/CrnkovicIvona/crm-ai-sdlc.git
cd crm-ai-sdlc
npm install
cp .env.example .env
```

Names only (never commit values):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Optional (same names as `.env.example`): `SUPABASE_SERVICE_ROLE_KEY`
(never `VITE_*`), `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`,
`E2E_VIEWER_EMAIL`, `E2E_VIEWER_PASSWORD`. Local smoke:
`SMOKE_BASE_URL` plus `E2E_*`. Production schema apply: GitHub secret
`PRODUCTION_SUPABASE_DB_URL` (not in `.env`).

## Running locally

```bash
npm run dev
```

Vite (default http://localhost:5173). Point the SPA at a **real**
Supabase project. Apply `supabase/migrations/` to that **non-prod**
project yourself. Do not use production credentials as local defaults.

Production schema is **not** a local step. It is
`.github/workflows/production-smoke.yml`.

Other scripts: `npm run build`, `npm run preview`, `npm run lint`,
`npm run format`.

## Testing

Documented strategy, not live counts.

```
Requirement → Acceptance Criteria → Test Design → Implementation → Validation
```

```bash
npm test              # Vitest (jsdom + Node RLS integration)
npm run test:e2e      # Playwright (local app + E2E_* users)
npm run test:smoke    # Playwright against SMOKE_BASE_URL
```

[Testing strategy](docs/sdlc/testing-strategy.md),
[test plans](docs/test-plans/),
[AUTH-001 plan](docs/test-plans/AUTH-001.md),
[test cases](docs/test-cases/),
[test reports](docs/test-reports/),
[CRM-001 test plan](docs/features/CRM-001/test-plan.md),
[CRM-001 test cases](docs/features/CRM-001/test-cases.md).

A skipped test is not a passed test. There is no `docs/qa/`.

## CI/CD

Inspected workflows:

| Workflow                                                       | Trigger                                                         | Purpose                                                               |
| -------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------- |
| [ci.yml](.github/workflows/ci.yml)                             | PRs to `test`/`main`; pushes to `test`                          | Prettier, commitlint (PRs only), gitleaks, ESLint, Vitest, Playwright |
| [production-smoke.yml](.github/workflows/production-smoke.yml) | Successful Vercel **Production** deploy, or `workflow_dispatch` | `apply-schema` then Playwright smoke. Does **not** run on PRs         |
| [release-sync.yml](.github/workflows/release-sync.yml)         | Release PR **merged** to `main`                                 | Merge the release branch into `test`; not a deploy                    |

CI does **not** run `npm run build`. Vercel builds and deploys the
SPA. `ci.yml` does not trigger `production-smoke.yml`.

## CI/CD execution flow

```
Code change / Pull Request
    ↓
CI (format, commitlint on PR, secrets scan, lint, Vitest, Playwright)
    ↓
Human QA on test
    ↓
Human merge to main
    ↓
Vercel Production deploy
    ↓
production-smoke.yml (if Production success or manual dispatch)
         ├── apply-schema (SQL from main)
         └── smoke (Playwright)
```

After a **release** PR merges to `main`, `release-sync.yml` syncs
`test` from the **release branch** (not a product QA gate).

If a required CI check fails, the PR is not merge-clean. Prettier
FAIL on an agent PR: format locally, commit, push a **new** SHA — do
not rerun the old commit.

## Documentation

| Path                                                                                                     | Contents                                |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [docs/sdlc/](docs/sdlc/)                                                                                 | Lifecycle, DoR, DoD, roadmap, testing   |
| [docs/requirements/](docs/requirements/)                                                                 | AUTH-001 business requirement           |
| [docs/features/](docs/features/)                                                                         | Feature packs                           |
| [docs/specifications/](docs/specifications/)                                                             | AUTH-001 functional and technical specs |
| [docs/architecture/](docs/architecture/)                                                                 | Environments and data model             |
| [docs/releases/](docs/releases/)                                                                         | Release records                         |
| [docs/test-plans/](docs/test-plans/), [test-cases](docs/test-cases/), [test-reports](docs/test-reports/) | Tests                                   |
| [docs/git/](docs/git/)                                                                                   | Branching and commits                   |
| [docs/ai/](docs/ai/)                                                                                     | Agent rules vs skills                   |
| [docs/adr/](docs/adr/)                                                                                   | Architecture decisions                  |

## Security

- Supabase Auth and **PostgreSQL RLS**
- Secrets in GitHub Actions and Vercel — not in git
- Secret scan: gitleaks in CI
- [SECURITY.md](SECURITY.md),
  [security review](docs/sdlc/security-review.md)

There is no `docs/security/` directory.

## License

[MIT License](./LICENSE)

## How to use and extend

Skills and coding wait for **you**. They do not start in the
background. Do not start with “create a page and wire Supabase”.

**New product feature**

```
REQ + FS → stories / AC → BDD (risk) → test design → TS
    → human DoR → plan → human PLANNED
    → feature/<id>-<description> → implement + tests → PR → test → QA
```

Canonical: [docs/sdlc/lifecycle.md](docs/sdlc/lifecycle.md). Start with
`feature-orchestrator` when you ask.

**New page or component in `src/`** — only if `PLANNED` and the plan
lists the file. Do not invent fields, roles, or routes.

**New database table** — TS (and data-model if shared) → approved plan
→ migration under `supabase/migrations/` → tests → human applies
non-prod → after `main`, production smoke workflow. Do not paste
production SQL in the Dashboard.

**New RLS behaviour** — update TS, migration in git, integration
tests; production via the same smoke job. UI-only checks are not
enough.

**Skills** — prompt or @skill. Example: `feature-orchestrator` at
feature start; `execute-tests` for evidence; `release-and-verify`
after QA on `test`.
