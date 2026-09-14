# FS-DASH-001: CRM Dashboard

- Work item: DASH-001
- Requirement: [requirement.md](requirement.md)
- Issue: none
- Status: Specified (DoR 2026-09-13). Not implemented. Not `RELEASED`.
- Owner (draft): Agent as BA
- Source: [decisions.md](decisions.md)
- Open questions: none blocking
- Approval: BD-D001–BD-D008, date/filter and metric contracts
- Traceability: [traceability.md](traceability.md)

This document is **WHAT**. It does not specify Vite, file paths, or
RLS policy text. Authorization remains the AUTH-001 / CRM-001
database boundary; the dashboard must not be the only control.

## Feature

Authenticated ADMIN and VIEWER users see a read-only dashboard at
`/app/dashboard` that summarises the existing Client and Product
operational data.

## Purpose

Turn CRM operational data into a small, coherent BI view. Not a
generic analytics platform.

## Business Context

Depends on AUTH-001 (login, roles, fail-closed) and CRM-001 (clients,
soft-delete, products, assignments). DASH-001 does not change those
modules’ behaviour.

## Scope

In scope: FR-D001–FR-D014, date filter as specified, empty states,
read-only UI.

Out of scope: see REQ.

## Actors

| Actor                  | Dashboard                                             |
| ---------------------- | ----------------------------------------------------- |
| ADMIN                  | Access and view all dashboard data; no writes         |
| VIEWER                 | Access and view all dashboard data; no writes         |
| Unauthenticated person | No dashboard (existing AUTH-001 unauthenticated path) |

## Preconditions

Employee is authenticated with a usable ADMIN or VIEWER profile
(AUTH-001).

## Functional requirements

| ID      | Statement                                                                                        | Source  |
| ------- | ------------------------------------------------------------------------------------------------ | ------- |
| FR-D001 | Authenticated ADMIN and VIEWER SHALL access `/app/dashboard`.                                    | REQ     |
| FR-D002 | The dashboard SHALL display Active Clients (`deleted_at` is empty).                              | REQ 3.1 |
| FR-D003 | The dashboard SHALL display New Clients in the selected `[start, end)` range by `created_at`.    | REQ 3.2 |
| FR-D004 | The dashboard SHALL display Churned Clients in the range by `deleted_at`.                        | REQ 3.3 |
| FR-D005 | The dashboard SHALL calculate Churn Rate using the opening active client base.                   | REQ 3.4 |
| FR-D006 | The dashboard SHALL calculate Net Client Growth as New Clients minus Churned Clients.            | REQ 3.5 |
| FR-D007 | The dashboard SHALL display Client Base Trend (active stock over time, monthly aggregation).     | REQ 5.1 |
| FR-D008 | The dashboard SHALL display New vs. Churned Clients over time (monthly events).                  | REQ 5.2 |
| FR-D009 | The dashboard SHALL display active clients by product (`COUNT` of distinct clients).             | REQ 3.7 |
| FR-D010 | The dashboard SHALL display Product Adoption Rate.                                               | REQ 3.6 |
| FR-D011 | The dashboard SHALL provide Last 7 / 30 / 90 days, This year, and Custom range. Default Last 30. | REQ 6   |
| FR-D012 | The dashboard SHALL be read-only.                                                                | REQ     |
| FR-D013 | Soft-deleted clients SHALL be excluded from Active Clients, product adoption, and by-product.    | REQ     |
| FR-D014 | The dashboard SHALL handle zero/empty states without NaN, Infinity, or undefined.                | REQ 9   |

DASH-001-FR-01 … FR-14 in the request map 1:1 to FR-D001 … FR-D014.

## Date filter (do not apply blindly)

Presets: Last 7 days, Last 30 days (default), Last 90 days, This year,
Custom range.

All periods use half-open interval **`[period_start, period_end)`**
in **UTC**.

| Preset      | period_start              | period_end                                    |
| ----------- | ------------------------- | --------------------------------------------- |
| Last N days | now minus N days          | now                                           |
| This year   | `YYYY-01-01T00:00:00Z`    | now                                           |
| Custom      | start of start date (UTC) | start of the day **after** the end date (UTC) |

This year does **not** use 31 December 23:59:59 as `period_end`.

| Metric                | Date filter? | Behaviour                                                        |
| --------------------- | ------------ | ---------------------------------------------------------------- |
| Active Clients        | **No**       | Current-state KPI. Not “active during the selected period”.      |
| New Clients           | Yes          | `created_at` in `[start, end)`                                   |
| Churned Clients       | Yes          | `deleted_at` in `[start, end)`                                   |
| Churn Rate            | Yes          | Churned in period / opening active base                          |
| Net Client Growth     | Yes          | New − Churned                                                    |
| Product Adoption Rate | **No**       | Current active clients with ≥1 product                           |
| Clients by Product    | **No**       | Current active assignments                                       |
| Client Base Trend     | Yes          | Months overlapping the range; stock at bounded month-end (below) |
| New vs. Churned chart | Yes          | Monthly **events** inside `[start, end)`                         |

**Active Clients is a current-state KPI and is not affected by the
selected date range.**

UI: KPI tooltip for Active Clients: _Current number of clients that
are not soft-deleted._

## Metric definitions (contracts)

### Active Clients

- **Meaning:** How many clients are active **now**.
- **Formula:** count of clients where `deleted_at` is empty.
- **Source:** Client records; `deleted_at`.
- **Date:** none.
- **Exclude:** soft-deleted clients.
- **Empty:** 0 is valid. Not N/A.

### New Clients

- **Meaning:** Creation events in the selected period (acquisition).
- **Formula:** `created_at >= start AND created_at < end`.
- **Do not** require `deleted_at` empty. Created then deleted in the
  same period still counts.
- **Empty:** 0 is valid.

### Churned Clients

- **Meaning:** CRM deactivation in the period (`deleted_at` populated).
  Not proof the person left a real-world bank product.
- **Formula:** `deleted_at >= start AND deleted_at < end`.
- **UI:** “Churned Clients” with supporting text: _Clients deactivated
  during the selected period._
- **Empty:** 0 is valid.

### Opening active client base

- **Meaning:** Active at `period_start`.
- **Formula:** `created_at < start AND (deleted_at` empty `OR deleted_at >= start)`.

### Churn Rate

- **Meaning:** Share of the opening active base that churned in the
  period.
- **Formula:** Churned Clients / Opening active base × 100.
- **Edge:** If opening base is **0**, display **`N/A`** (not 0%).
  Applies when churned is 0 **and** when churned is greater than 0
  (no division by zero).

### Net Client Growth

- **Formula:** New Clients − Churned Clients.
- Positive / negative / zero are all valid. Not current stock minus
  previous stock.

### Product Adoption Rate

- **Meaning:** Share of **current** active clients with at least one
  product assignment. Not “adopted during the period”.
- **Formula:** distinct active clients with ≥1 assignment / Active
  Clients × 100. Each client once regardless of product count.
- **Exclude:** soft-deleted clients.
- **Edge:** Active Clients = 0 → **`N/A`**.

### Clients by Product

- **Meaning:** For each catalog product, how many **distinct current
  active** clients have that product.
- **Formula:** for each product, count of **distinct** assignment
  client ids among active clients.
- A client with three products contributes one to each of those three
  products, not three to a single client total.
- Catalog is the live product list, not a frozen hard-coded name list
  in the UI.
- Products with zero active clients still appear (0).
- **Exclude:** soft-deleted clients.
- **% of Active Clients** on the table: that product’s distinct active
  clients / Active Clients × 100. Not mutually exclusive segments.
  Active = 0 → **`N/A`** for those percentages.

### Client Base Trend

- **Title:** Client Base Trend.
- **Meaning:** Active **stock** over time, not creations in the month.
- Generate one point per UTC calendar month that **overlaps** the
  selected `[start, end)`.
- **Partial first/last month:** the point is stock at the **end of the
  selected period portion for that month**, not a timestamp outside
  the selected range.
  - Custom 20 Aug–25 Aug: August point = stock at `period_end`, not
    31 Aug if 31 Aug is outside the range.
  - Last 7 days inside September: September point = stock at `now`
    (`period_end`), not 30 Sep.
- A month fully inside the range: stock at that month’s exclusive
  month-end: `created_at < month_end AND (deleted_at` empty `OR
deleted_at >= month_end)`.

### New vs. Churned Clients (chart)

- **Title:** New vs. Churned Clients.
- Monthly **event** counts (flow), not stock.
- Events restricted to `[start, end)` so a partial month only includes
  events inside the selected range.

## Visualizations and KPI cards

Cards: Active Clients, New Clients, Churned Clients, Churn Rate, Net
Client Growth, Product Adoption Rate. Each: label, value, formatting,
empty/zero/`N/A`, tooltip or short explanation where ambiguous.

Charts/table as in REQ §5. Empty chart states must remain usable.

## Empty and edge cases (minimum)

No clients; no active clients; no new in period; no churned in period;
no product assignments; Active Clients = 0; opening base = 0; selected
range with no events; product with zero active clients. No NaN,
Infinity, or undefined.

## Authorization

Reuse AUTH-001. ADMIN and VIEWER: view only. Unauthenticated: existing
login/deny behaviour. UI hiding is not sufficient; data access stays
on the existing database authorization model.

## Out of scope

See REQ. Explicitly no product-level churn.

## Traceability

[traceability.md](traceability.md)
