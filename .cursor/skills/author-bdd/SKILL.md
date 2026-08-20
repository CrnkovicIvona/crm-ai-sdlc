---
name: author-bdd
description: Write Gherkin scenarios from acceptance criteria. Use after AC exist and before test planning.
---

# Author BDD

## Rules

- Derive scenarios only from AC.
- Do not add Given/When/Then steps that imply unstated product rules.
- Tag scenarios with US/AC IDs.

## Steps

1. Read user stories and AC.
2. Add `docs/bdd/<id>.feature.md` (or `.feature` when the app exists) from the template.
3. Map each scenario to AC in the traceability matrix.

## Done

Each AC has at least one scenario, or an explicit documented exception approved by the human.
