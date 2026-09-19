# TS-DASH-001: CRM Dashboard

- Work item: DASH-001
- Functional specification: [functional-spec.md](functional-spec.md)
- Requirement: [requirement.md](requirement.md)
- Status: **`ON_MAIN`** after REL-006; REL-007 stamps on this
  release. **ON_MAIN — not RELEASED** until production smoke
  **PASSED**.
- Owner (draft): Agent as architect
- Source: ADR-0001, ADR-0002, AUTH-001 TS, CRM-001 TS,
  [decisions.md](decisions.md)
- Traceability: [traceability.md](traceability.md)

This is **HOW**. No migration text. No new REST.

## Architecture

Reuse Vite + React + TypeScript (ADR-0002), React Router, Supabase
JS anon client, PostgreSQL RLS already on `clients` / `products` /
`client_products`. No Next.js, GraphQL, Redux, extra API, warehouse.

## Frontend

- Route `dashboard` under existing `/app` `RequireAuth` (ADMIN and
  VIEWER). Not `RequireAdmin`.
- Shell link `nav-dashboard`. `/app` index remains clients.
- Page: KPI cards, date presets + custom, two SVG/CSS charts, product
  bar + table. Tooltip on Active Clients per FS.
- Read-only: no forms that mutate clients.

## Supabase / data access

- Same `getSupabase()` as CRM-001.
- New loader (planned `dashboard.ts`) selects only
  `clients.id, created_at, deleted_at`,
  `client_products.client_id, product_id`,
  `products.id, code, name`.
- Pure functions (planned `dashboardMetrics.ts`) implement FS
  contracts including `[start, end)`, partial-month stock, `N/A`.
- Do **not** reuse paginated `listClients` for KPIs.

## Database

Logical: existing CRM-001 tables. No new tables (BD-D008). No new
indexes unless a later measurement proves need (not in this increment
by default).

## Row Level Security

Intent: authenticated ADMIN/VIEWER already SELECT **active** clients
for the CRM list. Dashboard KPIs also need soft-deleted stamps
(`created_at`, `deleted_at`) for FR-D003, FR-D004, FR-D015.

**BUG-004:** policy `clients_select_authenticated` is `deleted_at is
null` for both roles; only ADMIN may SELECT deleted rows
(`clients_select_admin_deleted`). The dashboard loader reads
`clients` with that RLS, so VIEWER under-counts New/Churned.

If SELECT/count is denied: **STOP**, document, do not use service
role in the browser. HOW: view `client_lifecycle_stamps` (TD-D005
**APPROVED**). Do not widen deleted PII on `clients` for VIEWER.

## Security

- No `SUPABASE_SERVICE_ROLE_KEY` in `VITE_*`.
- No PII fields on the dashboard query.
- Fail closed if Supabase is unconfigured (same pattern as CRM).

## Testing architecture

Designed in [test-plan.md](test-plan.md). Not executed here.

## TDE

| ID       | HOW                                 | FR                       |
| -------- | ----------------------------------- | ------------------------ |
| TDE-D001 | Route + RequireAuth + nav           | FR-D001                  |
| TDE-D002 | dashboardMetrics + fetch timestamps | FR-D002–D011, D013, D014 |
| TDE-D003 | Dashboard UI without write controls | FR-D012                  |
| TDE-D004 | SVG/CSS charts, empty/`N/A`         | FR-D007–D009, D014       |
| TDE-D005 | Same stamp set both roles (BUG-004) | FR-D015                  |

## Dependencies

AUTH-001, CRM-001 schema on the target database.

## Open technical questions

None blocking. If frozen metrics cannot be computed from the schema:
stop (BD-D008).
