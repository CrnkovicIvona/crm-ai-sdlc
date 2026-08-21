# ADR-0001: Engineering foundation and intended platform

- Status: Accepted
- Date: 2026-08-20
- Deciders: Human developer (plan approval for ENG-001)

## Context

BankCRM needs a repository foundation for AI-assisted SDLC before any
application is built. The human specified the collaboration and quality
toolchain. The React hosting framework (for example Vite SPA vs
Next.js) was not specified.

## Decision

Adopt this **process and platform intent** now:

- Cursor for AI-assisted development (rules vs skills vs docs)
- GitHub for source, Issues/Projects, and pull requests
- GitHub Actions for CI quality gates
- Vercel for Preview and Production **later**
- Supabase for PostgreSQL and auth **later**
- TypeScript and React for the future UI
- Vitest, Playwright, ESLint, Prettier as the quality toolchain
- Branching: `main` (production), `test` (QA), `feature|bugfix|docs|chore`
- Conventional Commits
- No application source, no database schema, no production deploy in ENG-001

Defer the React framework choice to a future ADR at application
bootstrap. Implementation remains framework-agnostic until then.

## Options considered

1. Bootstrap a full React app in ENG-001 — rejected; out of scope
2. Document platform intent only — accepted
3. Choose Next.js vs Vite now — deferred; not specified by the human

## Consequences

- Foundation CI cannot run application tests yet
- ESLint config waits for `src/`
- Environment variable names are reserved, not instantiated
- Contributors follow SDLC states and human gates from day one
