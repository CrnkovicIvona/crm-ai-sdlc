# Architecture

Environment intent: [environments.md](environments.md). Relational
schema (ER): [data-model.md](data-model.md). Truth for tables is
`supabase/migrations/`, not the diagram.

Frontend hosting: [ADR-0002](../adr/0002-vite-react-typescript.md)
(Vite + React + TypeScript). Application code lives in `src/`.

Feature-level **how** belongs in AUTH-001
[../specifications/technical/](../specifications/technical/) or, for
new work, `docs/features/<ID>/technical-spec.md`. Do not treat a
technical specification as an accepted ADR. Canonical process:
[../sdlc/lifecycle.md](../sdlc/lifecycle.md).

Do not add system design for unstated BankCRM modules.
