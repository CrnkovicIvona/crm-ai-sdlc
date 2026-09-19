# DASH-B012 — Check RLS Enforcement

**Area:** Dashboard  
**Priority:** High  
**Status:** Open (policy text identified; no live PostgREST trace; no policy edit)  
**Owner:** TBD  
**Last Updated:** 2026-09-19

## Description

Verify whether VIEWER SELECT on `clients` includes rows with
`deleted_at` set and the `deleted_at` / `created_at` columns needed
for FR-D003/FR-D004. CRM-001: VIEWER may SELECT clients and must not
write. UI hiding is not enforcement. This item is investigation;
**do not edit policies** until a PLANNED bugfix. Not a pentest; no
service role.

**Conclusion from migration (not a live GRANT dump):** VIEWER cannot
SELECT deleted `clients` rows. ADMIN can. That is enough to explain
BUG-004 without claiming a production `pg_policies` snapshot.

## Acceptance Criteria

- Written conclusion: VIEWER can or cannot read the rows/columns the
  dashboard formulas need.
- If they cannot, that is BUG-004 vs BD-D009 (same truth). Fix is
  not this parking-lot item.
- Hidden UI ≠ DEEPLY EXPLORED authz.

## Steps

1. Read CRM-001 TS RLS intent and DASH-001 TS (anon client, no
   service role).
2. Compare with DASH-B002 query.
3. Safe in-app observation only unless a later plan names an allowed
   integration test.

## QA Test Cases

**DESIGNED**

- VIEWER cannot create/update/delete (existing CRM UI).
- VIEWER dashboard Churned vs ADMIN Churned (BUG-004).
- Not PASSED as RLS proof from UI alone.

## Related Files

- [docs/features/CRM-001/technical-spec.md](../../features/CRM-001/technical-spec.md)
- [docs/features/DASH-001/technical-spec.md](../../features/DASH-001/technical-spec.md)
- [src/lib/dashboard.ts](../../../src/lib/dashboard.ts)

## Dependencies

- Informs DASH-B001; pairs with DASH-B002
