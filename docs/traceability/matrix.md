# Traceability matrix

Chain: Business Requirement → Functional Requirement → User Story →
Acceptance Criterion → BDD Scenario → Test Case → Technical Design
Element → Implementation.

| Issue                                                                | REQ     | FR                     | US     | AC             | BDD                                   | TC             | TDE / TS                                                                 | Implementation                                            | Risk |
| -------------------------------------------------------------------- | ------- | ---------------------- | ------ | -------------- | ------------------------------------- | -------------- | ------------------------------------------------------------------------ | --------------------------------------------------------- | ---- |
| ENG-001                                                              | —       | —                      | —      | —              | —                                     | —              | ADR-0001                                                                 | Foundation CI: Prettier, commitlint, gitleaks (no `src/`) | Low  |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001 | FR-001, FR-006         | US-001 | AC-001, AC-002 | [bdd/AUTH-001.md](../bdd/AUTH-001.md) | TC-001, TC-002 | TDE-001, TDE-002, TDE-004; [TS](../specifications/technical/AUTH-001.md) | none                                                      | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001 | FR-002                 | US-002 | AC-003         | [bdd/AUTH-001.md](../bdd/AUTH-001.md) | TC-002         | TDE-001, TDE-004; [TS](../specifications/technical/AUTH-001.md)          | none                                                      | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001 | FR-003, FR-004, FR-005 | US-003 | AC-004, AC-005 | [bdd/AUTH-001.md](../bdd/AUTH-001.md) | TC-003, TC-004 | TDE-005, TDE-006, TDE-007; [TS](../specifications/technical/AUTH-001.md) | none                                                      | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001 | FR-007, FR-008         | US-004 | AC-006, AC-007 | [bdd/AUTH-001.md](../bdd/AUTH-001.md) | TC-005, TC-006 | TDE-003, TDE-004; [TS](../specifications/technical/AUTH-001.md)          | none                                                      | High |

Functional specification: [FS-AUTH-001](../specifications/functional/AUTH-001.md).
Proposed decisions (not approved): [AUTH-001-decisions.md](../decisions/AUTH-001-decisions.md).

Playwright candidates TC-001–TC-006 are **test architecture** (TS
TDE-008), not product design elements, so they are not listed in the
TDE column.

## Gaps

- Implementation column is empty: no `src/`, no feature branch.
- TDE-002 (sign-in method) blocked on business login-method decision.
- TDE-005–TDE-007 blocked on role storage and authorization-enforcement decisions.
- TDE-006 cannot be observed until “full” vs “read-only” is defined against real CRM capabilities (functional Q7).
- Automated test path remains `not automated` (Playwright candidates TC-001–TC-006).
- REQ-001, FS, and TS are Draft; human DoR is not recorded.
- AUTH-001 decision log exists as **PROPOSED** only.

Release: [REL-001](../releases/REL-001.md) promoted ENG-001 to `main`.
[REL-002](../releases/REL-002.md) promotes the Git sync rules (`release/<rel-id>` → `main`, then into `test`).

Product rows are added only from approved requirements.
