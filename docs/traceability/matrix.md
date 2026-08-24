# Traceability matrix

Chain: Business Requirement → Functional Requirement → User Story →
Acceptance Criterion → BDD Scenario → Test Case → Technical Design
Element → Implementation.

| Issue                                                                | REQ                     | FR                             | US              | AC                     | BDD                                                   | TC                     | TDE / TS                                                                 | Implementation                                                                                                                                                                                                                                                                                                                 | Risk |
| -------------------------------------------------------------------- | ----------------------- | ------------------------------ | --------------- | ---------------------- | ----------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| ENG-001                                                              | —                       | —                              | —               | —                      | —                                                     | —                      | ADR-0001, ADR-0002                                                       | Foundation CI: Prettier, commitlint, gitleaks (no `src/`)                                                                                                                                                                                                                                                                      | Low  |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001                 | FR-001, FR-006, FR-012         | US-001          | AC-001, AC-002, AC-008 | [bdd/AUTH-001.md](../bdd/AUTH-001.md)                 | TC-001, TC-002         | TDE-001, TDE-002, TDE-004; [TS](../specifications/technical/AUTH-001.md) | `src/pages/LoginPage.tsx`, `src/auth/RequireAuth.tsx`, `tests/e2e/auth.spec.ts`                                                                                                                                                                                                                                                | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001, BD-004         | FR-009                         | US-001          | AC-009                 | [bdd/AUTH-001.md](../bdd/AUTH-001.md)                 | TC-007                 | TDE-002; [TS](../specifications/technical/AUTH-001.md)                   | `src/lib/errors.ts`, `tests/unit/errors.test.ts`, `tests/e2e/auth.spec.ts`                                                                                                                                                                                                                                                     | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001, BD-007         | FR-002, FR-010                 | US-002          | AC-003, AC-010         | [bdd/AUTH-001.md](../bdd/AUTH-001.md)                 | TC-002, TC-008         | TDE-001, TDE-004; [TS](../specifications/technical/AUTH-001.md)          | `src/auth/RequireAuth.tsx`, `tests/e2e/auth.spec.ts`                                                                                                                                                                                                                                                                           | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001, BD-003, BD-006 | FR-003, FR-004, FR-005, FR-011 | US-003          | AC-004, AC-005, AC-011 | [bdd/AUTH-001.md](../bdd/AUTH-001.md)                 | TC-003, TC-004, TC-009 | TDE-005, TDE-006, TDE-007; [TS](../specifications/technical/AUTH-001.md) | `src/lib/access.ts`, `src/pages/AppShell.tsx`, `tests/e2e/roles.spec.ts`                                                                                                                                                                                                                                                       | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001, BD-005, BD-007 | FR-007, FR-008                 | US-004          | AC-006, AC-007         | [bdd/AUTH-001.md](../bdd/AUTH-001.md)                 | TC-005, TC-006         | TDE-003, TDE-004; [TS](../specifications/technical/AUTH-001.md)          | `src/lib/auth.ts`, `src/pages/AppShell.tsx`, `tests/e2e/auth.spec.ts`                                                                                                                                                                                                                                                          | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001, BD-008         | FR-013                         | US-002          | AC-012                 | [bdd/AUTH-001.md](../bdd/AUTH-001.md)                 | (none; unit)           | TDE-001, TD-008; [TS](../specifications/technical/AUTH-001.md)           | `src/lib/access.ts`, `src/pages/AccessDeniedPage.tsx`, `tests/unit/require-auth.test.ts`                                                                                                                                                                                                                                       | High |
| CRM-001 (no Issue yet)                                               | REQ-CRM-001             | FR-C001–FR-C016                | US-C001–US-C007 | AC-C001–AC-C022        | [features/CRM-001/bdd.md](../features/CRM-001/bdd.md) | TC-C001–TC-C022        | TDE-C001–TDE-C008; [TS](../features/CRM-001/technical-spec.md)           | `src/pages/ClientListPage.tsx`, `ClientFormPage.tsx`, `ClientDetailPage.tsx`, `src/lib/clients.ts`, `src/lib/products.ts`, `supabase/migrations/20260823190000_clients_and_audit.sql`, `supabase/migrations/20260823210000_products_and_soft_delete.sql`, `tests/e2e/clients.spec.ts`, `tests/integration/clients-rls.test.ts` | High |

Functional specification: [FS-AUTH-001](../specifications/functional/AUTH-001.md).
CRM-001 pack: [../features/CRM-001/](../features/CRM-001/).
Decisions (approved): [AUTH-001-decisions.md](../decisions/AUTH-001-decisions.md).
Frontend ADR: [ADR-0002](../adr/0002-vite-react-typescript.md).

Playwright candidates TC-001–TC-009 are test architecture (TDE-008),
not listed as product TDEs.

## Gaps

- AUTH-001 on `main` is **`RELEASED`** (REL-003 smoke 5/5, 2026-08-23,
  `https://crm-ai-sdlc.vercel.app`). Live Auth Playwright on branch
  SHA `456c9a2` **PASSED** in CI (11 e2e including AUTH). Production
  smoke **this SHA** SKIPPED ≠ PASSED. Historical 5/5 remains the
  release record.
- TC-003/TC-004 ADMIN vs VIEWER UI **PASSED** e2e CI `456c9a2`.
  RLS/audit: `tests/integration/clients-rls.test.ts` — 6 **PASSED**
  CI `456c9a2` (0 skipped). C008 match oracle still **BLOCKED**.
- AUTH-001 DoR on Issue #5. CRM-001 Gate 1/2 in chat 2026-08-23; no
  GitHub Issue. CRM-001 is **`ON_MAIN` — not `RELEASED`** (REL-004).
  Automated DoD High met on `456c9a2`. Human QA on `test` 2026-08-24.
  Production smoke **MISSING**.
- Phase 5/6: [test-reports/CRM-001.md](../test-reports/CRM-001.md),
  [test-reports/QA-CLOSEOUT-001.md](../test-reports/QA-CLOSEOUT-001.md).

Release: [REL-001](../releases/REL-001.md), [REL-002](../releases/REL-002.md),
[REL-003](../releases/REL-003.md) (`RELEASED`; smoke 5/5 PASS),
[REL-004](../releases/REL-004.md) (`ON_MAIN` — not `RELEASED`).
