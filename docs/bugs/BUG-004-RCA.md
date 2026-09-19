# RCA: BUG-004

- Production escape: **yes**
  (`https://crm-ai-sdlc.vercel.app/`, 2026-09-19)

## Impact

A VIEWER sees Last 30 New **620** and Churned **0**. An ADMIN sees New
**815** and Churned **195**. Active **620** and Net **+620** match.
VIEWER forms a “nobody left” model. Spec: both roles view all
dashboard data; New includes later-deleted rows; Churned uses
`deleted_at`. Human 2026-09-19: **VIEWER must see the same truth as
ADMIN** (BD-D009).

## Timeline

1. CRM-001 soft-delete migration
   `supabase/migrations/20260823210000_products_and_soft_delete.sql`:
   - `clients_select_authenticated`: ADMIN **and** VIEWER SELECT only
     `deleted_at is null`.
   - `clients_select_admin_deleted`: only **ADMIN** SELECT
     `deleted_at is not null` (so UPDATE … RETURNING after delete
     works). Comment: SPA list still filters active rows.
2. DASH-001 loader (`src/lib/dashboard.ts`) uses the same anon client
   and `from('clients').select('id, created_at, deleted_at')` with no
   extra filter. Metrics in `dashboardMetrics.ts` are **role-agnostic**.
3. REL-006 put the dashboard on `main` / Production. Unit tests feed
   fixtures (including deleted rows) into `computeDashboard` — they
   never run as VIEWER against RLS.
4. EXP-2026-09-19-2 observed the UI delta. BUG-004 opened. PO 2026-09-19
   accepted the defect and BD-D009.

## Immediate fix

None in this change (`src/` and RLS not edited). Until a **PLANNED**
bugfix: VIEWER must not treat dashboard churn as complete; ADMIN
numbers are the fuller set.

## Root cause

**CRM list RLS hides soft-deleted `clients` from VIEWER. Dashboard
reuses that table as its event source.**

VIEWER’s fetch omits rows with `deleted_at` set, so Churned = 0 and
New counts only still-active creates. ADMIN’s extra SELECT policy
returns those rows, so New and Churned include lifecycle events.
`dashboardMetrics.ts` is not forked by role (DASH-B005 confirmed).

## Why it escaped

- DASH TS said “same SELECT as CRM-001” without checking that VIEWER
  cannot see deleted rows needed for FR-D003/FR-D004.
- Unit tests never apply RLS.
- E2E `TC-D001-viewer` checks access, not KPI equality vs ADMIN.
- Production smoke does not compare roles’ New/Churned.
- CRM list _should_ hide deleted clients; that rule was applied to
  analytics by accident.

## Corrective actions (for the later PLANNED bugfix)

- Give both roles the **same stamp set** (`id`, `created_at`,
  `deleted_at`) including soft-deleted rows, without granting VIEWER
  deleted **PII** on `clients` if a view/RPC can avoid that (TD-D005
  **Proposed**).
- Automated test: VIEWER vs ADMIN same Last-30 New/Churned on a
  fixture with deletes (TC-D015 **DESIGNED**).
- Do not teach VIEWER to SELECT full deleted `clients` rows unless
  the human accepts that PII exposure.

## Preventive actions

- When a KPI needs history (`deleted_at`, created-then-deleted),
  state the RLS row set in TS, not “reuse CRM SELECT”.
- High analytics + RLS: one integration or e2e case per role on the
  **same** metric, or an explicit documented slice.

## Residual risk

- Until shipped: Production VIEWER KPIs remain wrong vs BD-D009.
- Widening `clients` SELECT to VIEWER for deleted rows would leak
  email/phone/OIB of deactivated clients via PostgREST. A stamps-only
  view/RPC avoids that; it is not implemented in this PR.
- CRM list must stay active-only for VIEWER (unchanged product rule).
