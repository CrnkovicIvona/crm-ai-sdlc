# DASH-001 user stories

- Work item: DASH-001
- Requirement: REQ-DASH-001
- Functional specification: [functional-spec.md](functional-spec.md)
- Status: Specified (DoR 2026-09-13). Feature lifecycle **`ON_MAIN`**
  (REL-006 + REL-007 stamps). **ON_MAIN — not RELEASED.**
- Traceability: [traceability.md](traceability.md)

Do not add behaviour absent from the FS.

## US-D001: Open the dashboard

As an authenticated ADMIN or VIEWER, I open `/app/dashboard` so I can
see CRM analytics without changing data.

- FR: FR-D001, FR-D012

### AC-D001 Access

Given I am an authenticated ADMIN or VIEWER, when I go to
`/app/dashboard` (or Dashboard in the shell), then I see the dashboard
and no create/update/delete/restore/product-assign controls.

### AC-D002 Unauthenticated

Given I am not authenticated, when I request `/app/dashboard`, then I
follow existing AUTH-001 unauthenticated behaviour (login). I do not
see dashboard KPIs.

Critical production smoke (later release): ADMIN and VIEWER can open
Dashboard; unauthenticated cannot. Not a copy of the full e2e pack.

## US-D002: Client movement KPIs

As a staff member, I see Active, New, Churned, Churn Rate, and Net
Growth so I understand stock vs flow.

- FR: FR-D002–FR-D006, FR-D011, FR-D013, FR-D014, FR-D015

### AC-D003 Active Clients

Given 10 clients exist and 2 have `deleted_at` set, then Active
Clients = 8. The value does not change when I change the date range.
Tooltip: _Current number of clients that are not soft-deleted._

### AC-D004 New Clients

Given creations inside and outside the selected `[start, end)`, then
New Clients counts only `created_at` in range. A client created and
deleted in the same period still counts.

### AC-D005 Churned Clients

Given various `deleted_at` values, then only those in `[start, end)`
count as Churned Clients.

### AC-D015 Role metric parity

Given the same selected period and the same database, when I open the
dashboard as VIEWER and as ADMIN, then Active, New, Churned, Churn
Rate, Net Growth, and Product Adoption Rate **match**. VIEWER still
has no write controls.

### AC-D006 Churn Rate 5%

Given opening active base 100 and 5 churned in the period, then Churn
Rate = 5%.

### AC-D007 Churn Rate N/A

Given opening active base 0 and churned 0, then Churn Rate is `N/A`.
Given opening active base 0 and churned > 0, then Churn Rate is `N/A`.

### AC-D008 Net growth

Given New = 18 and Churned = 4, then Net Client Growth = +14.

### AC-D009 Date filter mapping

When Last 30 days is selected: New uses `created_at`; Churned uses
`deleted_at`; Churn Rate uses period churn and opening base; Active
Clients remains current stock.

## US-D003: Products

As a staff member, I see adoption and clients by product for the
**current** active base.

- FR: FR-D009, FR-D010, FR-D013

### AC-D010 Adoption

Given 100 active clients and 60 with at least one product, then
Product Adoption Rate = 60%. Each client counts once.

### AC-D011 Distribution

Given one active client with three products, then that client
contributes one to each of those three products.

### AC-D012 Deleted excluded

Given a deleted client has product assignments, then they do not
contribute to adoption or by-product counts.

## US-D004: Charts and empty states

- FR: FR-D007, FR-D008, FR-D014

### AC-D013 Empty / zero

When there are no active clients, the dashboard does not show NaN,
Infinity, undefined, or broken visualizations. Percentages with
divisor 0 are `N/A`.
