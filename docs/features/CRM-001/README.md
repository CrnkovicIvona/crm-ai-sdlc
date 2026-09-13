# CRM-001: Client records

- Risk: **High** (authorization, personal data, DELETE, audit, RLS)
- State: **`RELEASED`** (REL-004 product on `main`; REL-005
  apply-schema + production smoke **PASSED**
  [run 34753193389](https://github.com/CrnkovicIvona/crm-ai-sdlc/actions/runs/34753193389)).
  C008 match oracle still **BLOCKED**. Agent does not merge `main`.
- GitHub Issue: none (App/MCP blocked). Ready and PLANNED recorded in
  chat.
- Gate 1 pack: [dor-gate-1.md](dor-gate-1.md) (§5.1 and §5.2 **accepted**)
- Gate 2 plan: [implementation-plan.md](implementation-plan.md)
  (**Revised Gate 2** / `PLANNED`)
- Depends on: AUTH-001 (`RELEASED`)

This folder is the CRM-001 feature pack. Release notes:
[../../releases/REL-004.md](../../releases/REL-004.md),
[../../releases/REL-005.md](../../releases/REL-005.md). Do not apply
SQL to production from the agent.

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
