# Definition of Done

Do not claim Done because code exists.

Distinguish: **Implemented** | **Tests executed** | **PASSED** |
**FAILED** | **Security checks passed** | **Code reviewed** |
**AC verified** | **Traceability updated** | **Docs updated** |
**CI passed** | **Deployment verified**.

## Application feature

- [ ] Implementation matches **approved** AC (AC unchanged unless human edited)
- [ ] Required unit, integration, e2e tests exist as in the test plan
- [ ] Those tests were **executed** with evidence (`docs/test-reports/`)
- [ ] Out-of-scope tests are **not executed**, never passed
- [ ] Risk-based regression executed with evidence (High: pack cannot be skipped without human)
- [ ] Security review at required level (`docs/sdlc/security-review.md`)
- [ ] Code review completed (agent `review-code` before the PR; human reads the diff as part of QA on `test` — not a separate lifecycle state)
- [ ] CI green without weakened gates (SKIPPED ≠ PASSED)
- [ ] PR merged to `test` (agent does not merge `main`)
- [ ] Human QA/acceptance for release
- [ ] Production: human merge to `main`; smoke executed or human-deferred
- [ ] Traceability includes implementation paths and verification
- [ ] Docs match what shipped

## Docs-only / Low

- [ ] Accurate path; format check; PR to `test`; no secrets

Never claim production Done without human merge to `main`.
