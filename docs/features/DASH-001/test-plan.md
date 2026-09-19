# Test plan: DASH-001

- Work item: DASH-001
- Issue: none
- Risk: **High**
- Status of tests: **EXECUTED** on `test` CI (Vitest + Playwright).
  Production smoke: **NOT EXECUTED**. **ON_MAIN — not RELEASED.**
- Owner (draft): Agent as QA
- Approval: DoR 2026-09-13
- Report: [../../test-reports/DASH-001.md](../../test-reports/DASH-001.md)

## In scope

TC-D001–TC-D015 as [test-cases.md](test-cases.md).

**Unit** (`dashboardMetrics.test.ts`): business correctness of frozen
metrics (AC-D003–D013). Do not prove all BI via Playwright.

**E2E** (`dashboard.spec.ts`): access, AUTH, visible filter default,
empty/error UI, schema missing **FAIL**. **TC-D015** is integration
`tests/integration/dashboard-stamps.test.ts` (SKIPPED without secrets
or stamps view; skip ≠ pass).

**Integration:** not required if unit + existing CRM RLS SELECT is
enough. If a dashboard query is denied by RLS, **STOP** (TD), do not
weaken tests.

## Out of scope

CRM-001 C008 match oracle. Product-level churn. Claiming EXECUTED
here.

## Environments

Same as CRM-001: Vitest unit without live DB; Playwright with `E2E_*`
on CI; anon key only. No `VITE_*` service role.

## Regression

Existing AUTH and CRM packs **must still run**. DASH-001 **adds**
files. Do not delete prior tests.

## Entry / exit

Entry: FS + AC + this plan. Exit for READY_FOR_PR: executed evidence
in a test report. Exit for `RELEASED`: production smoke PASSED (later).

## Security

Do not fetch PII columns for KPIs. Do not skip High-pack failures.
