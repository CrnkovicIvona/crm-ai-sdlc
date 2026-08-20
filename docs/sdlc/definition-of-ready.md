# Definition of Ready

A work item may move from `SPECIFIED` to `READY` only when **all** of
the following are true and a **human** has confirmed Ready.

## Checklist

- [ ] GitHub Issue exists and is the source request
- [ ] Requirements are in `docs/requirements/` and do not add invented scope
- [ ] User stories and testable acceptance criteria are in `docs/user-stories/`
- [ ] BDD scenarios are in `docs/bdd/` and derived from AC
- [ ] Test cases exist in `docs/test-cases/`
- [ ] A risk-based test plan exists in `docs/test-plans/`
- [ ] Traceability rows exist in `docs/traceability/matrix.md`
- [ ] An implementation plan exists
- [ ] Dependencies and environments are identified
- [ ] No secrets are in the ticket or docs
- [ ] Human approval of Ready is recorded on the Issue

## Reduced DoR

Docs-only (`docs/*` branches) and pure chores may omit BDD and test
automation if risk is **Low** and the Issue states the reduced DoR.
They still must not invent product behavior.

## Agent rules

The agent must not start application implementation in `READY`.
Application implementation starts only in `PLANNED` after human approval
of the implementation plan.
