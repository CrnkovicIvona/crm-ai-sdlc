# Traceability matrix

Chain: Business Requirement → Functional Requirement → User Story →
Acceptance Criterion → BDD Scenario → Test Case → Technical Design
Element → Implementation.

| Issue                                                                | REQ                     | FR                             | US     | AC                     | BDD                                   | TC                     | TDE / TS                                                                 | Implementation                                            | Risk |
| -------------------------------------------------------------------- | ----------------------- | ------------------------------ | ------ | ---------------------- | ------------------------------------- | ---------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------- | ---- |
| ENG-001                                                              | —                       | —                              | —      | —                      | —                                     | —                      | ADR-0001, ADR-0002                                                       | Foundation CI: Prettier, commitlint, gitleaks (no `src/`) | Low  |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001                 | FR-001, FR-006, FR-012         | US-001 | AC-001, AC-002, AC-008 | [bdd/AUTH-001.md](../bdd/AUTH-001.md) | TC-001, TC-002         | TDE-001, TDE-002, TDE-004; [TS](../specifications/technical/AUTH-001.md) | none                                                      | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001, BD-004         | FR-009                         | US-001 | AC-009                 | [bdd/AUTH-001.md](../bdd/AUTH-001.md) | TC-007                 | TDE-002; [TS](../specifications/technical/AUTH-001.md)                   | none                                                      | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001, BD-007         | FR-002, FR-010                 | US-002 | AC-003, AC-010         | [bdd/AUTH-001.md](../bdd/AUTH-001.md) | TC-002, TC-008         | TDE-001, TDE-004; [TS](../specifications/technical/AUTH-001.md)          | none                                                      | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001, BD-003, BD-006 | FR-003, FR-004, FR-005, FR-011 | US-003 | AC-004, AC-005, AC-011 | [bdd/AUTH-001.md](../bdd/AUTH-001.md) | TC-003, TC-004, TC-009 | TDE-005, TDE-006, TDE-007; [TS](../specifications/technical/AUTH-001.md) | none                                                      | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001, BD-005, BD-007 | FR-007, FR-008                 | US-004 | AC-006, AC-007         | [bdd/AUTH-001.md](../bdd/AUTH-001.md) | TC-005, TC-006         | TDE-003, TDE-004; [TS](../specifications/technical/AUTH-001.md)          | none                                                      | High |

Functional specification: [FS-AUTH-001](../specifications/functional/AUTH-001.md).
Decisions (approved): [AUTH-001-decisions.md](../decisions/AUTH-001-decisions.md).
Frontend ADR: [ADR-0002](../adr/0002-vite-react-typescript.md).

Playwright candidates TC-001–TC-009 are test architecture (TDE-008),
not listed as product TDEs.

## Gaps

- Implementation column is empty: no `src/`, no `feature/` branch.
- TC-003/TC-004 cannot observe resource-level writes until a future
  CRM module exists (BD-006). The permission model is still specified.
- Automated path: `not automated`.
- Human Definition of Ready is **not** recorded.

Release: [REL-001](../releases/REL-001.md), [REL-002](../releases/REL-002.md).
