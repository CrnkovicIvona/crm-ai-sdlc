# QA Backlog — BankCRM

Parking lot for follow-ups found in QA or exploration. **Not** REQ, FS,
or AC. **Not** permission to create `src/`, change schema, or edit RLS.
Feature packs stay under `docs/features/`. Defect records stay under
`docs/bugs/`. Coding still needs DoR + approved implementation plan.

Id scheme: `{AREA}-B{nnn}` (`DASH`, `AUTH`, `CRM`, `SYS`, `UI`). Do not
reuse feature ids (`DASH-001` is the dashboard feature). AUTH/CRM/SYS
rows are added when real work exists.

Evidence for DASH-B001: [EXP-2026-09-19-2](../test-reports/EXP-2026-09-19-2.md),
[BUG-004](../bugs/BUG-004.md) (`RELEASED` REL-007). BD-D009:
VIEWER and ADMIN same dashboard truth. Production Last 30 before
fix: VIEWER New **620** / Churned **0**; ADMIN New **815** /
Churned **195**. Production smoke **PASSED** 14/14 (run 35469423656).

| ID                                                         | Title                          | Area      | Status               | Priority | Owner | Last Updated |
| ---------------------------------------------------------- | ------------------------------ | --------- | -------------------- | -------- | ----- | ------------ |
| [AUTH-B001](tasks/AUTH-B001-login-test-user-spacing.md)    | Login test-user blocks spacing | Auth      | `RELEASED` (REL-007) | Low      | TBD   | 2026-09-19   |
| [DASH-B001](tasks/DASH-B001-role-data-parity-bug.md)       | Role Data Parity Bug           | Dashboard | `RELEASED` (REL-007) | High     | TBD   | 2026-09-19   |
| [DASH-B002](tasks/DASH-B002-fix-supabase-queries.md)       | Fix Supabase Queries           | Dashboard | Done / `RELEASED`    | High     | TBD   | 2026-09-19   |
| [DASH-B003](tasks/DASH-B003-add-total-clients-kpi.md)      | Add Total Clients KPI          | Dashboard | Proposed             | High     | TBD   | 2026-09-19   |
| [DASH-B004](tasks/DASH-B004-add-kpi-tooltips.md)           | Add KPI Tooltips               | Dashboard | Proposed             | Medium   | TBD   | 2026-09-19   |
| [DASH-B005](tasks/DASH-B005-unify-metric-logic.md)         | Unify Metric Logic             | Dashboard | Open                 | Medium   | TBD   | 2026-09-19   |
| [DASH-B006](tasks/DASH-B006-validate-charts.md)            | Validate Charts                | Dashboard | Open                 | Medium   | TBD   | 2026-09-19   |
| [DASH-B007](tasks/DASH-B007-add-last-updated-timestamp.md) | Add Last Updated Timestamp     | Dashboard | Proposed             | Low      | TBD   | 2026-09-19   |
| [DASH-B008](tasks/DASH-B008-add-product-filter.md)         | Add Product Filter             | Dashboard | Proposed             | Low      | TBD   | 2026-09-19   |
| [DASH-B009](tasks/DASH-B009-add-status-pie-chart.md)       | Add Status Pie Chart           | Dashboard | Proposed             | Low      | TBD   | 2026-09-19   |
| [DASH-B010](tasks/DASH-B010-extend-unit-tests.md)          | Extend Unit Tests              | Dashboard | Open                 | Medium   | TBD   | 2026-09-19   |
| [DASH-B011](tasks/DASH-B011-check-empty-states.md)         | Check Empty States             | Dashboard | Open                 | Medium   | TBD   | 2026-09-19   |
| [DASH-B012](tasks/DASH-B012-check-rls-enforcement.md)      | Check RLS Enforcement          | Dashboard | Open                 | High     | TBD   | 2026-09-19   |

```yaml
# Parking lot only. Proposed ≠ approved AC.
auth_backlog:
  - id: AUTH-B001
    title: Login test-user blocks spacing
    area: Auth
    description: Separate ADMIN block, VIEWER block, and italic spec note on login with vertical space. Do not change credentials or copy.
    priority: low
    status: released_rel_007

dashboard_backlog:
  - id: DASH-B001
    title: Role Data Parity Bug
    area: Dashboard
    description: VIEWER Last 30 New=620 Churned=0; ADMIN New=815 Churned=195. Investigate RLS, queries, column access. See BUG-004. Fix is stamps view (REL-007).
    priority: high
    status: released_rel_007
    depends_on: [DASH-B002, DASH-B012]
  - id: DASH-B002
    title: Fix Supabase Queries
    area: Dashboard
    description: Dashboard reads client_lifecycle_stamps (id, created_at, deleted_at) for both roles.
    priority: high
    status: done
  - id: DASH-B003
    title: Add Total Clients KPI
    area: Dashboard
    description: Proposed KPI for total clients ever created. Not in current DASH-001 FS.
    priority: high
    status: proposed
  - id: DASH-B004
    title: Add KPI Tooltips
    area: Dashboard
    description: Tooltips for Active, New, Churned, Churn Rate, Net Growth, Adoption. FS already requires explanation where N/A is ambiguous.
    priority: medium
    status: proposed
  - id: DASH-B005
    title: Unify Metric Logic
    area: Dashboard
    description: Confirm ADMIN and VIEWER use the same dashboardMetrics.ts path; difference is likely input rows, not two formulas.
    priority: medium
    status: open
  - id: DASH-B006
    title: Validate Charts
    area: Dashboard
    description: Charts must match KPI story for both roles when parity is required.
    priority: medium
    status: open
    depends_on: [DASH-B001]
  - id: DASH-B007
    title: Add Last Updated Timestamp
    area: Dashboard
    description: Proposed last-refresh timestamp. Not in current FS.
    priority: low
    status: proposed
  - id: DASH-B008
    title: Add Product Filter
    area: Dashboard
    description: Proposed filter of adoption by product. Not in current FS.
    priority: low
    status: proposed
  - id: DASH-B009
    title: Add Status Pie Chart
    area: Dashboard
    description: Proposed Active/New/Churned pie. Not in current FS; existing bar charts remain the specified viz.
    priority: low
    status: proposed
  - id: DASH-B010
    title: Extend Unit Tests
    area: Dashboard
    description: Extend TC-D003–D013 family to cover role parity. DESIGNED here; not PASSED.
    priority: medium
    status: open
    depends_on: [DASH-B001]
  - id: DASH-B011
    title: Check Empty States
    area: Dashboard
    description: Confirm no NaN, undefined, or Infinity in dashboard metrics (already in DASH-001 FS).
    priority: medium
    status: open
  - id: DASH-B012
    title: Check RLS Enforcement
    area: Dashboard
    description: Verify VIEWER can read columns needed for New (including later-deleted) and Churned. No policy edits until a PLANNED bugfix.
    priority: high
    status: open
```
