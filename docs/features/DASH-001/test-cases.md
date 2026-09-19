# DASH-001 test cases

- Work item: DASH-001
- Design status: **DESIGNED**
- Automation status: **automated** (`tests/unit/dashboardMetrics.test.ts`,
  `tests/e2e/dashboard.spec.ts`). Execution is separate from design.
- C008 CRM search oracle remains **BLOCKED** (out of DASH-001).
- Risk: High
- Source: [bdd.md](bdd.md), [user-stories.md](user-stories.md)

## Automation map (planned, not executed)

| TC       | AC      | Kind | Technique | Level    | Planned path                                                          |
| -------- | ------- | ---- | --------- | -------- | --------------------------------------------------------------------- |
| TC-D001  | AC-D001 | P    | use-case  | e2e      | `tests/e2e/dashboard.spec.ts` `TC-D001-admin` / `TC-D001-viewer`      |
| TC-D002  | AC-D002 | N    | decision  | e2e      | `tests/e2e/dashboard.spec.ts` `TC-D002`                               |
| TC-D003  | AC-D003 | P    | EP        | unit     | `tests/unit/dashboardMetrics.test.ts` `TC-D003`                       |
| TC-D004  | AC-D004 | E    | state     | unit     | same file `TC-D004`                                                   |
| TC-D005  | AC-D005 | P    | EP        | unit     | `TC-D005`                                                             |
| TC-D006  | AC-D006 | P    | EP        | unit     | `TC-D006`                                                             |
| TC-D007a | AC-D007 | E    | BVA       | unit     | `TC-D007a` opening 0 churned 0 → N/A                                  |
| TC-D007b | AC-D007 | E    | BVA       | unit     | `TC-D007b` opening 0 churned > 0 → N/A                                |
| TC-D008  | AC-D008 | P    | EP        | unit     | `TC-D008`                                                             |
| TC-D009  | AC-D009 | P    | decision  | unit     | `TC-D009` period mapping; e2e only default Last 30 label `TC-D009-ui` |
| TC-D010  | AC-D010 | P    | EP        | unit     | `TC-D010`                                                             |
| TC-D011  | AC-D011 | P    | EP        | unit     | `TC-D011`                                                             |
| TC-D012  | AC-D012 | N    | state     | unit     | `TC-D012`                                                             |
| TC-D013  | AC-D013 | E    | state     | unit+e2e | unit `TC-D013`; e2e empty/error UI `TC-D013-ui`                       |
| TC-D014  | AC-D001 | N    | use-case  | e2e      | schema/query missing → **FAIL** not skip `TC-D014`                    |
| TC-D015  | AC-D015 | P    | decision  | e2e/int  | unit PGlite; live `dashboard-stamps.test.ts`; e2e `TC-D015-ui`        |

Missing dashboard data / schema: **FAIL**, not skip-to-green. Skip only
documented missing `E2E_*` / `VITE_*` (skip ≠ pass).

## TC-D001 Dashboard access ADMIN and VIEWER

- Status: DESIGNED
- Kind: P — use-case — e2e — High
- AC: AC-D001
- Expected: `/app/dashboard` visible; no write controls
- Automation: `tests/e2e/dashboard.spec.ts` `TC-D001-admin` /
  `TC-D001-viewer`

## TC-D002 Unauthenticated

- Status: DESIGNED
- Kind: N — decision — e2e — High
- AC: AC-D002
- Expected: AUTH-001 login path; no KPI values
- Automation: `tests/e2e/dashboard.spec.ts` `TC-D002`

## TC-D003–TC-D013 calculations

- Status: DESIGNED
- Kind: P/N/E as map — unit — High
- Expected: FS formulas (Active 8/10; New includes deleted-in-period;
  Churn Rate 5%; N/A cases; Net +14; adoption 60%; distinct products;
  deleted excluded)
- Automation: `tests/unit/dashboardMetrics.test.ts` `TC-D003`–`TC-D013`

## TC-D014 Schema missing FAIL

- Status: DESIGNED
- Kind: N — e2e — High
- Expected: dashboard cannot load expected data → test **FAILED**,
  not skipped
- Automation: `tests/e2e/dashboard.spec.ts` `TC-D014`

## TC-D015 VIEWER and ADMIN metric parity

- Status: PGlite unit **PASSED**; live Supabase integration **SKIPPED**
  until `client_lifecycle_stamps` is applied (SKIPPED ≠ PASSED)
- Kind: P — decision — e2e or integration — High
- AC: AC-D015
- Expected: Same period, VIEWER KPI values, product table, and chart
  bar titles equal ADMIN (Active, New, Churned, Rate, Net, Adoption,
  Clients by Product, Client Base Trend, New vs Churned). VIEWER has
  no write controls. Skip without `E2E_*` ≠ PASSED.
- Automation: `tests/unit/clientLifecycleStamps.tc-d015.test.ts`;
  live `tests/integration/dashboard-stamps.test.ts` `TC-D015` (full
  snapshot); e2e `tests/e2e/dashboard.spec.ts` `TC-D015-ui` when
  `TC_D015_REQUIRE_VIEW=1` (local Supabase job). Hosted Preview without
  the view: SKIPPED ≠ PASSED.

## Production smoke (later release)

Smallest post-deploy: authenticated Dashboard opens; unauthenticated
does not. Add under `tests/smoke/` only at release, not a copy of
full e2e. Not in this docs PR.
