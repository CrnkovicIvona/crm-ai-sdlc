# BankCRM

BankCRM is a role-based CRM for a bank: staff authenticate, then work with **clients** and their **products** (bank accounts, cards, investments). Access is enforced in the UI and in **PostgreSQL Row Level Security**.

**Stack:** Vite, React, TypeScript, React Router, Supabase (Auth + PostgreSQL). Tests: Vitest and Playwright. Hosting: Vercel.

Production: [https://crm-ai-sdlc.vercel.app](https://crm-ai-sdlc.vercel.app)

## Features

| Area | What it covers | Specs |
|------|----------------|--------|
| Sign-in and session | Email/password login, `/login` vs `/app`, ADMIN and VIEWER, logout | [AUTH-001 FS](docs/specifications/functional/AUTH-001.md), [TS](docs/specifications/technical/AUTH-001.md) |
| Clients and products | Client registry, products by type, soft-delete, RLS (ADMIN write, VIEWER read) | [CRM-001 FS](docs/features/CRM-001/functional-spec.md), [TS](docs/features/CRM-001/technical-spec.md) |

Later increments (for example DASH-001) are listed on the [product roadmap](docs/sdlc/roadmap.md). Lifecycle status for each increment lives there, in `docs/features/<ID>/README.md`, and on the GitHub Issue — not in this file.

## Architecture

- [Architecture index](docs/architecture/README.md) — SPA, Vercel, where “how” specs live
- [Environments](docs/architecture/environments.md) — local, `test`, production
- [Data model](docs/architecture/data-model.md) — `clients`, `client_products`; SQL in `supabase/migrations/` is truth
- RLS: [AUTH-001 TS](docs/specifications/technical/AUTH-001.md), [CRM-001 TS](docs/features/CRM-001/technical-spec.md)
- [Branching](docs/git/branching.md) — `main` / `test` / `release/*`

## Project structure

```
src/                  # Vite React SPA
supabase/migrations/  # PostgreSQL + RLS
tests/                # Vitest (unit, rls) and Playwright (e2e, smoke)
docs/                 # SDLC, features, architecture, tests, AI
.github/workflows/    # ci.yml, production-smoke.yml, release-sync.yml
.cursor/              # agent rules and skills
```

## Engineering and skills

Cursor loads **always-on rules** from `.cursor/rules/` (git, SDLC, tests, security, this README rule).

**On-demand skills** under `.cursor/skills/`: `feature-orchestrator`, `analyze-requirements`, `author-specifications`, `author-user-stories`, `author-bdd`, `author-decisions`, `author-adr`, `plan-implementation`, `plan-tests`, `execute-tests`, `report-tests`, `review-code`, `prepare-pr`, `sync-feature-docs`, `release-and-verify`, `manage-bugs`, `heal`, `ui-ux-redesign`. Index: [docs/ai/README.md](docs/ai/README.md).

## Development workflow

Specify → Definition of Ready → plan → implement on a feature branch → pull request into **`test`** → human QA → human merges **`main`** → production smoke. Canonical process: [docs/sdlc/lifecycle.md](docs/sdlc/lifecycle.md).

Application roles: **ADMIN** (full CRM write) and **VIEWER** (read).

## Git workflow

| Branch | Role |
|--------|------|
| `main` | Production |
| `test` | Integration and QA |
| `release/<rel-id>` | Release train to `main` |
| `feature/<feature-id>-<description>` | Feature implementation |
| `bugfix/`, `docs/`, `chore/` | Fixes, documentation, maintenance |

The agent does not merge `main`. Details: [docs/git/branching.md](docs/git/branching.md).

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

Optional for local integration and E2E (same names as `.env.example`): `SUPABASE_SERVICE_ROLE_KEY` (never `VITE_*`), `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`, `E2E_VIEWER_EMAIL`, `E2E_VIEWER_PASSWORD`. Production smoke uses `SMOKE_BASE_URL` plus the `E2E_*` accounts.

## Running locally

```bash
npm run dev
```

Opens the Vite dev server (default http://localhost:5173). Point the SPA at a Supabase project whose migrations match `supabase/migrations/`.

## Testing

```bash
npm test              # Vitest (jsdom + Node RLS integration)
npm run test:e2e      # Playwright (local app + E2E_* users)
npm run test:smoke    # Playwright against SMOKE_BASE_URL
```

Strategy and packs: [testing strategy](docs/sdlc/testing-strategy.md), [test plans](docs/test-plans/), [test cases](docs/test-cases/), [test reports](docs/test-reports/), [CRM-001 test plan](docs/features/CRM-001/test-plan.md). Skip is not pass.

## CI/CD

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) on `test` and pull requests to `test`/`main`: Prettier, commitlint (pull requests), gitleaks, ESLint, Vitest, Playwright. CI does **not** run `npm run build`; Vercel builds and deploys the production SPA.

Production smoke: [`.github/workflows/production-smoke.yml`](.github/workflows/production-smoke.yml). After a release merge, [release-sync.yml](.github/workflows/release-sync.yml) fast-forwards `test` to `main` when possible.

## Documentation

| Path | Contents |
|------|----------|
| [docs/sdlc/](docs/sdlc/) | Lifecycle, DoR, DoD, roadmap, testing |
| [docs/features/](docs/features/) | Feature packs (CRM-001; AUTH-001 index + plan) |
| [docs/specifications/](docs/specifications/) | AUTH-001 functional and technical specs |
| [docs/architecture/](docs/architecture/) | Environments and data model |
| [docs/releases/](docs/releases/) | Release records |
| [docs/test-plans/](docs/test-plans/), [test-cases](docs/test-cases/), [test-reports](docs/test-reports/) | Tests |
| [docs/git/](docs/git/) | Branching and commits |
| [docs/ai/](docs/ai/) | Agent rules vs skills |

## Security

- Authorization is **RLS in Postgres**, not only the UI
- Secrets stay in GitHub Actions and Vercel — not in git
- [SECURITY.md](SECURITY.md), [security review](docs/sdlc/security-review.md)

## License

[MIT](LICENSE)
