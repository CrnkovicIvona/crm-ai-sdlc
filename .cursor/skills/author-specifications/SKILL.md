---
name: author-specifications
description: Author functional and technical specifications without inventing decisions. Use after requirements (functional spec) and after traceability (technical spec), before the Definition of Ready gate.
---

# Author specifications

Do not implement the application. Do not create `src/`, migrations,
RLS, or endpoints.

## Functional specification (what)

Prerequisite: `docs/requirements/` for the work item.

1. Create `docs/specifications/functional/<WORK-ITEM-ID>.md` from the
   template.
2. Include only stated business requirements. Mark gaps
   `TBD — HUMAN DECISION REQUIRED`.
3. Do not describe tables, RLS, frameworks, or APIs.
4. Update traceability (REQ → FR → US when stories exist).

For **new** work, write this **before** user stories. If stories
already exist (AUTH-001 continuation), add the functional
specification without restarting the lifecycle.

## Technical specification (how)

Prerequisite: functional specification; existing ADRs and
`docs/architecture/`; user stories, AC, BDD, test cases/plan, and
traceability (orchestrator: technical spec **after** traceability).

1. Create `docs/specifications/technical/<WORK-ITEM-ID>.md`.
2. Reuse accepted ADRs. Do not replace them. Do not introduce
   frameworks not already decided.
3. Separate business rules (functional spec) from enforcement
   (technical spec).
4. If the architecture uses Supabase client access, do not invent a
   REST API.
5. Propose schema/RLS only as logical design. Do not apply it.
6. Unresolved technical choices: `TBD — HUMAN DECISION REQUIRED`.
7. Durable platform choices still go through `author-adr`.

## Done

Both artifacts exist, traceability includes FR and TDE/TR, state
remains `SPECIFIED` until a **human** records Definition of Ready.
Do not claim Ready if open questions block implementation.
