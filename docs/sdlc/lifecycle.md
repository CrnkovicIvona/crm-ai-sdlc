# Feature lifecycle

This document orchestrates BankCRM delivery. Cursor skills implement
procedures; they do not replace this sequence. The
`feature-orchestrator` skill maps **state → next skill** and must not
bypass human approval gates.

## End-to-end sequence

REQUESTED → REQUIREMENTS → **Functional Specification** → User Stories
→ Acceptance Criteria → BDD/Gherkin → Test Cases → Test Plan →
Traceability → **Technical Specification** → **Definition of Ready
(human)** → **`READY`** → Implementation Plan → **Human plan approval**
→ **`PLANNED`** → Feature Branch → Development → Unit Tests →
Integration Tests → Playwright/E2E Tests
→ Test Execution → Healing/Fix → Regression → Test Report → Bug
Management if required → Code Review → Pull Request → `test` branch →
CI/QA Gate → **Human Approval** → Release Pull Request → `main` →
Vercel Production → Post-deployment Smoke Tests

AUTH-001 already had stories, AC, BDD, and tests before a dedicated
functional specification. That work was not restarted; FS and TS were
added while remaining in `SPECIFIED`. New work follows the sequence
above.

## Lifecycle states

States are sequential. The current state is the **earliest incomplete**
state, even if later artifacts exist.

| State               | Meaning                                                                      | Typical skill                                                | Human gate?                                  |
| ------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------- |
| `REQUESTED`         | Issue or business request exists                                             | `analyze-requirements`                                       | No                                           |
| `REQUIREMENTS`      | Requirements and functional specification being written                      | `analyze-requirements`, `author-specifications` (functional) | No                                           |
| `SPECIFIED`         | REQ, functional spec, US, AC, BDD, tests, traceability, technical spec exist | `author-specifications` (technical) then **STOP**            | **Yes → `READY`** (DoR)                      |
| `READY`             | Definition of Ready accepted                                                 | `plan-implementation`                                        | **Yes → `PLANNED`** (plan approval)          |
| `PLANNED`           | Implementation plan approved; branch may be created                          | Implementation                                               | No (gate already passed)                     |
| `IN_DEVELOPMENT`    | Application or test automation in progress                                   | (implement)                                                  | No                                           |
| `TESTING`           | Planned tests are being executed                                             | `execute-tests`                                              | No                                           |
| `HEALING`           | Failures being diagnosed and remediating                                     | `heal`                                                       | No                                           |
| `REGRESSION`        | Risk-based regression executing                                              | `execute-tests`                                              | No                                           |
| `READY_FOR_PR`      | Evidence, report, and review complete                                        | `report-tests`, `review-code`, `prepare-pr`                  | No                                           |
| `IN_QA`             | PR open against `test`; CI and QA running                                    | wait / heal CI                                               | **Yes → `READY_FOR_RELEASE`**                |
| `READY_FOR_RELEASE` | QA approved; release PR may be prepared                                      | `release-and-verify`                                         | **Yes → `RELEASED`** (human merge to `main`) |
| `RELEASED`          | On `main`; production deploy and smoke                                       | `release-and-verify` (smoke)                                 | Production data changes still gated          |

`TESTING` moves to `HEALING` on required failures, then back to
`TESTING` after remediation. `REGRESSION` failures also enter `HEALING`.

## Risk-based testing

Full regression is **not** required for every change. Scope is set in
the test plan from impact and risk. See
[risk-based-testing.md](risk-based-testing.md).

## Roles

| Actor    | Owns                                                                                                |
| -------- | --------------------------------------------------------------------------------------------------- |
| Human    | Product truth, DoR, plan approval, QA approval, merge to `main`, production deploy, production data |
| AI agent | Drafting artifacts, implementation on feature branches, tests, reports, PR preparation              |
| CI       | Format, secret scan, commitlint now; lint/unit/e2e when the app exists                              |

## Related documents

- [definition-of-ready.md](definition-of-ready.md)
- [definition-of-done.md](definition-of-done.md)
- [human-approval.md](human-approval.md)
- [testing-strategy.md](testing-strategy.md)
- [../ai/operating-model.md](../ai/operating-model.md)
