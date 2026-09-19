# DASH-B005 — Unify Metric Logic

**Area:** Dashboard  
**Priority:** Medium  
**Status:** Open  
**Owner:** TBD  
**Last Updated:** 2026-09-19

## Description

Ensure ADMIN and VIEWER use the same calculation path in
`dashboardMetrics.ts`. Current SPA computes KPIs in one module from
rows returned by `loadDashboardSnapshot`; there are not two formula
implementations. A role split is more likely **different input rows**
(DASH-B002 / DASH-B012) than forked math.

## Acceptance Criteria

- Confirmed: one `computeDashboard` path for both roles.
- If a role-specific branch exists later, it is documented and tested.
- Formula changes still follow DASH-001 FS (no invented metrics).

## Steps

1. Read [src/lib/dashboardMetrics.ts](../../../src/lib/dashboardMetrics.ts)
   and [src/lib/dashboard.ts](../../../src/lib/dashboard.ts).
2. Confirm DashboardPage does not branch formulas on role.
3. Tie residual deltas to query/RLS, not a second calculator.

## QA Test Cases

**DESIGNED**

- Unit tests already target formulas with fixtures (TC-D003–D013
  family); role parity is data, not a second formula file.
- Not PASSED via this backlog item.

## Related Files

- [src/lib/dashboardMetrics.ts](../../../src/lib/dashboardMetrics.ts)
- [src/pages/DashboardPage.tsx](../../../src/pages/DashboardPage.tsx)

## Dependencies

- DASH-B001, DASH-B002
