# REQ-DASH-001: CRM Dashboard

- Work item: DASH-001
- Issue: none
- Status: **`RELEASED`** after REL-007 smoke 14/14 (DoR 2026-09-13;
  run 35469423656).
- Owner (draft): Agent as BA
- Owner (approve): Human PO
- Source: PO prompt DASH-001 CRM Dashboard; plan refinements 2026-09-13
- Risk: High
- Approval: Metric contracts 2026-09-13; BD-D009 role parity
  2026-09-19. See [decisions.md](decisions.md).
- Traceability: [traceability.md](traceability.md)

## Problem

Staff need a read-only analytical overview of the existing CRM
operational data (clients, deactivation, products). This is not a
separate BI platform.

## Stated requirements

Quoted/paraphrased from the approved human request (not invented):

1. Route `/app/dashboard` for authenticated ADMIN and VIEWER.
2. Read-only: no create, update, delete, restore, or product assignment
   changes from the dashboard.
3. Use the existing Supabase schema. No new tables unless a frozen
   metric is impossible (expected: schema is sufficient).
4. No ETL, warehouse, GraphQL, Redux, extra REST, Next.js.
5. KPI cards: Active Clients, New Clients, Churned Clients, Churn Rate,
   Net Client Growth, Product Adoption Rate.
6. Charts/tables: Client Base Trend; New vs. Churned Clients; Clients
   by Product; product penetration table.
7. Date filter: Last 7 / 30 / 90 days, This year, Custom range.
   Default Last 30 days. Filter must **not** be applied blindly to
   every KPI (see FS).
8. Reuse AUTH-001. Unauthenticated users cannot use `/app/dashboard`.
9. Empty and divide-by-zero states must not show NaN, Infinity, or
   undefined.
10. VIEWER and ADMIN SHALL see the same dashboard metric values for
    the same selected period (PO 2026-09-19, BD-D009). VIEWER write
    denial does not reduce dashboard truth.
11. Do not implement product-level churn (no historical product
    ownership).
12. Do not mark DASH-001 `RELEASED` because code exists.

Metric definitions (active, new, churned, churn rate, net growth,
adoption, clients by product) are **WHAT** in
[functional-spec.md](functional-spec.md). They are not restated here
as SQL.

## Out of scope

Product-level churn, CLV, cohorts, predictive churn, AI insights,
revenue analytics, extra segmentation, export, Power BI, warehouse,
ETL, streaming, product assignment history, audit UI, client restore,
product admin, SSO, MFA, provisioning, new REST/GraphQL, Redux,
Next.js, microservices, paid IdP, Datadog, Jira/Azure/Notion as truth.

## Open questions

None blocking. Period timezone, `N/A` vs 0%, and partial-month stock
are decided in [decisions.md](decisions.md).

## Traceability

- Functional specification: [functional-spec.md](functional-spec.md)
- Technical specification: [technical-spec.md](technical-spec.md)
- Stories: [user-stories.md](user-stories.md)
- Tests: [test-plan.md](test-plan.md), [test-cases.md](test-cases.md)
- Matrix: [../../traceability/matrix.md](../../traceability/matrix.md)
