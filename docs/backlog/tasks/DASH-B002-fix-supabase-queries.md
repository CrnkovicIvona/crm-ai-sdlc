# DASH-B002 — Fix Supabase Queries

**Area:** Dashboard  
**Priority:** High  
**Status:** Done / **`RELEASED`** — loader uses
`client_lifecycle_stamps` (BUG-004 / REL-007; smoke 14/14 PASS,
run 35469423656).  
**Owner:** TBD  
**Last Updated:** 2026-09-19

## Description

`loadDashboardSnapshot` selects `id, created_at, deleted_at` from
`clients` with the anon client and existing RLS (no service role).
VIEWER metrics that ignore churn may mean the VIEWER result set omits
soft-deleted rows or `deleted_at`. Investigate SELECT list and
filters. Do not change schema or RLS in this parking-lot item.

Repo: `clients_select_authenticated` is `deleted_at is null` for
ADMIN and VIEWER. Only `clients_select_admin_deleted` lets ADMIN
read deleted rows. Dashboard `select('id, created_at, deleted_at')`
has no extra client-side role filter.

## Acceptance Criteria

- Documented: which columns and row filters each role actually
  receives for the dashboard query.
- If VIEWER cannot see `deleted_at` or deleted rows, that is recorded
  against DASH-B001 / BUG-004.
- No silent query “fix” without a PLANNED bugfix.

## Steps

1. Read [src/lib/dashboard.ts](../../../src/lib/dashboard.ts).
2. Compare intended SELECT with CRM-001 list queries (active-only).
3. Safe observation only: same SPA path both roles (no pentest, no
   service role).
4. Stop for human before policy or query behavior changes.

## QA Test Cases

**DESIGNED**

- VIEWER dashboard still loads (no error toast) while counts are
  compared to ADMIN.
- Do not conclude RLS from UI alone without DASH-B012.

## Related Files

- [src/lib/dashboard.ts](../../../src/lib/dashboard.ts)
- [src/lib/clients.ts](../../../src/lib/clients.ts)
- [docs/features/DASH-001/technical-spec.md](../../features/DASH-001/technical-spec.md)

## Dependencies

- Informs DASH-B001 and DASH-B012
