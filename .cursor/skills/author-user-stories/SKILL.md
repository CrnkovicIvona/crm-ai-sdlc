---
name: author-user-stories
description: Write user stories and acceptance criteria from approved requirements. Use after requirements exist and before BDD.
---

# Author user stories

## Rules

- Every story must map to a requirement ID.
- Acceptance criteria must be testable.
- Do not change requirements to make stories easier. If AC would add behavior, stop and ask.

## Steps

1. Read `docs/requirements/<id>.md`.
2. Create `docs/user-stories/<id>.md` from the template.
3. Number AC (`AC-###`) and link REQ/US IDs.
4. Update the traceability matrix.

## Done

Stories and AC cover the stated requirements only.
