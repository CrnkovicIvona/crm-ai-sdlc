# Implementation plan: BUG-004

- Work item: BUG-004 (DASH-001 role metric parity)
- Issue: none
- Owner: Agent draft / Human approve
- Source: BD-D009 (chat 2026-09-19), [BUG-004-RCA.md](BUG-004-RCA.md)
- Open Questions: none (TD-D005 **APPROVED** 2026-09-19)
- Approval: **Approved** (`PLANNED`)
- Traceability: FR-D015, AC-D015, TC-D015
- Prerequisite: BD-D009 recorded
- Status: **Approved**

Do **not** merge `main` from this bugfix. Apply the stamps migration
via the existing production apply-schema path after a **human**
release merge.

## Scope of code changes (proposed)

Preferred HOW (TD-D005 **APPROVED**):

1. Migration `20260919193000_client_lifecycle_stamps.sql`: view
   `client_lifecycle_stamps` (`id, created_at, deleted_at`), SELECT
   for authenticated ADMIN and VIEWER, including soft-deleted rows.
2. `src/lib/dashboard.ts` reads that view. Fallback to `clients` only
   if the relation is missing (pre-apply). Keep `products` /
   `client_products`.
3. Do **not** change CRM `listClients` active-only filter.
4. Do **not** broaden `clients_select_admin_deleted` to VIEWER unless
   the human rejects the view/RPC (that path exposes deleted PII).

Tests:

- Unit: already has deleted rows in fixtures; add an explicit
  “active-only input understates New/Churned” case if useful.
- Integration or e2e `TC-D015`: same period, VIEWER and ADMIN KPI
  New/Churned equal on a DB with known deletes (or documented
  equivalent). Missing `E2E_*`: SKIPPED ≠ PASSED.

## Mapping

| AC / TC           | Automated test path (to be created)                    |
| ----------------- | ------------------------------------------------------ |
| AC-D015 / TC-D015 | `tests/integration/dashboard-stamps.test.ts` `TC-D015` |

## Security notes

- No service role in the SPA.
- VIEWER still must not INSERT/UPDATE/DELETE `clients`.
- Prefer stamps-only surface so deleted PII stays ADMIN-gated on
  `clients`.

## Rollout / rollback risk

- Production escape until deploy. Rollback = revert migration + loader.
- Apply via existing production-smoke apply-schema path after merge to
  `main` (human release), not this PR.

## Out of scope

- DASH-B003/B007/B008/B009 Proposed KPIs/charts
- C008 search
- Changing Active Clients to a period metric (BD-D001)
