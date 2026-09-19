# Test report: DASH-001

- SHA: `0bea7eb` (`origin/test`)
- Date: 2026-09-14
- Plan: [../features/DASH-001/test-plan.md](../features/DASH-001/test-plan.md)
- Risk level: High
- Environment: GitHub Actions vs non-prod Vite (`test` CI). Production
  smoke: **NOT EXECUTED**

## Summary

| Result                                              | Count                                      |
| --------------------------------------------------- | ------------------------------------------ |
| Passed (executed, evidence cited)                   | 34 Vitest + 26 Playwright on `test` CI     |
| Failed                                              | 0 on that run                              |
| Not executed                                        | Production smoke (rel-003/004/006)         |
| Skipped (runner/job)                                | Commitlint on push to `test` (PR-only job) |
| Blocked (no oracle or High suite not run — secrets) | C008 (CRM, out of DASH-001)                |

Skipped and blocked are never passed.

## Requirement coverage

| AC           | TCs                                    | Result                        |
| ------------ | -------------------------------------- | ----------------------------- |
| AC-D001      | TC-D001-admin, TC-D001-viewer, TC-D014 | PASSED (`test` CI Playwright) |
| AC-D002      | TC-D002                                | PASSED                        |
| AC-D003–D013 | TC-D003–D013 unit                      | PASSED (Vitest)               |
| AC-D009 UI   | TC-D009-ui                             | PASSED                        |
| AC-D013 UI   | TC-D013-ui                             | PASSED                        |

Production smoke ACs: **NOT EXECUTED**.

## Exit criteria

| Level       | Criterion                             | Met?             |
| ----------- | ------------------------------------- | ---------------- |
| Unit        | TC-D003–D013                          | yes              |
| Integration | not required for DASH-001             | n/a              |
| E2E         | TC-D001, D002, D009-ui, D013-ui, D014 | yes on `test` CI |
| Smoke       | rel-006 / rel-007 on Production       | no               |

## Evidence

| Test             | Kind     | Result       | Evidence                                                                                 |
| ---------------- | -------- | ------------ | ---------------------------------------------------------------------------------------- |
| Vitest 34        | unit+RLS | PASSED       | [run 34856651861](https://github.com/CrnkovicIvona/crm-ai-sdlc/actions/runs/34856651861) |
| Playwright 26    | e2e      | PASSED       | same run                                                                                 |
| Production smoke | P        | NOT EXECUTED | after REL-007 merge                                                                      |

## Confirmation testing

BUG-002 nav buttons and BUG-003 success banner are on `test` (PRs #42,
#43). Production not retested.

## Residual risk (REL-006)

VIEWER cannot SELECT full deleted `clients` rows (CRM-001 RLS; PII).
Churn/new-including-deleted for KPIs is the stamps view (BUG-004 /
REL-007), not full-row SELECT.

## Bugs filed

[BUG-002](../bugs/BUG-002.md), [BUG-003](../bugs/BUG-003.md),
[BUG-004](../bugs/BUG-004.md).

## REL-007 addendum (`ad191ad`)

- Date: 2026-09-19
- Evidence: [run 35468058847](https://github.com/CrnkovicIvona/crm-ai-sdlc/actions/runs/35468058847)
- Vitest: 39 PASSED
- Vitest local RLS TC-D015: 1 PASSED
- Playwright: 26 PASSED, 1 SKIPPED (`TC-D015-ui` without
  `TC_D015_REQUIRE_VIEW=1`; SKIPPED ≠ PASSED)
- Production smoke (rel-003/004/006/007): **NOT EXECUTED**
- AC-D015 / TC-D015: EXECUTED and PASSED on PGlite + local
  PostgREST; hosted Preview e2e SKIPPED; Production **NOT EXECUTED**
