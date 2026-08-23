# Test plan: CRM-001

- Work item: CRM-001
- Issue: none yet
- Risk level: **High**
- Impact summary: Client PII (including OIB), ADMIN DELETE, VIEWER
  restrictions, RLS boundary, append-only audit.
- Status of tests: **IMPLEMENTED**. SHA `1c98f14`: unit **PASSED**;
  e2e **PASSED** in CI (11/11). RLS integration **BLOCKED** (6 skipped).
  Gate 3 **not** complete. Report: [../../test-reports/CRM-001.md](../../test-reports/CRM-001.md).
- Owner (draft): Agent as QA
- Approval: Human DoR not recorded

## In scope

TC-C001–TC-C022 as designed in [test-cases.md](test-cases.md).
Automation exists on this branch (see test-cases automation map).
Credentialed e2e/RLS without secrets: runner skip, recorded as
**BLOCKED** for Gate 3 (not PASSED).

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

This branch: local Vite + non-prod Supabase / QA Preview per
implementation plan. No production data. Secrets required for
credentialed e2e and RLS; missing secrets → SKIPPED in the runner,
**BLOCKED** for Gate 3 / DoD.

## Security review

Required before `READY_FOR_PR`:

- VIEWER cannot CUD at UI **and** database
- Fail-closed missing profile (AUTH-001) still blocks Client routes
- Audit append-only; no client-side disable of audit
- No service role in the browser
- PII in logs minimized (`TBD` exact log policy)

## Entry / exit (ISTQB levels)

Entry: human DoR **and** human-approved plan (`PLANNED`) — recorded in
chat 2026-08-23. P/N/E matrix in [test-cases.md](test-cases.md).

Exit of **this design document:** automation mapped.

Exit of **Gate 3 / DoD (High)** — all must hold:

| Level       | Criterion                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| Unit        | Field P/N/E in `tests/unit/clientValidation.test.ts` (and products) **executed**                          |
| Integration | TC-C012–C019 **PASSED** with evidence, or **BLOCKED** (secrets/oracle). Runner SKIP is not exit           |
| E2E         | TC-C001–C011, C020–C022 in-scope **PASSED** or **BLOCKED**. Missing product catalog is **FAIL**, not skip |
| Smoke       | AUTH/REL smoke only until CRM production smoke is specified; smoke PASS is not CRM TC PASS                |

Do not treat Gate 3 as met while required High TCs are SKIPPED without
a BLOCKED record.

## Healing

Failures later go to `heal`; re-run via `execute-tests`.
