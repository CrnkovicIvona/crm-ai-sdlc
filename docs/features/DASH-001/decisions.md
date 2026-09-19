# DASH-001 decision log

- Work item: DASH-001
- Issue: none
- Risk: High
- Owner (draft / approve): Agent / Human PO
- Source: Cursor DASH-001 plan; PO refinements; chat **odobreno**
  2026-09-13; BD-D009 chat 2026-09-19
- Approval: BD-D001–BD-D009 **APPROVED** (BD-D009: 2026-09-19).
  TD-D001–TD-D005 **APPROVED** (TD-D005: 2026-09-19).
- Status of log: **APPROVED** for BD-D001–D009 and TD-D001–D005
- Traceability: [functional-spec.md](functional-spec.md)

Gate 1 Ready does **not** authorize `src/` until the implementation
plan is Approved **and** the human asks to code (execution gate).

Platform: ADR-0001, ADR-0002, AUTH-001 session/roles, CRM-001 schema.

---

## Business decisions (approved)

### BD-D001 Active Clients vs date filter

| Field          | Value                                                                |
| -------------- | -------------------------------------------------------------------- |
| Decision       | Does the date filter apply to Active Clients?                        |
| Approved value | **No.** Current-state KPI only. FS sentence and UI tooltip required. |
| Status         | **APPROVED**                                                         |

### BD-D002 Churn Rate when opening base is 0

| Field          | Value                                                              |
| -------------- | ------------------------------------------------------------------ |
| Decision       | Display when opening active base is 0                              |
| Approved value | **`N/A`**, including churned = 0 and churned > 0. Never 0% or NaN. |
| Status         | **APPROVED**                                                       |

### BD-D003 Period interval

| Field          | Value                                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision       | Inclusive/exclusive bounds and This year                                                                                                          |
| Approved value | `[start, end)` UTC. This year: `YYYY-01-01T00:00:00Z` to **now**. Not 31 Dec 23:59:59. Custom: start-of-day start through start of day after end. |
| Status         | **APPROVED**                                                                                                                                      |

### BD-D004 Partial-month Client Base Trend

| Field          | Value                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------- |
| Decision       | Stock point when the selected range does not cover a full calendar month                          |
| Approved value | Stock at the **end of the selected period portion** for that month, not a date outside the range. |
| Status         | **APPROVED**                                                                                      |

### BD-D005 Distinct clients by product

| Field          | Value                                                     |
| -------------- | --------------------------------------------------------- |
| Decision       | Count assignments vs distinct clients                     |
| Approved value | Distinct client ids among **active** clients per product. |
| Status         | **APPROVED**                                              |

### BD-D006 No product-level churn

| Field          | Value                                              |
| -------------- | -------------------------------------------------- |
| Decision       | Churn by product                                   |
| Approved value | **Out of scope.** No historical product ownership. |
| Status         | **APPROVED**                                       |

### BD-D007 Dashboard roles

| Field          | Value                                                             |
| -------------- | ----------------------------------------------------------------- |
| Decision       | Who may open `/app/dashboard`                                     |
| Approved value | ADMIN and VIEWER, read-only. Unauthenticated: AUTH-001 behaviour. |
| Status         | **APPROVED**                                                      |

### BD-D008 No new analytics tables

| Field          | Value                                                                |
| -------------- | -------------------------------------------------------------------- |
| Decision       | Schema for DASH-001                                                  |
| Approved value | Existing CRM-001 tables. Stop if a frozen metric cannot be computed. |
| Status         | **APPROVED**                                                         |

### BD-D009 Role metric parity

| Field          | Value                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------- |
| Decision       | May VIEWER see different KPI values than ADMIN for the same period?                            |
| Approved value | **No.** VIEWER must see the same truth as ADMIN. Write denial does not reduce dashboard truth. |
| Status         | **APPROVED** (chat 2026-09-19)                                                                 |
| Note           | BUG-004. HOW remains TD-D005 Proposed.                                                         |

---

## Technical decisions (approved)

### TD-D001 Time zone

| Field               | Value                               |
| ------------------- | ----------------------------------- |
| Decision            | Clock for periods and month buckets |
| Approved value      | **UTC**                             |
| Conflicts with ADR? | No                                  |
| Status              | **APPROVED**                        |

### TD-D002 Columns fetched

| Field               | Value                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Decision            | Client fields on the dashboard query                                                                                |
| Approved value      | Only `id`, `created_at`, `deleted_at` (plus assignment and product catalog ids/names). No names, email, phone, OIB. |
| Conflicts with ADR? | No                                                                                                                  |
| Status              | **APPROVED**                                                                                                        |

### TD-D003 Charts

| Field               | Value                                                               |
| ------------------- | ------------------------------------------------------------------- |
| Decision            | Chart library                                                       |
| Approved value      | **No new npm chart package.** SVG/CSS in existing Vite/React stack. |
| Conflicts with ADR? | No                                                                  |
| Status              | **APPROVED**                                                        |

### TD-D004 Product catalog source

| Field               | Value                             |
| ------------------- | --------------------------------- |
| Decision            | Hard-coded product codes vs table |
| Approved value      | Live **`products` table**.        |
| Conflicts with ADR? | No                                |
| Status              | **APPROVED**                      |

### TD-D005 Dashboard stamps vs `clients` RLS

| Field               | Value                                                                                                                                                                                                                               |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision            | How VIEWER gets `created_at` / `deleted_at` for deleted rows without CRM write rights                                                                                                                                               |
| Approved value      | Stamps-only view (`client_lifecycle_stamps`: `id`, `created_at`, `deleted_at` including soft-deleted) for ADMIN and VIEWER. Do **not** widen full-row `clients` SELECT of deleted rows to VIEWER (PII). CRM list stays active-only. |
| Conflicts with ADR? | No. BD-D008 still forbids a warehouse/facts table.                                                                                                                                                                                  |
| Status              | **APPROVED** (chat 2026-09-19)                                                                                                                                                                                                      |
