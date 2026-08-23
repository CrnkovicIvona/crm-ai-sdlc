# Definition of Done

Do not claim Done because code exists. Do not claim `RELEASED` because
code was merged to `main`.

There is **no** `DONE` lifecycle state. “Done” means this checklist is
true **and** artifact status on `main` is `RELEASED`.

Distinguish: **Implemented** | **Tests executed** | **PASSED** |
**FAILED** | **Security checks passed** | **Code reviewed** |
**AC verified** | **Traceability updated** | **Docs updated** |
**CI passed** | **On `main` (`ON_MAIN`)** | **Deployment known** |
**Production smoke PASSED** | **`RELEASED`**.

SKIPPED, NOT APPLICABLE, NOT EXECUTED, and HEALING are never PASSED.

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
- [ ] Human merge of the **release PR** to `main` (state `ON_MAIN` until smoke PASSES)
- [ ] Deployment state **known** (production URL or recorded “not configured”)
- [ ] Production smoke **PASSED**: `tests/smoke/` executed against the
      production URL (`npm run test:smoke` or Production smoke
      workflow) with a log. A markdown checklist alone is not PASSED.
      If smoke was not run or any case FAILED, state remains `ON_MAIN`.
      Do not call this `RELEASED`.
- [ ] `sync-feature-docs` applied on `main` at `ON_MAIN` then at `RELEASED`
- [ ] Traceability on `main` includes implementation paths, test execution, verification, release id
- [ ] Docs on `main` match what shipped (REQ, FS, US, TS, feature README, roadmap, root README, REL)
- [ ] Release branch deleted **only after** successful sync into `test`

The agent must not say `RELEASED`, Done, or “complete” unless every
applicable box above is evidenced. If the merge to `main` happened but
smoke has not PASSED, the only correct status is:

**ON_MAIN — not RELEASED.**

## Docs-only / Low

- [ ] Accurate path; format check; PR to `test`; no secrets

Never claim production Done without human merge to `main`.
Never claim `RELEASED` without production smoke PASSED.
