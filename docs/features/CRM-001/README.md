# CRM-001: Client records

- Risk: **High** (authorization, personal data, DELETE, audit, RLS)
- State: **`ON_MAIN` — not `RELEASED`** (REL-004). Human QA on `test`
  recorded 2026-08-24. Automated High pack **PASSED** CI SHA `456c9a2`.
  Production smoke **not executed**. Agent does not merge `main`.
- GitHub Issue: none (App/MCP blocked). Ready and PLANNED recorded in
  chat.
- Gate 1 pack: [dor-gate-1.md](dor-gate-1.md) (§5.1 and §5.2 **accepted**)
- Gate 2 plan: [implementation-plan.md](implementation-plan.md)
  (**Revised Gate 2** / `PLANNED`)
- Depends on: AUTH-001 (`RELEASED`)

This folder is the CRM-001 feature pack. Release notes:
[../../releases/REL-004.md](../../releases/REL-004.md). Do not apply
SQL to production from the agent. Do not claim `RELEASED` without
production smoke PASSED.

| Artifact            | File                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| REQ                 | [requirement.md](requirement.md)                                                  |
| FS                  | [functional-spec.md](functional-spec.md)                                          |
| TS                  | [technical-spec.md](technical-spec.md)                                            |
| Decision log        | [decisions.md](decisions.md)                                                      |
| User stories / AC   | [user-stories.md](user-stories.md)                                                |
| BDD                 | [bdd.md](bdd.md)                                                                  |
| Test cases          | [test-cases.md](test-cases.md)                                                    |
| Test plan           | [test-plan.md](test-plan.md)                                                      |
| Traceability        | [traceability.md](traceability.md)                                                |
| Gate 1 DoR pack     | [dor-gate-1.md](dor-gate-1.md)                                                    |
| Implementation plan | [implementation-plan.md](implementation-plan.md) (**Revised Gate 2** / `PLANNED`) |
| UI/UX proposal      | [ui-ux-proposal.md](ui-ux-proposal.md) (**Proposed** — waiting for PO)            |
| Issue draft         | [issue-draft.md](issue-draft.md)                                                  |

Index: [../../traceability/matrix.md](../../traceability/matrix.md).
Orchestrator: `.cursor/skills/feature-orchestrator/SKILL.md`.
UX/UI proposals: `.cursor/skills/ui-ux-redesign/SKILL.md`.
