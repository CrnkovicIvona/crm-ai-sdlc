# DASH-B004 — Add KPI Tooltips

**Area:** Dashboard  
**Priority:** Medium  
**Status:** Proposed  
**Owner:** TBD  
**Last Updated:** 2026-09-19

## Description

YAML asked for tooltips on Active, New, Churned, Churn Rate, Net
Growth, Adoption. DASH-001 FS already requires a tooltip or short
explanation where empty/zero/`N/A` is ambiguous. Production Active
and Churned have hints; **Churn Rate `N/A` has no card hint**
(EXP-2026-09-19-2). Extra tooltips on every card are Proposed unless
they only close that FS gap.

## Acceptance Criteria

**Not oracle until human DoR** for new copy on every card.

FS-gap (if treated as DASH-001, not new scope): Churn Rate `N/A`
explains opening base 0.

## Steps

1. Compare [DashboardPage.tsx](../../../src/pages/DashboardPage.tsx)
   hints with FS visualization section.
2. Do not add copy as product truth without DoR / change-control.

## QA Test Cases

**DESIGNED**

- Churn Rate `N/A` vs `0%` (Last 30 vs Last 7 in EXP) remains
  distinguishable.
- Not PASSED here.

## Related Files

- [src/pages/DashboardPage.tsx](../../../src/pages/DashboardPage.tsx)
- [src/lib/dashboardMetrics.ts](../../../src/lib/dashboardMetrics.ts)
- [docs/features/DASH-001/functional-spec.md](../../features/DASH-001/functional-spec.md)

## Dependencies

- None blocking
