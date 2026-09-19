# DASH-B006 — Validate Charts

**Area:** Dashboard  
**Priority:** Medium  
**Status:** Open  
**Owner:** TBD  
**Last Updated:** 2026-09-19

## Description

Client Base Trend and New vs Churned must not tell a different story
from the KPI cards for that role. If VIEWER KPIs hide churn, charts
may also understate churned/new-then-deleted. Specified charts stay
bar/stock + events; this is not the pie in DASH-B009.

## Acceptance Criteria

- For a given role and period, chart empty states and series are
  consistent with that role’s New/Churned/Active story.
- After parity (DASH-B001), both roles match each other as well.
- No new chart types in this item.

## Steps

1. Capture Last 30 / Last 7 / inverted custom (EXP already saw empty
   months for inverted range).
2. Compare VIEWER vs ADMIN series after B001 investigation.

## QA Test Cases

**DESIGNED**

- Last 30 vs Last 7: month set and New series change when the period
  changes.
- Inverted custom: “No months in the selected range” without NaN.
- Not PASSED here.

## Related Files

- [src/pages/DashboardPage.tsx](../../../src/pages/DashboardPage.tsx)
- [src/lib/dashboardMetrics.ts](../../../src/lib/dashboardMetrics.ts)

## Dependencies

- DASH-B001
