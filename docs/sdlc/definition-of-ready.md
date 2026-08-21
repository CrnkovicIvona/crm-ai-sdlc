# Definition of Ready

A work item may move from `SPECIFIED` to `READY` only when **all** of
the following are true and a **human** has confirmed Ready.

## Checklist

- [ ] GitHub Issue exists and is the source request
- [ ] Requirements are in `docs/requirements/` and do not add invented scope
- [ ] Functional specification exists under `docs/specifications/functional/`
- [ ] User stories and testable acceptance criteria are in `docs/user-stories/`
- [ ] BDD scenarios are in `docs/bdd/` and derived from AC
- [ ] Test cases exist in `docs/test-cases/`
- [ ] A risk-based test plan exists in `docs/test-plans/`
- [ ] Traceability rows exist in `docs/traceability/matrix.md` (including FR and technical design elements)
- [ ] Technical specification exists under `docs/specifications/technical/`
- [ ] Open business and technical questions are listed; none are silently answered
- [ ] Dependencies and environments are identified
- [ ] No secrets are in the ticket or docs
- [ ] Human approval of Ready is recorded on the Issue

An **implementation plan** is **not** part of DoR. It is produced in
`READY` and approved before `PLANNED`. Do not create a `feature/`
branch or application code at this gate.

Do not confirm Ready if unresolved questions would force invented
product or technical decisions during implementation.

## Reduced DoR

Docs-only (`docs/*` branches) and pure chores may omit BDD and test
automation if risk is **Low** and the Issue states the reduced DoR.
They still must not invent product behavior.

## Agent rules

The agent must not start application implementation in `READY`.
Application implementation starts only in `PLANNED` after human approval
of the implementation plan. Functional and technical specifications are
not an implementation plan and do not authorize coding.
