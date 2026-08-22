# ADR-0002: Vite + React + TypeScript frontend

- Status: Accepted
- Date: 2026-08-21
- Deciders: Human (AUTH-001 decisions; Issue #5)
- Related: [ADR-0001](0001-engineering-foundation.md), TD-001 in
  [../decisions/AUTH-001-decisions.md](../decisions/AUTH-001-decisions.md)

## Context

ADR-0001 accepted TypeScript and React for the future UI and deferred
the hosting framework (Vite SPA vs Next.js) until application
bootstrap. AUTH-001 is the first product feature that requires a
frontend bootstrap choice.

## Decision

BankCRM’s frontend is **Vite + React + TypeScript**.

This closes the framework choice deferred in ADR-0001. AUTH-001
routing (React Router, public login route, protected CRM routes) is
recorded as TD-002 in the AUTH-001 decision log and in the technical
specification, not as a separate ADR.

## Options considered

1. Keep the framework deferred — rejected; AUTH-001 cannot be
   implemented without a hosting choice
2. Next.js — not selected
3. Vite + React + TypeScript — accepted

## Consequences

- Implementation (when `PLANNED`) bootstraps a Vite React + TypeScript
  app. No `src/` is created by this ADR.
- SPA client session via Supabase Auth is the matching session model
  (TD-007), not Next.js server sessions.
- React Router is in scope for AUTH-001 (TD-002).
- Environment variable naming follows Vite public-prefix conventions
  when `.env.example` is added in a later approved phase.
- ADR-0001 remains accepted for process, CI, Supabase/Vercel intent,
  and the quality toolchain.
