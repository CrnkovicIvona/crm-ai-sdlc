---
name: feature-orchestrator
description: Orchestrate the BankCRM feature lifecycle. Determine the current SDLC state, the next required skill, and whether a human approval gate blocks progress. Use at the start of feature work and whenever phase is unclear.
---

# Feature orchestrator

Use this skill to **route** work. Do not implement product behavior here. Do not skip phases. Do not mark human gates as passed without a recorded human decision.

## Lifecycle states (in order)

1. `REQUESTED`
2. `REQUIREMENTS`
3. `SPECIFIED`
4. `READY`
5. `PLANNED`
6. `IN_DEVELOPMENT`
7. `TESTING`
8. `HEALING`
9. `REGRESSION`
10. `READY_FOR_PR`
11. `IN_QA`
12. `READY_FOR_RELEASE`
13. `RELEASED`

Canonical definitions: `docs/sdlc/lifecycle.md`.

## How to determine current state

Inspect, in order:

1. GitHub Issue labels/body and comments (human approvals)
2. Presence and completeness of artifacts under `docs/`
3. Whether an implementation plan exists and was approved
4. Branch type and whether application diffs exist
5. Test reports and execution evidence under `docs/test-reports/`
6. Open bugs for this feature ID
7. Pull request target (`test` vs `main`) and review/CI status

If artifacts for a later state exist but an earlier state is incomplete, the current state is the **earliest incomplete** state. Do not "fast-forward".

## State → next skill

| Current state           | Next skill                                                                                  | Notes                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `REQUESTED`             | `analyze-requirements`                                                                      | Create/clarify requirements only from the request             |
| `REQUIREMENTS`          | `analyze-requirements` then `author-specifications` (functional) then `author-user-stories` | Stay until REQ + functional spec exist; do not invent answers |
| After stories/AC exist  | `author-bdd` then `plan-tests`                                                              | Then fill traceability                                        |
| After traceability      | `author-specifications` (technical)                                                         | Reuse ADRs; mark technical TBDs; still `SPECIFIED`            |
| `SPECIFIED`             | **STOP for human DoR gate**                                                                 | Do not enter `READY` yourself; FS + TS required               |
| `READY`                 | `plan-implementation`                                                                       | Then **STOP for human plan approval**                         |
| `PLANNED`               | Implementation against the approved plan                                                    | No dedicated coding skill; still obey guardrails              |
| `IN_DEVELOPMENT`        | Continue implementation; add automated tests as specified                                   | Do not claim TESTING until execution starts                   |
| `TESTING`               | `execute-tests`                                                                             | Evidence only; no silent healing                              |
| Failures during testing | `HEALING` → `heal`                                                                          | Then return to `TESTING`                                      |
| `HEALING`               | `heal`                                                                                      | Then `execute-tests` for the affected tests                   |
| Green targeted tests    | `REGRESSION`                                                                                | Scope from the test plan (risk-based)                         |
| `REGRESSION`            | `execute-tests` (regression scope)                                                          | Failures → `HEALING`                                          |
| Regression complete     | `report-tests` then `review-code`                                                           | Then `READY_FOR_PR`                                           |
| `READY_FOR_PR`          | `prepare-pr`                                                                                | PR must target `test`                                         |
| `IN_QA`                 | Wait for CI and **human QA approval**                                                       | Agent may fix CI on the feature branch via heal/tests         |
| `READY_FOR_RELEASE`     | `release-and-verify`                                                                        | Prepare release PR only; human merges to `main`               |
| `RELEASED`              | `release-and-verify` post-deploy smoke                                                      | Requires verifiable production evidence                       |

`author-specifications` produces the functional spec (after requirements, before stories on new work) and the technical spec (after traceability, before DoR). `author-adr` is invoked when a durable **platform** decision is required (including unresolved items listed in the technical spec). `manage-bugs` is invoked when a defect is found (any state after `TESTING`, and production escapes after `RELEASED`).

## Human gates (cannot be bypassed)

- `SPECIFIED` → `READY`: human confirms Definition of Ready
- `READY` → `PLANNED`: human approves the implementation plan (no app implementation before this)
- `IN_QA` → `READY_FOR_RELEASE`: human CI/QA approval
- `READY_FOR_RELEASE` → `RELEASED`: human merge to `main` (agent never merges `main`, never deploys production)

If the user asks to skip a gate, refuse and state which gate is blocking.

## Output each time this skill runs

1. Feature ID / Issue
2. Current state
3. Evidence used to classify the state
4. Next skill or wait-for-human
5. Blockers
6. What you will **not** do yet
