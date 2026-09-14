# DASH-001 traceability

Chain: REQ → FR → US → AC → BDD → TC → TDE → Implementation →
Verification.

Implementation paths are filled. Lifecycle: **`ON_MAIN`** after
REL-006 merge; not `RELEASED`. Verification: **PASSED** on `test` CI
(run 34856651861). Production smoke: **NOT EXECUTED**.

| REQ          | FR      | US      | AC      | BDD     | TC              | TDE      | Implementation                                                                                                                     | Verification                              |
| ------------ | ------- | ------- | ------- | ------- | --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| REQ-DASH-001 | FR-D001 | US-D001 | AC-D001 | AC-D001 | TC-D001, D014   | TDE-D001 | `src/App.tsx`, `src/pages/AppShell.tsx`, `src/pages/DashboardPage.tsx`, `tests/e2e/dashboard.spec.ts`                              | PASSED `test` CI; prod smoke NOT EXECUTED |
| REQ-DASH-001 | FR-D001 | US-D001 | AC-D002 | AC-D002 | TC-D002         | TDE-D001 | `src/auth/RequireAuth.tsx`, `tests/e2e/dashboard.spec.ts`                                                                          | PASSED `test` CI; prod smoke NOT EXECUTED |
| REQ-DASH-001 | FR-D002 | US-D002 | AC-D003 | AC-D003 | TC-D003         | TDE-D002 | `src/lib/dashboardMetrics.ts`, `tests/unit/dashboardMetrics.test.ts`                                                               | PASSED `test` CI; prod smoke NOT EXECUTED |
| REQ-DASH-001 | FR-D003 | US-D002 | AC-D004 | AC-D004 | TC-D004         | TDE-D002 | `src/lib/dashboardMetrics.ts`, `tests/unit/dashboardMetrics.test.ts`                                                               | PASSED `test` CI; prod smoke NOT EXECUTED |
| REQ-DASH-001 | FR-D004 | US-D002 | AC-D005 | AC-D005 | TC-D005         | TDE-D002 | `src/lib/dashboardMetrics.ts`, `tests/unit/dashboardMetrics.test.ts`                                                               | PASSED `test` CI; prod smoke NOT EXECUTED |
| REQ-DASH-001 | FR-D005 | US-D002 | AC-D006 | AC-D006 | TC-D006         | TDE-D002 | `src/lib/dashboardMetrics.ts`, `tests/unit/dashboardMetrics.test.ts`                                                               | PASSED `test` CI; prod smoke NOT EXECUTED |
| REQ-DASH-001 | FR-D005 | US-D002 | AC-D007 | AC-D007 | TC-D007a, D007b | TDE-D002 | `src/lib/dashboardMetrics.ts`, `tests/unit/dashboardMetrics.test.ts`                                                               | PASSED `test` CI; prod smoke NOT EXECUTED |
| REQ-DASH-001 | FR-D006 | US-D002 | AC-D008 | AC-D008 | TC-D008         | TDE-D002 | `src/lib/dashboardMetrics.ts`, `tests/unit/dashboardMetrics.test.ts`                                                               | PASSED `test` CI; prod smoke NOT EXECUTED |
| REQ-DASH-001 | FR-D011 | US-D002 | AC-D009 | AC-D009 | TC-D009         | TDE-D002 | `src/lib/dashboardMetrics.ts`, `src/pages/DashboardPage.tsx`, `tests/unit/dashboardMetrics.test.ts`, `tests/e2e/dashboard.spec.ts` | PASSED `test` CI; prod smoke NOT EXECUTED |
| REQ-DASH-001 | FR-D010 | US-D003 | AC-D010 | AC-D010 | TC-D010         | TDE-D002 | `src/lib/dashboardMetrics.ts`, `tests/unit/dashboardMetrics.test.ts`                                                               | PASSED `test` CI; prod smoke NOT EXECUTED |
| REQ-DASH-001 | FR-D009 | US-D003 | AC-D011 | AC-D011 | TC-D011         | TDE-D002 | `src/lib/dashboardMetrics.ts`, `tests/unit/dashboardMetrics.test.ts`                                                               | PASSED `test` CI; prod smoke NOT EXECUTED |
| REQ-DASH-001 | FR-D013 | US-D003 | AC-D012 | AC-D012 | TC-D012         | TDE-D002 | `src/lib/dashboardMetrics.ts`, `tests/unit/dashboardMetrics.test.ts`                                                               | PASSED `test` CI; prod smoke NOT EXECUTED |
| REQ-DASH-001 | FR-D014 | US-D004 | AC-D013 | AC-D013 | TC-D013         | TDE-D004 | `src/pages/DashboardPage.tsx`, `src/index.css`, `tests/unit/dashboardMetrics.test.ts`, `tests/e2e/dashboard.spec.ts`               | PASSED `test` CI; prod smoke NOT EXECUTED |

Also [../../traceability/matrix.md](../../traceability/matrix.md).
