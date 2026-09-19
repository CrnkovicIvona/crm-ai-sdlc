# Implementation plan: BUG-004

- Work item: BUG-004 (DASH-001 role metric parity)
- Issue: none
- Owner: Agent draft / Human approve
- Source: BD-D009 (chat 2026-09-19), [BUG-004-RCA.md](BUG-004-RCA.md)
- Open Questions: TD-D005 (stamps view/RPC vs widening `clients`
  SELECT) — **PROPOSED**
- Approval: **Draft — not PLANNED**
- Traceability: FR-D015, AC-D015, TC-D015
- Prerequisite: BD-D009 recorded
- Status: **Draft**

Do **not** create `src/` or migrations until a human sets this plan
to Approved.

## Scope of code changes (proposed)

Preferred HOW (TD-D005 Proposed):

1. Migration: view or RPC returning only `id, created_at, deleted_at`
   for **all** clients (including `deleted_at not null`), SELECT to
   authenticated ADMIN **and** VIEWER. No names, email, phone, OIB.
2. `src/lib/dashboard.ts`: read that object instead of `clients` for
   stamps. Keep `products` / `client_products` as today.
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

| AC / TC           | Automated test path (to be created) |
| ----------------- | ----------------------------------- |
| AC-D015 / TC-D015 | e2e or integration named `TC-D015`  |

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
