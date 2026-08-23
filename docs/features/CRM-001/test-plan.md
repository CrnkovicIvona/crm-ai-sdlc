# Test plan: CRM-001

- Work item: CRM-001
- Issue: none yet
- Risk level: **High**
- Impact summary: Client PII (including OIB), ADMIN DELETE, VIEWER
  restrictions, RLS boundary, append-only audit.
- Status of tests: **IMPLEMENTED**. Unit tests always run. Credentialed
  e2e and RLS integration are **SKIPPED** without secrets (skipped ≠
  passed). Not Gate 3 complete until a human reviews Preview and
  executed High cases.
- Owner (draft): Agent as QA
- Approval: Human DoR not recorded

## In scope

TC-C001–TC-C022 as designed in [test-cases.md](test-cases.md).

When an application exists (state `PLANNED`+): Playwright for
user-visible CRUD/search/deny; Vitest integration for RLS-as-boundary
and audit writes.

## Out of scope

- Claiming PASSED for suites that were SKIPPED
- AUTH-001 login/logout (reuse AUTH-001 pack at implementation)
- Invented validation/search/pagination cases
- Auditing failed attempts
- DASH-001
- Reporting PASSED for ESLint/Vitest/Playwright while SKIPPED

## Regression pack

After implementation: TC-C001–TC-C019 plus AUTH-001 TC-001–TC-009.
Skipping the High pack requires a human.

## Environments

Specification only. Later: local Vite + non-prod Supabase / QA
Preview per implementation plan. No production data.

## Security review

Required before `READY_FOR_PR`:

- VIEWER cannot CUD at UI **and** database
- Fail-closed missing profile (AUTH-001) still blocks Client routes
- Audit append-only; no client-side disable of audit
- No service role in the browser
- PII in logs minimized (`TBD` exact log policy)

## Entry / exit

- Entry to implementation: human DoR **and** human-approved plan
  (`PLANNED`)
- Exit of this document: design complete; **not** Ready; **not**
  executed

## Healing

Failures later go to `heal`; re-run via `execute-tests`.
