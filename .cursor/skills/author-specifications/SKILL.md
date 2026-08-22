---
name: author-specifications
description: Author functional (WHAT) and technical (HOW) specifications. Functional after REQ; technical after test design. Never implement.
---

# Author specifications

No `src/`, migrations, RLS SQL, or endpoints.

New work: `docs/features/<ID>/functional-spec.md` and
`technical-spec.md`. AUTH-001 keeps `docs/specifications/`.

## Functional (what)

1. Copy structure from `docs/specifications/functional/TEMPLATE.md`.
2. Only stated/approved business rules. TBD marked
   `TBD — HUMAN DECISION REQUIRED`.
3. No frameworks, tables, or APIs. May require that UI hiding is not
   the only authorization control (database boundary) without SQL.
4. High risk: point at the decision log; do not treat Proposed as
   approved.

## Technical (how)

Prerequisites: FS; ADRs; test design/traceability.

1. Reuse ADR-0001, ADR-0002, React Router, Supabase Auth, PostgreSQL
   RLS, Vitest, Playwright. Do not reopen Vite vs Next.js.
2. Reuse AUTH-001 session/roles for CRM-001; specify only new entities.
3. Logical schema and RLS **intent** only. No migrations.
4. No REST unless a human requires it (AUTH-001/CRM-001: Supabase
   client).
5. Technical TBDs marked. Durable platform → `author-adr`.

## Done

FS/TS exist for the risk class. State remains `SPECIFIED` until human
DoR. Do not claim Ready.
