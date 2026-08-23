---
name: author-user-stories
description: Write user stories and acceptance criteria from the functional specification. Use after FS, before BDD.
---

# Author user stories

New work: `docs/features/<ID>/user-stories.md`.

## Rules

- Map each story to FR-### and REQ.
- AC must be testable. If an AC cannot be observed yet (e.g. no UI
  resource), say so — do not invent modules.
- Where the feature will ship to Production, AC should name the
  **critical production smoke** paths (the smallest post-deploy
  checks). Those become `tests/smoke/` cases, not a duplicate of
  full e2e.
- Do not add behavior absent from FS/approved BD.

## Steps

1. Read FS (and REQ).
2. Write US + AC.
3. Update feature traceability and the matrix.

## Done

Stories cover stated FRs only.
