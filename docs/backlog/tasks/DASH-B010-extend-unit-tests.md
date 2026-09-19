# DASH-B010 — Extend Unit Tests

**Area:** Dashboard  
**Priority:** Medium  
**Status:** Open  
**Owner:** TBD  
**Last Updated:** 2026-09-19

## Description

Extend the TC-D003–D013 family so role parity is covered: same
fixtures through `computeDashboard`, plus a case where the VIEWER
input set omits soft-deleted rows (reproducing BUG-004 shape). Adding
tests is not PASSED until execute-tests. Do not weaken existing tests.

## Acceptance Criteria

- New or extended cases are **DESIGNED** here; execution is a later
  TESTING step on a PLANNED bugfix/feature branch.
- SKIPPED ≠ PASSED.
- No fake passing tests.

## Steps

1. Read [docs/features/DASH-001/test-cases.md](../../features/DASH-001/test-cases.md).
2. Design a fixture: full set (ADMIN-like) vs active-only (VIEWER-like
   hypothesis).
3. Implement tests only after a plan that names the files is approved.

## QA Test Cases

**DESIGNED**

- Opening base 0 → Churn Rate `N/A` (existing TC-D007).
- Active-only input → Churned 0 and New < full-set New.
- Not PASSED in this file.

## Related Files

- [docs/features/DASH-001/test-cases.md](../../features/DASH-001/test-cases.md)
- [src/lib/dashboardMetrics.ts](../../../src/lib/dashboardMetrics.ts)

## Dependencies

- DASH-B001
