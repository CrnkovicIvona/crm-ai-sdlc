# Definition of Done

A work item is Done only when the following are true for its risk class.

## Standard (application feature)

- [ ] Implementation matches **approved** acceptance criteria (AC unchanged unless the human edited them)
- [ ] Required unit, integration, and e2e tests exist as specified in the test plan
- [ ] Those required tests were **actually executed** with verifiable evidence (see testing strategy)
- [ ] Tests not in scope are listed as **not executed**, never as passed
- [ ] Risk-based regression from the test plan was executed with evidence
- [ ] Test report filed under `docs/test-reports/`
- [ ] Open bugs triaged; High/Critical have RCA as required
- [ ] Prettier (and later ESLint) and CI are green without weakened gates
- [ ] Security review completed at the required level
- [ ] Code review completed
- [ ] PR merged to `test` (human or allowed reviewer — not a merge to `main` by the agent)
- [ ] Human CI/QA approval recorded for release
- [ ] For production: human merge to `main`, smoke tests executed or explicitly deferred by the human
- [ ] Traceability matrix updated (REQ → FR → US → AC → BDD → TC → TDE → implementation)

## Docs-only / Low risk

- [ ] Change is accurate and placed in the correct docs path
- [ ] `npm run format:check` would pass
- [ ] PR targets `test`
- [ ] No secrets added

## Agent rules

Never claim Done if tests were not run. Never claim production Done
without a human merge to `main`.
