# DASH-B011 — Check Empty States

**Area:** Dashboard  
**Priority:** Medium  
**Status:** Open  
**Owner:** TBD  
**Last Updated:** 2026-09-19

## Description

DASH-001 FS already forbids NaN, Infinity, and undefined on KPI/chart
edges (empty period, opening base 0, Active 0). This is a **check**,
not new product scope. EXP-2026-09-19-2 inverted custom showed empty
chart copy, Rate `0%`, Active still 620 — not NaN.

## Acceptance Criteria

- Spot-check Production/custom inverted and empty-ish periods: no NaN
  / Infinity / blank “undefined”.
- Residual gaps stay IMP/QUESTION unless they contradict FS.

## Steps

1. Re-read FS empty/edge section.
2. Observe Last 30 `N/A`, Last 7 `0%`, inverted custom empty months.
3. No code in this parking-lot item.

## QA Test Cases

**DESIGNED**

- Opening base 0 → `N/A` not `0%` (Last 30 in EXP).
- Inverted custom → empty chart message, not NaN.
- Not PASSED here.

## Related Files

- [docs/features/DASH-001/functional-spec.md](../../features/DASH-001/functional-spec.md)
- [src/lib/dashboardMetrics.ts](../../../src/lib/dashboardMetrics.ts)

## Dependencies

- None
