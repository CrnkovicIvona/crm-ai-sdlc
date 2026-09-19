# DASH-B009 — Add Status Pie Chart

**Area:** Dashboard  
**Priority:** Low  
**Status:** Proposed  
**Owner:** TBD  
**Last Updated:** 2026-09-19

## Description

Proposed pie of Active/New/Churned shares. Specified visualizations
are KPI cards, Client Base Trend (stock bars), New vs Churned (event
bars), and the product table. A pie would be new scope and can
mislead (Active is stock; New/Churned are period flows — they do not
sum to 100% of one whole).

## Acceptance Criteria

**Not oracle until human DoR.** If rejected, leave specified charts
as-is.

## Steps

1. Do not implement.
2. Human decides whether a pie is in scope at all.

## QA Test Cases

**DESIGNED** after DoR only.

## Related Files

- [src/pages/DashboardPage.tsx](../../../src/pages/DashboardPage.tsx)
- [docs/features/DASH-001/functional-spec.md](../../features/DASH-001/functional-spec.md)

## Dependencies

- Human DoR
- DASH-B001 if pie used VIEWER-hidden churn
