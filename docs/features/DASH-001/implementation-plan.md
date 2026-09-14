# Implementation plan: DASH-001

- Work item: DASH-001
- Issue: none
- Owner: Agent (draft) / Human (approve coding)
- Source: DoR chat 2026-09-13; [functional-spec.md](functional-spec.md);
  Cursor plan approved (“odobreno”)
- Open questions: none blocking
- Approval: **Approved** 2026-09-14 (human: implement DASH-001 now).
  Metric contracts stay frozen. Status: **`ON_MAIN`** after REL-006
  merge. Not `RELEASED` until production smoke **PASSED**.
- Traceability: [traceability.md](traceability.md)
- Prerequisite: human DoR recorded 2026-09-13
- Status: **Approved** (`PLANNED`). Human approved coding 2026-09-14.
  Lifecycle after REL-006 merge: **`ON_MAIN`**.

This is **not** the FS or TS.

Implementation landed on `test` (PRs #41–#43) and is promoted to
`main` via REL-006. Agent does not merge `main` or claim `RELEASED`.

---

## 1. DoR evidence

PO 2026-09-13: DASH-001 prompt + refinements; chat **odobreno** on
the Cursor plan (Active Clients tooltip; `N/A`; This year `[start,
now)`; partial-month stock; DISTINCT clients; unit vs E2E split;
docs-before-code gate).

AUTH-001 and CRM-001 remain **`RELEASED`**.

---

## 2. Product rules (frozen)

BD-D001–BD-D008 and TD-D001–TD-D004 in [decisions.md](decisions.md).
Do not reinterpret metrics in code. If a metric cannot be computed
from the existing schema: **STOP**.

---

## 3. Scope of code changes

| Add / change                          | Role                                                                             |
| ------------------------------------- | -------------------------------------------------------------------------------- |
| `src/lib/dashboardMetrics.ts`         | First after coding approval: periods, KPIs, partial-month stock, DISTINCT, `N/A` |
| `tests/unit/dashboardMetrics.test.ts` | TC-D003–D013 (one `it` per TC id including D007a/D007b)                          |
| `src/lib/dashboard.ts`                | Fetch allowed columns; call metrics                                              |
| `src/pages/DashboardPage.tsx`         | UI + Active Clients tooltip                                                      |
| `src/App.tsx`                         | `path="dashboard"` under `/app`                                                  |
| `src/pages/AppShell.tsx`              | `nav-dashboard`                                                                  |
| `src/index.css`                       | Dashboard-only layout                                                            |
| `tests/e2e/dashboard.spec.ts`         | TC-D001, D002, D009-ui, D013-ui, D014 FAIL not skip                              |

No `supabase/migrations/` unless a later STOP requires a human TD.

Do not change CRM-001 list/form/RLS behaviour.

---

## 4. Mapping (one TC per automated case)

See [test-cases.md](test-cases.md) automation map. Do not group
ADMIN+VIEWER access into a single `test()` if that would hide which
AC failed: **two tests** for ADMIN and VIEWER under TC-D001 (or
TC-D001-admin / TC-D001-viewer). Unauthenticated is TC-D002.

---

## 5. Security notes

Anon client only. Timestamp-only client columns. Existing RLS.
Missing schema/query: FAIL. No service role in the SPA.

---

## 6. Rollout

PR to `test`. Production smoke and `RELEASED` are a later release
train. Rollback: revert the feature PR.

---

## 7. Out of scope

FS out of scope list. Approximating frozen metrics. Chart npm.
`RELEASED` status. Root README live banners.
