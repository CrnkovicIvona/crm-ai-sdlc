# DASH-B001 — Role Data Parity Bug

**Area:** Dashboard  
**Priority:** High  
**Status:** Open  
**Owner:** TBD  
**Last Updated:** 2026-09-19

## Description

On Production Last 30 days, VIEWER saw New **620** and Churned **0**
while ADMIN saw New **815** and Churned **195**. Active **620** and Net
**+620** matched. A VIEWER can form a “no churn” model. Recorded as
[BUG-004](../../bugs/BUG-004.md);
[EXP-2026-09-19-2](../../test-reports/EXP-2026-09-19-2.md). UI only;
not RLS proof.

DASH-001 actors: VIEWER views all dashboard data. FR-D003/FR-D004
include New with later delete and Churned by `deleted_at`.

## Acceptance Criteria

- ADMIN and VIEWER show the same KPI values for the same period, **or**
  a human-accepted spec change documents a VIEWER slice and the UI
  explains it.
- Charts and cards tell the same story for a given role after B006.
- No invented AC beyond DASH-001 plus BUG-004.

This file does not implement the fix.

## Steps

1. Reproduce Last 30 on Production as VIEWER then ADMIN; record cards
   and charts.
2. Complete DASH-B002 (query) and DASH-B012 (RLS/columns).
3. Decide defect vs documented slice (human).
4. Only after PLANNED: change code per an approved bugfix plan.

## QA Test Cases

**DESIGNED**

- Same period: Active, New, Churned, Churn Rate, Net, Adoption for
  both roles.
- Last 7 vs Last 30: New changes; Active stock may stay.
- Do not mark PASSED in this backlog item.

## Related Files

- [src/lib/dashboard.ts](../../../src/lib/dashboard.ts)
- [src/lib/dashboardMetrics.ts](../../../src/lib/dashboardMetrics.ts)
- [src/pages/DashboardPage.tsx](../../../src/pages/DashboardPage.tsx)
- [docs/features/DASH-001/functional-spec.md](../../features/DASH-001/functional-spec.md)

## Dependencies

- DASH-B002, DASH-B012
- DASH-B005, DASH-B006, DASH-B010 follow this finding
