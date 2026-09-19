# DASH-B003 — Add Total Clients KPI

**Area:** Dashboard  
**Priority:** High  
**Status:** Proposed  
**Owner:** TBD  
**Last Updated:** 2026-09-19

## Description

Ask for a KPI of **all clients ever created** (including later
soft-deleted). Current DASH-001 cards are Active, New, Churned, Churn
Rate, Net Growth, Product Adoption. This card is **not** in the
approved FS.

## Acceptance Criteria

**Not oracle until human DoR.** Proposed only:

- A Total Clients definition (ever created vs current stock) is
  accepted in REQ/FS.
- Card copy does not collide with Active Clients.

## Steps

1. Do not implement.
2. If accepted, change-control: REQ → FS → stories/AC → BDD → TC → TS
   → plan.

## QA Test Cases

**DESIGNED** after DoR only. None PASSED.

## Related Files

- [docs/features/DASH-001/functional-spec.md](../../features/DASH-001/functional-spec.md)
- [src/pages/DashboardPage.tsx](../../../src/pages/DashboardPage.tsx)

## Dependencies

- Human DoR if this becomes in-scope
- DASH-B001 if “total ever” must include rows VIEWER cannot see today
