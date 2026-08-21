# Traceability matrix

| Issue                                                                | REQ     | US     | AC             | BDD                  | TC             | Automated test path                           | Risk |
| -------------------------------------------------------------------- | ------- | ------ | -------------- | -------------------- | -------------- | --------------------------------------------- | ---- |
| ENG-001                                                              | —       | —      | —              | —                    | —              | Foundation CI: Prettier, commitlint, gitleaks | Low  |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001 | US-001 | AC-001, AC-002 | docs/bdd/AUTH-001.md | TC-001, TC-002 | not automated                                 | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001 | US-002 | AC-003         | docs/bdd/AUTH-001.md | TC-002         | not automated                                 | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001 | US-003 | AC-004, AC-005 | docs/bdd/AUTH-001.md | TC-003, TC-004 | not automated                                 | High |
| AUTH-001 [#5](https://github.com/CrnkovicIvona/crm-ai-sdlc/issues/5) | REQ-001 | US-004 | AC-006, AC-007 | docs/bdd/AUTH-001.md | TC-005, TC-006 | not automated                                 | High |

Release: [REL-001](../releases/REL-001.md) promoted ENG-001 to `main`.
[REL-002](../releases/REL-002.md) promotes the Git sync rules (`release/<rel-id>` → `main`, then into `test`).

Product rows are added only from approved requirements.
