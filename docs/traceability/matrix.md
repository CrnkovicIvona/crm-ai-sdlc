# Traceability matrix

Chain: Business Requirement → Functional Requirement → User Story →
Acceptance Criterion → BDD Scenario → Test Case → Technical Design
Element → Implementation.

| Issue                                                                | REQ                     | FR                             | US              | AC                     | BDD                                                   | TC                     | TDE / TS                                                                 | Implementation                                                                           | Risk |
| -------------------------------------------------------------------- | ----------------------- | ------------------------------ | --------------- | ---------------------- | ----------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ---- |
| ENG-001                                                              | —                       | —                              | —               | —                      | —                                                     | —                      | ADR-0001, ADR-0002                                                       | Foundation CI: Prettier, commitlint, gitleaks (no `src/`)                                | Low  |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001                 | FR-001, FR-006, FR-012         | US-001          | AC-001, AC-002, AC-008 | [bdd/AUTH-001.md](../bdd/AUTH-001.md)                 | TC-001, TC-002         | TDE-001, TDE-002, TDE-004; [TS](../specifications/technical/AUTH-001.md) | `src/pages/LoginPage.tsx`, `src/auth/RequireAuth.tsx`, `tests/e2e/auth.spec.ts`          | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001, BD-004         | FR-009                         | US-001          | AC-009                 | [bdd/AUTH-001.md](../bdd/AUTH-001.md)                 | TC-007                 | TDE-002; [TS](../specifications/technical/AUTH-001.md)                   | `src/lib/errors.ts`, `tests/unit/errors.test.ts`, `tests/e2e/auth.spec.ts`               | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001, BD-007         | FR-002, FR-010                 | US-002          | AC-003, AC-010         | [bdd/AUTH-001.md](../bdd/AUTH-001.md)                 | TC-002, TC-008         | TDE-001, TDE-004; [TS](../specifications/technical/AUTH-001.md)          | `src/auth/RequireAuth.tsx`, `tests/e2e/auth.spec.ts`                                     | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001, BD-003, BD-006 | FR-003, FR-004, FR-005, FR-011 | US-003          | AC-004, AC-005, AC-011 | [bdd/AUTH-001.md](../bdd/AUTH-001.md)                 | TC-003, TC-004, TC-009 | TDE-005, TDE-006, TDE-007; [TS](../specifications/technical/AUTH-001.md) | `src/lib/access.ts`, `src/pages/AppShell.tsx`, `tests/e2e/roles.spec.ts`                 | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001, BD-005, BD-007 | FR-007, FR-008                 | US-004          | AC-006, AC-007         | [bdd/AUTH-001.md](../bdd/AUTH-001.md)                 | TC-005, TC-006         | TDE-003, TDE-004; [TS](../specifications/technical/AUTH-001.md)          | `src/lib/auth.ts`, `src/pages/AppShell.tsx`, `tests/e2e/auth.spec.ts`                    | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001, BD-008         | FR-013                         | US-002          | AC-012                 | [bdd/AUTH-001.md](../bdd/AUTH-001.md)                 | (none; unit)           | TDE-001, TD-008; [TS](../specifications/technical/AUTH-001.md)           | `src/lib/access.ts`, `src/pages/AccessDeniedPage.tsx`, `tests/unit/require-auth.test.ts` | High |
| CRM-001 (no Issue yet)                                               | REQ-CRM-001             | FR-C001–FR-C013                | US-C001–US-C006 | AC-C001–AC-C019        | [features/CRM-001/bdd.md](../features/CRM-001/bdd.md) | TC-C001–TC-C019        | TDE-C001–TDE-C008; [TS](../features/CRM-001/technical-spec.md)           | none                                                                                     | High |

Functional specification: [FS-AUTH-001](../specifications/functional/AUTH-001.md).
CRM-001 pack: [../features/CRM-001/](../features/CRM-001/).
Decisions (approved): [AUTH-001-decisions.md](../decisions/AUTH-001-decisions.md).
Frontend ADR: [ADR-0002](../adr/0002-vite-react-typescript.md).

Playwright candidates TC-001–TC-009 are test architecture (TDE-008),
not listed as product TDEs.

## Gaps

- AUTH-001 implementation is on `src/` and `main` (**`ON_MAIN`**, not
  `RELEASED`). Production smoke was not executed. Live Auth Playwright
  cases are skipped without GitHub/local `E2E_*` secrets (SKIPPED, not
  PASSED). Merge to `main` is not verification.
- TC-003/TC-004 cannot observe resource-level writes until CRM-001 is
  **implemented** (still specified under `docs/features/CRM-001/`).
- AUTH-001 human Definition of Ready **is** recorded on Issue #5.
  Implementation plan is **Approved** (`PLANNED`). CRM-001 DoR is
  **not** recorded.
- CRM-001 has no GitHub Issue yet (`docs/features/CRM-001/issue-draft.md`).

Release: [REL-001](../releases/REL-001.md), [REL-002](../releases/REL-002.md).
