# Definition of Ready

A work item may move from `SPECIFIED` to `READY` only when **all**
required items for its **risk class** are true **and a human** has
confirmed Ready on the Issue.

`READY` means: specification is good enough to write an
**implementation plan**. It does **not** mean coding, `src/`,
`feature/`, migrations, or RLS.

## Checklist

- [ ] GitHub Issue is the source request
- [ ] Business objective, scope, and out of scope are explicit
- [ ] REQ exists (legacy `docs/requirements/` or `docs/features/<ID>/requirement.md`)
- [ ] Functional specification exists (WHAT, no SQL/file trees)
- [ ] User stories and AC exist (unless Low docs/chore reduced DoR)
- [ ] BDD exists when risk is Medium+ (High: required)
- [ ] Test cases and risk-based test plan exist (app features)
- [ ] Traceability: REQ → FR → US → AC → BDD → TC → TDE (implementation empty until code)
- [ ] Technical specification exists for app features (HOW in existing ADRs)
- [ ] High risk: decision log; security implications stated; relevant BD/TD human-approved or explicitly accepted as non-blocking
- [ ] Open questions listed; none silently answered; remaining TBDs are **non-blocking** or human-accepted
- [ ] Dependencies and environments identified
- [ ] No secrets in ticket or docs
- [ ] Human Ready recorded on the Issue

## Not required for DoR

Exact source file names, final folder tree, SQL migration text, RLS
policy SQL, implemented tests, pixel UI, exact copy.

## Reduced DoR

Docs-only / Low chores may omit BDD if the Issue says so. Still no
invented product behavior.

## Agent

Do not confirm Ready yourself. Do not start `src/` or `feature/` in
`READY`. That is `PLANNED` only.

CRM-001: BD-T001–T006, BD-T010, and TD-C006 remain blocking unless
the human explicitly accepts them as non-blocking. AUTH-001 and
CRM-001 stay `SPECIFIED` until human DoR.

See [risk-model.md](risk-model.md) and [artifacts.md](artifacts.md).
