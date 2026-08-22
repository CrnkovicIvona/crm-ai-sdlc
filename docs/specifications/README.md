# Specifications

Each product feature has two specification artifacts before
implementation. New features use `docs/features/<ID>/`. AUTH-001 keeps
the paths below.

| Artifact                 | AUTH-001 location | New features         | Answers |
| ------------------------ | ----------------- | -------------------- | ------- |
| Functional specification | `functional/`     | `functional-spec.md` | What    |
| Technical specification  | `technical/`      | `technical-spec.md`  | How     |

Do not mix business rules into the technical specification, or
implementation choices into the functional specification.

Unknowns are marked `TBD — HUMAN DECISION REQUIRED`. Do not invent
answers.

## Functional (what)

One AUTH-001 file: `functional/<WORK-ITEM-ID>.md`. Describe **what**
the feature must do. Do not describe source layout, libraries, tables,
RLS policies, or APIs.

Write after the business requirement and before user stories for new
work. AUTH-001 received this artifact after stories because it
continued from `SPECIFIED`.

## Technical (how)

One AUTH-001 file: `technical/<WORK-ITEM-ID>.md`. Describe **how**
approved functionality will be implemented inside existing architecture
and accepted ADRs. Do not invent product behavior. Do not create
`src/`, migrations, RLS, or endpoints in this phase.

Unresolved technical choices are `TBD — HUMAN DECISION REQUIRED`.
Propose options only when the architecture already constrains them;
do not silently select among deferred ADRs.

Templates: [functional/TEMPLATE.md](functional/TEMPLATE.md),
[technical/TEMPLATE.md](technical/TEMPLATE.md).
