# Features

## AUTH-001 (existing layout — do not migrate unless asked)

Keep current files under `docs/requirements/`,
`docs/specifications/`, `docs/user-stories/`, `docs/bdd/`,
`docs/test-*`, `docs/decisions/AUTH-001-decisions.md`.

Implementation plan (**Approved**; code on `main`, lifecycle
**`RELEASED`** after REL-003 production smoke 5/5 PASSED):
[AUTH-001/implementation-plan.md](AUTH-001/implementation-plan.md).

## Future application features (canonical)

```
docs/features/<WORK-ITEM-ID>/
  requirement.md
  functional-spec.md
  technical-spec.md
  decisions.md
  user-stories.md
  bdd.md
  test-cases.md
  test-plan.md
  traceability.md
  implementation-plan.md   # only after READY; empty until then
```

CRM-001 uses this layout. Index rows still go in
`docs/traceability/matrix.md`.

Templates: copy headings from `docs/requirements/TEMPLATE.md`,
`docs/specifications/*/TEMPLATE.md`, `docs/decisions/TEMPLATE.md`,
`docs/plans/TEMPLATE.md`, `docs/user-stories/TEMPLATE.md`,
`docs/bdd/TEMPLATE.md`, `docs/test-cases/TEMPLATE.md`,
`docs/test-plans/TEMPLATE.md`, and `docs/traceability/FEATURE-TEMPLATE.md`.
