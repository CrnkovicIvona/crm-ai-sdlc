# BankCRM

BankCRM is a role-based CRM for a bank: staff authenticate, then work with
**clients** and their **products** (bank accounts, cards, investments). Access
is enforced in the UI and in **PostgreSQL Row Level Security**.

**Stack:** Vite, React, TypeScript, React Router, Supabase (Auth + PostgreSQL).
Tests: Vitest and Playwright. Hosting: Vercel. CI: GitHub Actions.

Vite + React + TypeScript is the accepted frontend
([ADR-0002](docs/adr/0002-vite-react-typescript.md)). Supabase provides Auth
and Postgres with RLS so authorization is not UI-only
([AUTH-001 TS](docs/specifications/technical/AUTH-001.md)). Platform intent:
[ADR-0001](docs/adr/0001-engineering-foundation.md).

Production host: [https://crm-ai-sdlc.vercel.app](https://crm-ai-sdlc.vercel.app)

## Features

| Area                 | What it covers                                                                 | Specs                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Sign-in and session  | Email/password login, `/login` vs `/app`, ADMIN and VIEWER, logout             | [AUTH-001 FS](docs/specifications/functional/AUTH-001.md), [TS](docs/specifications/technical/AUTH-001.md) |
| Clients and products | Client registry, products by type, soft-delete, RLS (ADMIN write, VIEWER read) | [CRM-001 FS](docs/features/CRM-001/functional-spec.md), [TS](docs/features/CRM-001/technical-spec.md)      |

Later increments (for example DASH-001) are listed on the
[product roadmap](docs/sdlc/roadmap.md). Increment lifecycle lives there, in
`docs/features/<ID>/README.md`, and on the GitHub Issue — not as banners here.

## Architecture

The browser loads a Vite SPA. The client uses the Supabase anon key. Postgres
**RLS** enforces ADMIN vs VIEWER. Vercel hosts the static build.

- [Architecture index](docs/architecture/README.md) — SPA, Vercel, where “how”
  specs live
- [Environments](docs/architecture/environments.md) — local, `test`, production
- [Data model](docs/architecture/data-model.md) — `clients`, `client_products`;
  SQL in `supabase/migrations/` is truth; production apply is
  `production-smoke.yml`
- RLS: [AUTH-001 TS](docs/specifications/technical/AUTH-001.md),
  [CRM-001 TS](docs/features/CRM-001/technical-spec.md)
- [Branching](docs/git/branching.md) — `main` / `test` / `release/*`

## Project structure

```
src/                  # Vite React SPA (pages, auth, data access)
supabase/migrations/  # PostgreSQL + RLS (production: smoke workflow)
tests/                # Vitest (unit, rls) and Playwright (e2e, smoke)
docs/                 # SDLC, features, architecture, tests, AI
.github/workflows/    # ci.yml, production-smoke.yml, release-sync.yml
.cursor/              # always-on rules and on-demand skills
```

| Path                   | What it is                   | How you use it                                                                           |
| ---------------------- | ---------------------------- | ---------------------------------------------------------------------------------------- |
| `src/`                 | Application UI and client    | Change only after the increment is planned; add routes and tests named in that plan      |
| `supabase/migrations/` | Schema and RLS in git        | Commit SQL as planned; non-prod you apply locally; production via `production-smoke.yml` |
| `tests/`               | Automated checks             | `npm test`, `npm run test:e2e`, `npm run test:smoke`                                     |
| `docs/`                | Product and process truth    | Specs and SDLC; do not treat root README as increment status                             |
| `.github/workflows/`   | CI and smoke                 | Gates on pull requests; Vercel still builds production                                   |
| `.cursor/`             | Agent constraints and skills | Rules always load; skills run when you invoke them                                       |

## Engineering and skills

Cursor loads **always-on rules** from `.cursor/rules/` (git, SDLC, tests,
security, this README rule).

**On-demand skills** under `.cursor/skills/`: `feature-orchestrator`,
`analyze-requirements`, `author-specifications`, `author-user-stories`,
`author-bdd`, `author-decisions`, `author-adr`, `plan-implementation`,
`plan-tests`, `execute-tests`, `report-tests`, `review-code`, `prepare-pr`,
`sync-feature-docs`, `release-and-verify`, `manage-bugs`, `heal`,
`ui-ux-redesign`. Index: [docs/ai/README.md](docs/ai/README.md).

### What the agent does when asked

Skills do **not** run on a schedule. When you prompt (or @ a skill), the agent
may draft requirements, FS/TS, stories, BDD, tests, and plans; implement
**after** human plan approval (`PLANNED`); execute tests when asked; open a PR
to `test`; and keep this README aligned with this rule. It does not merge
`main`. Production schema is applied by the Production smoke workflow, not
by pasting SQL.

### What you must do

- Record DoR and plan approval
- QA on `test`
- Merge to `main`
- Set GitHub secret `PRODUCTION_SUPABASE_DB_URL` once (production Postgres
  URI; never `VITE_*`)
- Approve production deploy (Vercel)
- Start a skill with a prompt — nothing in `.cursor/skills/` starts itself

## Development workflow

Specify → Definition of Ready → plan → implement on a feature branch → pull
request into **`test`** → human QA → human merges **`main`** → production
smoke. Canonical process: [docs/sdlc/lifecycle.md](docs/sdlc/lifecycle.md).

Application roles: **ADMIN** (full CRM write) and **VIEWER** (read).

## Git workflow

| Branch                               | Role                              |
| ------------------------------------ | --------------------------------- |
| `main`                               | Production                        |
| `test`                               | Integration and QA                |
| `release/<rel-id>`                   | Release train to `main`           |
| `feature/<feature-id>-<description>` | Feature implementation            |
| `bugfix/`, `docs/`, `chore/`         | Fixes, documentation, maintenance |

The agent does not merge `main`. Details:
[docs/git/branching.md](docs/git/branching.md).

## Installation

Requires **Node.js 20+** (`package.json` `engines`) and npm.

```bash
git clone https://github.com/CrnkovicIvona/crm-ai-sdlc.git
cd crm-ai-sdlc
npm install
cp .env.example .env
```

Set in `.env` (names only; never commit values):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Optional for local integration and E2E (same names as `.env.example`):
`SUPABASE_SERVICE_ROLE_KEY` (never `VITE_*`), `E2E_ADMIN_EMAIL`,
`E2E_ADMIN_PASSWORD`, `E2E_VIEWER_EMAIL`, `E2E_VIEWER_PASSWORD`. Production
smoke uses `SMOKE_BASE_URL` plus the `E2E_*` accounts.

## Running locally

```bash
npm run dev
```

Opens the Vite dev server (default http://localhost:5173). Create or use a
Supabase project, put its URL and anon key in `.env`, and apply the SQL under
`supabase/migrations/` to **that non-prod** project yourself. Production
schema is applied by `.github/workflows/production-smoke.yml` when
`PRODUCTION_SUPABASE_DB_URL` is set.

## Testing

```bash
npm test              # Vitest (jsdom + Node RLS integration)
npm run test:e2e      # Playwright (local app + E2E_* users)
npm run test:smoke    # Playwright against SMOKE_BASE_URL
```

Strategy and packs: [testing strategy](docs/sdlc/testing-strategy.md),
[test plans](docs/test-plans/), [test cases](docs/test-cases/),
[test reports](docs/test-reports/),
[CRM-001 test plan](docs/features/CRM-001/test-plan.md). Skip is not pass.

## CI/CD

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) on `test` and pull
requests to `test`/`main`: Prettier, commitlint (pull requests), gitleaks,
ESLint, Vitest, Playwright. CI does **not** run `npm run build`; Vercel builds
and deploys the production SPA.

Production smoke:
[`.github/workflows/production-smoke.yml`](.github/workflows/production-smoke.yml)
(applies SQL from `main`, then Playwright smoke). After a release merge,
[release-sync.yml](.github/workflows/release-sync.yml) fast-forwards `test` to
`main` when possible.

## Documentation

| Path                                                                                                     | Contents                                       |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [docs/sdlc/](docs/sdlc/)                                                                                 | Lifecycle, DoR, DoD, roadmap, testing          |
| [docs/features/](docs/features/)                                                                         | Feature packs (CRM-001; AUTH-001 index + plan) |
| [docs/specifications/](docs/specifications/)                                                             | AUTH-001 functional and technical specs        |
| [docs/architecture/](docs/architecture/)                                                                 | Environments and data model                    |
| [docs/releases/](docs/releases/)                                                                         | Release records                                |
| [docs/test-plans/](docs/test-plans/), [test-cases](docs/test-cases/), [test-reports](docs/test-reports/) | Tests                                          |
| [docs/git/](docs/git/)                                                                                   | Branching and commits                          |
| [docs/ai/](docs/ai/)                                                                                     | Agent rules vs skills                          |

## Security

- Authorization is **RLS in Postgres**, not only the UI
- Secrets stay in GitHub Actions and Vercel — not in git
- [SECURITY.md](SECURITY.md), [security review](docs/sdlc/security-review.md)

## License

[MIT](LICENSE)

## How to use and extend

Skills and coding wait for **you**. They do not start in the background.

**New product feature**

1. Requirements and functional spec (WHAT)
2. User stories, acceptance criteria, BDD (when required), test design, then
   technical spec (HOW)
3. Human Definition of Ready, then an implementation plan
4. Human plan approval (`PLANNED`)
5. Branch `feature/<feature-id>-<description>`, implement only the plan, add
   tests, open a PR to `test`

Process: [docs/sdlc/lifecycle.md](docs/sdlc/lifecycle.md). When starting a
feature, ask the agent to follow `feature-orchestrator`.

**New page or component in `src/`**

Only if the increment is planned and the plan lists that file. Add the route
and tests from the plan. Do not invent Client fields, roles, or APIs.

**New database table**

Capture it in the technical spec (and
[data-model.md](docs/architecture/data-model.md) if it is shared schema). Add a
migration under `supabase/migrations/` as planned. Apply that SQL to the
**non-prod** project you use locally. Production schema is applied by
`.github/workflows/production-smoke.yml` after the SQL is on `main`. Then add
tests.

**New RLS behaviour**

Update the technical spec, the migration in git, and integration tests.
Production RLS is applied by the same smoke workflow. Checking only the UI is
not enough.

**Running skills**

Mention the skill in the prompt (or @ it). Example: ask for
`feature-orchestrator` at the start of a feature; ask for `execute-tests` when
you want evidence. Nothing under `.cursor/skills/` runs until you do that.
