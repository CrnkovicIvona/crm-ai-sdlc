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

Templates: [functional/TEMPLATE.md](functional/TEMPLATE.md),
[technical/TEMPLATE.md](technical/TEMPLATE.md).
